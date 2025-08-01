
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ListingStatus = Database['public']['Enums']['listing_status'];
type PropertyType = Database['public']['Enums']['property_type'];

export interface ListingFormData {
  title: string;
  description?: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  price?: number;
  property_type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  images?: string[];
  status: ListingStatus;
  is_featured?: boolean;
  latitude?: number;
  longitude?: number;
  mls_number?: string;
  year_built?: number;
  lot_size?: number;
  features?: any;
}

export const useAdminListingsQuery = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-listings', user?.id],
    queryFn: async () => {
      if (!user || !isAdmin) throw new Error('Unauthorized');

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });
};

export const useCreateListing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listingData: ListingFormData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listingData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['featured-listings'] });
      toast({
        title: "Success",
        description: "Listing created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive",
      });
      console.error('Create listing error:', error);
    },
  });
};

export const useUpdateListing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ListingFormData> }) => {
      const { data: result, error } = await supabase
        .from('listings')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['featured-listings'] });
      toast({
        title: "Success",
        description: "Listing updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
      console.error('Update listing error:', error);
    },
  });
};

export const useDeleteListing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['featured-listings'] });
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
      console.error('Delete listing error:', error);
    },
  });
};
