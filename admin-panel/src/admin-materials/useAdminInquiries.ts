
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type InquiryStatus = Database['public']['Enums']['inquiry_status'];

export interface InquiryWithListing {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
  notes?: string;
  assigned_to?: string;
  listing_id?: string;
  listings?: {
    title: string;
    address: string;
  } | null;
}

export const useAdminInquiriesQuery = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-inquiries', user?.id],
    queryFn: async () => {
      if (!user || !isAdmin) throw new Error('Unauthorized');

      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          listings (
            title,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as InquiryWithListing[];
    },
    enabled: !!user && isAdmin,
  });
};

export const useUpdateInquiryStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InquiryStatus }) => {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: "Success",
        description: "Inquiry status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
      console.error('Update inquiry error:', error);
    },
  });
};

export const useUpdateInquiryNotes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ 
          notes, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      });
      console.error('Update notes error:', error);
    },
  });
};

export const useAssignInquiry = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, assigned_to }: { id: string; assigned_to: string }) => {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ 
          assigned_to, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast({
        title: "Success",
        description: "Inquiry assigned successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to assign inquiry",
        variant: "destructive",
      });
      console.error('Assign inquiry error:', error);
    },
  });
};

export const useDeleteInquiry = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: "Success",
        description: "Inquiry deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
      console.error('Delete inquiry error:', error);
    },
  });
};
