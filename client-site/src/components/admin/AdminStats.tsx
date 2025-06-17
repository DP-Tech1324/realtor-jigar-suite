
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Home, MessageSquare, DollarSign, Eye } from "lucide-react";
import { AdminStats as AdminStatsType } from "@/hooks/useAdminData";

interface AdminStatsProps {
  stats: AdminStatsType | undefined;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
}

const AdminStats = ({ stats, isLoading, formatCurrency }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Listings</p>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalListings || 0}</p>
                  <p className="text-sm text-green-600">+{stats?.listingsGrowth || 0}% from last month</p>
                </>
              )}
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Inquiries</p>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">{stats?.activeInquiries || 0}</p>
                  <p className="text-sm text-yellow-600">{stats?.inquiriesNeedingResponse || 0} need response</p>
                </>
              )}
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
                  <p className="text-sm text-green-600">+{stats?.revenueGrowth || 0}% from last month</p>
                </>
              )}
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Site Visitors</p>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">{stats?.siteVisitors?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-blue-600">+{stats?.visitorsGrowth || 0}% from last month</p>
                </>
              )}
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
