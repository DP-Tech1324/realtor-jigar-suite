
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, MessageSquare } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { InquiryWithListing, useUpdateInquiryStatus } from "@/hooks/useAdminInquiries";
import { Database } from '@/integrations/supabase/types';
import { formatDistanceToNow } from "date-fns";

type InquiryStatus = Database['public']['Enums']['inquiry_status'];

interface AdminOverviewTabProps {
  inquiries: InquiryWithListing[] | undefined;
  inquiriesLoading: boolean;
  analyticsData: any;
  analyticsLoading: boolean;
}

const AdminOverviewTab = ({ 
  inquiries, 
  inquiriesLoading, 
  analyticsData, 
  analyticsLoading 
}: AdminOverviewTabProps) => {
  const updateInquiryStatus = useUpdateInquiryStatus();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      converted: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800"
    };
    return variants[status] || variants.new;
  };

  const handleStatusUpdate = (inquiryId: string, newStatus: InquiryStatus) => {
    updateInquiryStatus.mutate({ id: inquiryId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.salesData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Inquiry Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData?.inquiryData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inquiries" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading inquiries...</span>
            </div>
          ) : inquiries && inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inquiry: InquiryWithListing) => (
                <div key={inquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-sm text-gray-600">{inquiry.email}</p>
                      <p className="text-sm text-gray-500">
                        {inquiry.listings?.address || 'General inquiry'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusBadge(inquiry.status)}>
                      {inquiry.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusUpdate(inquiry.id, 'contacted' as InquiryStatus)}
                      disabled={updateInquiryStatus.isPending}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No inquiries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewTab;
