import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PROPERTY_TYPE_LABELS, PropertyType } from '@/types/Property';
import {
  BarChart,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Building, Eye, MessageSquare } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const DAY = 24 * 60 * 60 * 1000;

type Slice = { name: string; value: number };

function countBy<T>(rows: T[], key: (row: T) => string): Slice[] {
  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(key(row), (counts.get(key(row)) || 0) + 1));
  return [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

// Keeps pies readable: top 5 slices, the rest grouped as "Other"
function topSlices(slices: Slice[], limit = 5): Slice[] {
  if (slices.length <= limit) return slices;
  const rest = slices.slice(limit - 1).reduce((sum, s) => sum + s.value, 0);
  return [...slices.slice(0, limit - 1), { name: 'Other', value: rest }];
}

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);
  const [monthlyViews, setMonthlyViews] = useState(0);
  const [monthlyInquiries, setMonthlyInquiries] = useState(0);
  const [pageViewsData, setPageViewsData] = useState<{ name: string; views: number }[]>([]);
  const [userInteractionsData, setUserInteractionsData] = useState<{ name: string; inquiries: number; consultations: number }[]>([]);
  const [propertyTypeData, setPropertyTypeData] = useState<Slice[]>([]);
  const [propertyStatusData, setPropertyStatusData] = useState<{ name: string; value: number }[]>([]);
  const [cityDistributionData, setCityDistributionData] = useState<Slice[]>([]);
  const [topListings, setTopListings] = useState<{ title: string; views: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const since30 = new Date(Date.now() - 29 * DAY);
      since30.setHours(0, 0, 0, 0);
      const since6m = new Date();
      since6m.setMonth(since6m.getMonth() - 5, 1);
      since6m.setHours(0, 0, 0, 0);

      const [listings, views, inquiries, consultations] = await Promise.all([
        supabase.from('listings').select('id, title, property_type, status, city').or('source.eq.manual,is_own_listing.eq.true'),
        supabase.from('listing_views').select('listing_id, viewed_at').gte('viewed_at', since30.toISOString()).limit(50000),
        supabase.from('inquiries').select('created_at').gte('created_at', since6m.toISOString()),
        supabase.from('consultations').select('created_at').gte('created_at', since6m.toISOString()),
      ]);
      const failed = [listings, views, inquiries, consultations].find((r) => r.error);
      if (failed?.error) {
        toast({ title: 'Error loading analytics', description: failed.error.message, variant: 'destructive' });
      }

      const listingRows = listings.data || [];
      const viewRows = views.data || [];
      const inquiryRows = inquiries.data || [];
      const consultationRows = consultations.data || [];

      setTotalProperties(listingRows.length);
      setMonthlyViews(viewRows.length);
      setMonthlyInquiries(inquiryRows.filter((r) => new Date(r.created_at) >= since30).length);

      // Views per day for the last 30 days
      const days = Array.from({ length: 30 }, (_, i) => new Date(since30.getTime() + i * DAY));
      const viewsByDay = new Map(days.map((d) => [d.toDateString(), 0]));
      viewRows.forEach((v) => {
        const key = new Date(v.viewed_at).toDateString();
        if (viewsByDay.has(key)) viewsByDay.set(key, viewsByDay.get(key)! + 1);
      });
      setPageViewsData(days.map((d) => ({
        name: d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }),
        views: viewsByDay.get(d.toDateString()) || 0,
      })));

      // Leads per month for the last 6 months
      const months = Array.from({ length: 6 }, (_, i) => new Date(since6m.getFullYear(), since6m.getMonth() + i, 1));
      const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
      const tally = (rows: { created_at: string }[]) => {
        const map = new Map<string, number>();
        rows.forEach((r) => map.set(monthKey(new Date(r.created_at)), (map.get(monthKey(new Date(r.created_at))) || 0) + 1));
        return map;
      };
      const inquiryMonths = tally(inquiryRows);
      const consultationMonths = tally(consultationRows);
      setUserInteractionsData(months.map((m) => ({
        name: m.toLocaleDateString('en-CA', { month: 'short' }),
        inquiries: inquiryMonths.get(monthKey(m)) || 0,
        consultations: consultationMonths.get(monthKey(m)) || 0,
      })));

      setPropertyTypeData(topSlices(countBy(listingRows, (l) => PROPERTY_TYPE_LABELS[l.property_type as PropertyType] || l.property_type)));
      const statusLabels: Record<string, string> = { active: 'Available', pending: 'Pending', sold: 'Sold', draft: 'Draft' };
      setPropertyStatusData(['active', 'pending', 'sold', 'draft'].map((st) => ({
        name: statusLabels[st],
        value: listingRows.filter((l) => l.status === st).length,
      })));
      setCityDistributionData(topSlices(countBy(listingRows, (l) => (l.city || 'Unknown').trim())));

      // Most viewed can include other brokerages' MLS® listings, so look their titles up directly
      const top = countBy(viewRows, (v) => v.listing_id).slice(0, 8);
      const { data: topRows } = top.length
        ? await supabase.from('listings').select('id, title').in('id', top.map((s) => s.name))
        : { data: [] };
      const titles = new Map((topRows || []).map((l) => [l.id, l.title]));
      setTopListings(top.map((s) => ({ title: titles.get(s.name) || 'Removed listing', views: s.value })));

      setLoading(false);
    };
    load();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-realtor-navy">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor site performance and user engagement</p>
      </div>
      
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-realtor-gold" /> 
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProperties}</div>
            <p className="text-sm text-muted-foreground">Jigar's listings, including drafts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-realtor-gold" /> 
              Listing Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monthlyViews.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Property page views, last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-realtor-gold" /> 
              Total Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monthlyInquiries}</div>
            <p className="text-sm text-muted-foreground">Website inquiries, last 30 days</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Tabs */}
      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="traffic" className="flex items-center">
            <LineChartIcon className="mr-2 h-4 w-4" /> Traffic
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" /> Properties
          </TabsTrigger>
          <TabsTrigger value="geography" className="flex items-center">
            <PieChartIcon className="mr-2 h-4 w-4" /> Geography
          </TabsTrigger>
        </TabsList>
        
        {/* Traffic Tab */}
        <TabsContent value="traffic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Views, Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pageViewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" interval="preserveStartEnd" minTickGap={24} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#1f2937" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Leads per Month</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userInteractionsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inquiries" name="Inquiries" fill="#1f2937" />
                      <Bar dataKey="consultations" name="Consultations" fill="#d4a12a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Properties Tab */}
        <TabsContent value="properties">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Types</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Listings by Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={propertyStatusData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" name="Listings" fill="#1f2937" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Most viewed */}
        <TabsContent value="properties">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Most Viewed Listings, Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              {topListings.length === 0 ? (
                <p className="text-sm text-gray-500">No views recorded yet.</p>
              ) : (
                <ul className="divide-y">
                  {topListings.map((l, i) => (
                    <li key={i} className="flex justify-between gap-4 py-2 text-sm">
                      <span className="truncate">{l.title}</span>
                      <span className="font-semibold tabular-nums">{l.views.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Property Distribution by City</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cityDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {cityDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
