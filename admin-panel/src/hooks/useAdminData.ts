
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminStats {
  totalProperties: number;
  activeProperties: number;
  totalUsers: number;
  totalInquiries: number;
  pendingInquiries: number;
  monthlyViews: number;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalUsers: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    monthlyViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [properties, users, inquiries, analytics] = await Promise.all([
        supabase.from('listings').select('id, status', { count: 'exact' }),
        supabase.from('admin_users').select('id', { count: 'exact' }),
        supabase.from('inquiries').select('id, status', { count: 'exact' }),
        supabase.from('realtorjigar_x8d1y_analytics').select('view_count').range(0, 100)
      ]);

      const totalProperties = properties.count || 0;
      const activeProperties = properties.data?.filter(p => p.status === 'active').length || 0;
      const totalUsers = users.count || 0;
      const totalInquiries = inquiries.count || 0;
      const pendingInquiries = inquiries.data?.filter(i => i.status === 'new').length || 0;
      const monthlyViews = analytics.data?.reduce((sum, item) => sum + (item.view_count || 0), 0) || 0;

      setStats({
        totalProperties,
        activeProperties,
        totalUsers,
        totalInquiries,
        pendingInquiries,
        monthlyViews,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: 'Error loading dashboard stats',
        description: 'Please try refreshing the page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};
