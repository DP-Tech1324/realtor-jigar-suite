
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
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
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Building, User, MessageSquare } from 'lucide-react';

// Mock analytics data
const pageViewsData = [
  { name: 'Jan', views: 1200 },
  { name: 'Feb', views: 1900 },
  { name: 'Mar', views: 2200 },
  { name: 'Apr', views: 2800 },
  { name: 'May', views: 3500 }
];

const userInteractionsData = [
  { name: 'Jan', inquiries: 14, consultations: 5 },
  { name: 'Feb', inquiries: 18, consultations: 8 },
  { name: 'Mar', inquiries: 23, consultations: 12 },
  { name: 'Apr', inquiries: 29, consultations: 18 },
  { name: 'May', inquiries: 35, consultations: 24 }
];

const propertyTypeData = [
  { name: 'Houses', value: 42 },
  { name: 'Condos', value: 28 },
  { name: 'Townhouses', value: 19 },
  { name: 'Land', value: 11 }
];

const propertyStatusData = [
  { name: 'Jan', forSale: 24, sold: 8, pending: 3 },
  { name: 'Feb', forSale: 28, sold: 12, pending: 5 },
  { name: 'Mar', forSale: 32, sold: 15, pending: 7 },
  { name: 'Apr', forSale: 38, sold: 19, pending: 6 },
  { name: 'May', forSale: 42, sold: 22, pending: 9 }
];

const cityDistributionData = [
  { name: 'Toronto', value: 45 },
  { name: 'Woodbridge', value: 25 },
  { name: 'Richmond Hill', value: 15 },
  { name: 'Vaughan', value: 15 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    
    checkAdminStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkAdminStatus);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);
  
  // Summary statistics
  const totalProperties = 98;
  const totalUsers = 245;
  const totalInquiries = 135;

  // If not admin, redirect to homepage
  if (!isAdmin) {
    toast({
      title: "Access Denied",
      description: "You need administrator privileges to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/admin" />;
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
            <p className="text-sm text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-realtor-gold" /> 
              Registered Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-sm text-muted-foreground">Active in the last 30 days</p>
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
            <div className="text-3xl font-bold">{totalInquiries}</div>
            <p className="text-sm text-muted-foreground">From contacts and consultations</p>
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
                <CardTitle>Page Views Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pageViewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
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
                <CardTitle>User Interactions</CardTitle>
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
                      <Bar dataKey="inquiries" fill="#1f2937" />
                      <Bar dataKey="consultations" fill="#d4a12a" />
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
                <CardTitle>Property Status Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={propertyStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="forSale" fill="#1f2937" />
                      <Bar dataKey="sold" fill="#10b981" />
                      <Bar dataKey="pending" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
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
