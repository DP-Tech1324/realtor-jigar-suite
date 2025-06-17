
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Listing {
  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  price?: number;
  property_type: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  images: string[];
  status: string;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  mls_number?: string;
  year_built?: number;
  lot_size?: number;
  features?: any;
}

export interface SearchFilters {
  city?: string;
  propertyType?: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export const useListings = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters?.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Listing[];
    },
  });
};

export const useFeaturedListings = () => {
  return useQuery({
    queryKey: ['featured-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Listing[];
    },
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Listing;
    },
    enabled: !!id,
  });
};

export const useCreateInquiry = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inquiry: {
      name: string;
      email: string;
      phone?: string;
      message: string;
      listing_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('inquiries')
        .insert(inquiry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent!",
        description: "Thank you for your inquiry. We'll get back to you soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });
};
