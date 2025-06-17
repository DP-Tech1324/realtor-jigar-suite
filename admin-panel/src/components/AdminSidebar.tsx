
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Home,
  Building,
  Users,
  Upload,
  MessageSquare,
  BarChart3,
  Megaphone,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const links = [
    { 
      to: '/admin', 
      label: 'Dashboard', 
      icon: Home, 
      exact: true, 
      roles: ['admin', 'superadmin', 'editor'],
      description: 'Overview & stats'
    },
    { 
      to: '/admin/properties', 
      label: 'Properties', 
      icon: Building, 
      roles: ['admin', 'superadmin', 'editor'],
      description: 'Manage listings'
    },
    { 
      to: '/admin/images', 
      label: 'Images', 
      icon: Upload, 
      roles: ['admin', 'superadmin', 'editor'],
      description: 'Media library'
    },
    { 
      to: '/admin/inquiries', 
      label: 'Inquiries', 
      icon: MessageSquare, 
      roles: ['admin', 'superadmin', 'editor'],
      description: 'Customer messages'
    },
    { 
      to: '/admin/users', 
      label: 'Users', 
      icon: Users, 
      roles: ['superadmin'],
      description: 'User management'
    },
    { 
      to: '/admin/analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      roles: ['admin', 'superadmin'],
      description: 'Performance data'
    },
    { 
      to: '/admin/marketing', 
      label: 'Marketing', 
      icon: Megaphone, 
      roles: ['admin', 'superadmin'],
      description: 'Campaigns & tools'
    },
  ];

  const isActive = (linkTo: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === linkTo;
    }
    return location.pathname.startsWith(linkTo);
  };

  const canAccessLink = (linkRoles: string[]) => {
    return userRole && linkRoles.includes(userRole);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      superadmin: 'bg-red-100 text-red-800',
      admin: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800',
    };
    return <Badge className={`text-xs ${variants[role]}`}>{role}</Badge>;
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r h-full flex flex-col">
      <div className="p-4 space-y-6 flex flex-col h-full">
        {/* Header with avatar and role */}
        <div className="flex flex-col items-center space-y-4 pt-2 pb-4 border-b">
          <Avatar className="h-16 w-16 ring-2 ring-realtor-gold/20">
            <AvatarFallback className="bg-gradient-to-br from-realtor-gold to-yellow-500 text-white text-xl font-bold">
              {user?.email?.charAt(0).toUpperCase() ?? 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {userRole && getRoleBadge(userRole)}
            </div>
            {user?.email && (
              <div className="text-xs text-gray-500 max-w-48 truncate">
                {user.email}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, icon: Icon, exact, roles, description }) => {
            if (!canAccessLink(roles)) return null;

            const active = isActive(to, exact);

            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'group flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-realtor-gold/20 to-yellow-500/20 text-realtor-navy font-semibold border-r-4 border-realtor-gold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-realtor-navy hover:scale-105'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 mr-3 transition-colors',
                  active ? 'text-realtor-gold' : 'text-gray-500 group-hover:text-realtor-gold'
                )} />
                <div className="flex-1">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-600">
                    {description}
                  </div>
                </div>
                {active && (
                  <div className="w-2 h-2 bg-realtor-gold rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="border-t pt-4 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-realtor-navy hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-realtor-navy hover:bg-gray-50"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>

        {/* Logout Button - Only visible on desktop */}
        <div className="border-t pt-4 hidden lg:block">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
