import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export interface PropertyFormData {
  title: string;
  price: number;
  city: string;
  address: string;
  province: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  description: string;
  status: 'published' | 'draft';
  featured: boolean;
  mls_number?: string;
  images?: string[];
  seo_title?: string;
  seo_description?: string;
  meta_keywords?: string;
  virtual_tour_url?: string;
}

export interface PropertyFilters {
  searchTerm?: string;
  city?: string;
  status?: string;
  price?: { min: number; max: number };
  page: number;
  pageSize: number;
}

export function usePropertyManagement() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadPropertyImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `property-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('realtorjigar-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('realtorjigar-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const createProperty = async (formData: PropertyFormData, coverImage?: File, additionalImages?: string[]) => {
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('User not authenticated');
      
      // Safely handle images arrays
      const existingImages = Array.isArray(formData.images) ? formData.images : [];
      const additionalImagesArray = Array.isArray(additionalImages) ? additionalImages : [];
      let images = [...existingImages, ...additionalImagesArray];
      
      if (coverImage) {
        const imageUrl = await uploadPropertyImage(coverImage);
        images = [imageUrl, ...images];
      }

      const { data, error } = await supabase
        .from('listings')
        .insert({
          title: formData.title,
          price: formData.price,
          city: formData.city,
          address: formData.address,
          province: formData.province,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          square_feet: formData.square_feet,
          property_type: formData.property_type,
          description: formData.description,
          status: formData.status === 'published' ? 'active' : 'draft',
          featured: formData.featured,
          images,
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Success",
        description: "Property created successfully",
      });

      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to create property: ${errorMessage}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const updateProperty = async (id: string, formData: Partial<PropertyFormData>, newCoverImage?: File, additionalImages?: string[]) => {
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('User not authenticated');
      
      const updateData: any = { ...formData };
      
      if (formData.status) {
        updateData.status = formData.status === 'published' ? 'active' : 'draft';
      }
      
      if (newCoverImage || additionalImages) {
        const { data: currentProperty } = await supabase
          .from('listings')
          .select('images')
          .eq('id', id)
          .single();
          
        // Safely handle the images from the database
        const currentImages = Array.isArray(currentProperty?.images) ? currentProperty.images as string[] : [];
        const additionalImagesArray = Array.isArray(additionalImages) ? additionalImages : [];
        let images = [...currentImages, ...additionalImagesArray];
        
        if (newCoverImage) {
          const imageUrl = await uploadPropertyImage(newCoverImage);
          images = images.length > 0 ? [imageUrl, ...images.slice(1)] : [imageUrl];
        }
        
        updateData.images = images;
      }

      const { data, error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to update property: ${errorMessage}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to delete property: ${errorMessage}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const togglePropertyStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Success",
        description: `Property ${newStatus === 'active' ? 'published' : 'saved as draft'}`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to update property status: ${errorMessage}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const useListProperties = (filters: PropertyFilters = { page: 1, pageSize: 9 }) => {
    return useQuery({
      queryKey: ['properties', filters],
      queryFn: async () => {
        let query = supabase
          .from('listings')
          .select('*', { count: 'exact' });

        if (filters.searchTerm) {
          query = query.or(`title.ilike.%${filters.searchTerm}%,address.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
        }
        
        if (filters.city) {
          query = query.eq('city', filters.city);
        }
        
        if (filters.status) {
          const dbStatus = filters.status === 'published' ? 'active' : filters.status;
          query = query.eq('status', dbStatus);
        }
        
        if (filters.price) {
          query = query.gte('price', filters.price.min).lte('price', filters.price.max);
        }
        
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        
        query = query
          .order('created_at', { ascending: false })
          .range(from, to);
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        return { 
          properties: data || [], 
          totalCount: count || 0,
          pageCount: Math.ceil((count || 0) / filters.pageSize)
        };
      },
      placeholderData: (previousData) => previousData,
    });
  };

  const useTogglePropertyStatus = () => {
    return useMutation({
      mutationFn: async ({ id, currentStatus }: { id: string, currentStatus: string }) => {
        return await togglePropertyStatus(id, currentStatus);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['properties'] });
      }
    });
  };

  const useDeleteProperty = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        return await deleteProperty(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['properties'] });
      }
    });
  };

  return {
    createProperty,
    updateProperty,
    deleteProperty,
    togglePropertyStatus,
    isUploading,
    useListProperties,
    useTogglePropertyStatus,
    useDeleteProperty
  };
}
