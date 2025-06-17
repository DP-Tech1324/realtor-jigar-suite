
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, MessageSquare, BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const { stats, loading } = useAdminData();
  const { userRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Properties',
      value: stats.totalProperties,
      subtitle: `${stats.activeProperties} active`,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/properties',
    },
    {
      title: 'Users',
      value: stats.totalUsers,
      subtitle: 'Admin users',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/users',
      roles: ['superadmin'],
    },
    {
      title: 'Inquiries',
      value: stats.totalInquiries,
      subtitle: `${stats.pendingInquiries} pending`,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/inquiries',
    },
    {
      title: 'Analytics',
      value: stats.monthlyViews.toLocaleString(),
      subtitle: 'Monthly views',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/analytics',
      roles: ['admin', 'superadmin'],
    },
  ];

  const filteredCards = statsCards.filter(card => 
    !card.roles || card.roles.includes(userRole || '')
  );

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-realtor-navy to-blue-800 rounded-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Welcome back! Here's what's happening with your real estate business.
            </p>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-right">
              <p className="text-xs sm:text-sm text-blue-200">Last updated</p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-md h-full">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-1.5 sm:p-2 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">{stat.subtitle}</p>
                    </div>
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <Link
              to="/admin/properties"
              className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-realtor-gold mr-2 sm:mr-3" />
              <span className="font-medium text-sm sm:text-base">Add New Property</span>
            </Link>
            {userRole === 'superadmin' && (
              <Link
                to="/admin/users"
                className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-realtor-gold mr-2 sm:mr-3" />
                <span className="font-medium text-sm sm:text-base">Manage Users</span>
              </Link>
            )}
            <Link
              to="/admin/inquiries"
              className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-realtor-gold mr-2 sm:mr-3" />
              <span className="font-medium text-sm sm:text-base">View Inquiries</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center p-2 sm:p-3 rounded-lg bg-blue-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium">New property listing added</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-2 sm:p-3 rounded-lg bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium">Inquiry status updated</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-2 sm:p-3 rounded-lg bg-orange-50">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 sm:mr-3"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium">New user registered</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      {stats.pendingInquiries > 5 && (
        <Card className="border-0 shadow-md border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-3" />
              <div>
                <p className="font-medium text-sm sm:text-base">Action Required</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  You have {stats.pendingInquiries} pending inquiries that need attention.
                </p>
              </div>
              <Link
                to="/admin/inquiries"
                className="ml-auto text-orange-600 hover:text-orange-700 text-xs sm:text-sm font-medium"
              >
                View All →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
