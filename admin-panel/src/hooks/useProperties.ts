
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property } from '@/types/Property';
import { properties as localProperties } from '@/data/properties';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

// Helper to validate property type
const validatePropertyType = (type: string): 'house' | 'condo' | 'townhouse' | 'land' => {
  if (['house', 'condo', 'townhouse', 'land'].includes(type)) {
    return type as 'house' | 'condo' | 'townhouse' | 'land';
  }
  // Default to house if invalid type received
  console.warn(`Invalid property type: ${type}, defaulting to 'house'`);
  return 'house';
};

// Type for new property creation
export interface PropertyCreateInput {
  title: string;
  address: string;
  city: string;
  province: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: 'house' | 'condo' | 'townhouse' | 'land';
  status: 'published' | 'draft';
  market_status?: 'for-sale' | 'for-rent' | 'sold' | 'pending';
  featured?: boolean;
  description?: string;
  images: string[];
}

export function useProperties() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Map Supabase listing to our Property type
  const mapListingToProperty = (listing: any): Property => {
    return {
      id: listing.id,
      title: listing.title,
      address: listing.address,
      city: listing.city,
      province: listing.province,
      price: Number(listing.price),
      bedrooms: listing.bedrooms || 0,
      bathrooms: listing.bathrooms || 0,
      square_feet: listing.square_feet || 0,
      property_type: validatePropertyType(listing.property_type),
      status: listing.status === 'published' ? 'published' : 'draft',
      market_status: listing.market_status || 'for-sale',
      featured: listing.featured || false,
      description: listing.description || '',
      images: Array.isArray(listing.images) ? listing.images : []
    };
  };

  // Use Supabase to fetch properties
  const fetchProperties = async (): Promise<Property[]> => {
    try {
      console.log('Fetching properties from Supabase');
      const { data, error } = await supabase
        .from('listings')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // If we have data in Supabase, return it
      if (data && data.length > 0) {
        // Map Supabase properties to our Property type
        return data.map(mapListingToProperty);
      }
      
      // Fall back to local data if no properties in Supabase
      return localProperties;
    } catch (error) {
      console.error('Error in fetchProperties:', error);
      // Return local data on error
      return localProperties;
    }
  };
  
  const fetchFeaturedProperties = async (): Promise<Property[]> => {
    try {
      console.log('Fetching featured properties from Supabase');
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('featured', true);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // If we have featured properties in Supabase, return them
      if (data && data.length > 0) {
        // Map Supabase properties to our Property type
        return data.map(mapListingToProperty);
      }
      
      // Fallback to filtered local data
      return localProperties.filter(property => property.featured);
    } catch (error) {
      console.error('Error in fetchFeaturedProperties:', error);
      // Return filtered local data on error
      return localProperties.filter(property => property.featured);
    }
  };
  
  const fetchPropertyById = async (id: string): Promise<Property> => {
    try {
      console.log(`Fetching property with id ${id} from Supabase`);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        // Find property by id in local data if not found in Supabase
        const property = localProperties.find(p => p.id === id);
        
        if (!property) {
          throw new Error(`Property with id ${id} not found`);
        }
        
        return property;
      }
      
      // Return the Supabase property
      return mapListingToProperty(data);
    } catch (error) {
      console.error(`Error fetching property with id ${id}:`, error);
      // Find property by id in local data
      const property = localProperties.find(p => p.id === id);
      
      if (!property) {
        throw new Error(`Property with id ${id} not found`);
      }
      
      return property;
    }
  };

  // Create a new property
  const createProperty = async (propertyData: PropertyCreateInput): Promise<Property> => {
    console.log('Creating new property:', propertyData);
    
    try {
      // Generate a new UUID for the property
      const id = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('listings')
        .insert({
          id: id,
          title: propertyData.title,
          address: propertyData.address,
          city: propertyData.city,
          province: propertyData.province,
          price: propertyData.price,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          square_feet: propertyData.square_feet,
          property_type: propertyData.property_type,
          status: propertyData.status,
          featured: propertyData.featured || false,
          description: propertyData.description || '',
          images: propertyData.images
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating property:', error);
        toast({
          title: "Error",
          description: `Failed to create property: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      
      // Map the Supabase return object to our Property type
      return mapListingToProperty(data);
      
    } catch (error: any) {
      console.error('Failed to create property:', error);
      throw error;
    }
  };
  
  // Delete a property
  const deleteProperty = async (id: string): Promise<void> => {
    console.log('Deleting property with ID:', id);
    
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting property:', error);
        toast({
          title: "Error",
          description: `Failed to delete property: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      
      console.log('Property deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete property:', error);
      throw error;
    }
  };

  // Update a property
  const updateProperty = async (id: string, propertyData: Partial<PropertyCreateInput>): Promise<Property> => {
    console.log('Updating property with ID:', id, 'with data:', propertyData);
    
    try {
      // Prepare update data
      const updateData: any = {};
      
      // Only include fields that are provided
      if (propertyData.title !== undefined) updateData.title = propertyData.title;
      if (propertyData.address !== undefined) updateData.address = propertyData.address;
      if (propertyData.city !== undefined) updateData.city = propertyData.city;
      if (propertyData.province !== undefined) updateData.province = propertyData.province;
      if (propertyData.price !== undefined) updateData.price = propertyData.price;
      if (propertyData.bedrooms !== undefined) updateData.bedrooms = propertyData.bedrooms;
      if (propertyData.bathrooms !== undefined) updateData.bathrooms = propertyData.bathrooms;
      if (propertyData.square_feet !== undefined) updateData.square_feet = propertyData.square_feet;
      if (propertyData.property_type !== undefined) updateData.property_type = propertyData.property_type;
      if (propertyData.status !== undefined) updateData.status = propertyData.status;
      if (propertyData.featured !== undefined) updateData.featured = propertyData.featured;
      if (propertyData.description !== undefined) updateData.description = propertyData.description;
      if (propertyData.images !== undefined) updateData.images = propertyData.images;
      
      const { data, error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating property:', error);
        toast({
          title: "Error",
          description: `Failed to update property: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      
      // Map the Supabase return object to our Property type
      return mapListingToProperty(data);
      
    } catch (error: any) {
      console.error('Failed to update property:', error);
      throw error;
    }
  };

  return {
    useAllProperties: () => 
      useQuery({
        queryKey: ['properties'],
        queryFn: fetchProperties
      }),
      
    useFeaturedProperties: () => 
      useQuery({
        queryKey: ['featuredProperties'],
        queryFn: fetchFeaturedProperties
      }),
      
    usePropertyById: (id: string) => 
      useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyById(id),
        enabled: !!id
      }),
      
    useCreateProperty: () => 
      useMutation({
        mutationFn: createProperty,
        onSuccess: () => {
          // Invalidate queries to refetch the updated data
          queryClient.invalidateQueries({ queryKey: ['properties'] });
          queryClient.invalidateQueries({ queryKey: ['featuredProperties'] });
        }
      }),
      
    useDeleteProperty: () => 
      useMutation({
        mutationFn: deleteProperty,
        onSuccess: () => {
          // Invalidate queries to refetch the updated data
          queryClient.invalidateQueries({ queryKey: ['properties'] });
          queryClient.invalidateQueries({ queryKey: ['featuredProperties'] });
        }
      }),
      
    useUpdateProperty: () => 
      useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<PropertyCreateInput> }) => 
          updateProperty(id, data),
        onSuccess: (data) => {
          // Invalidate specific queries
          queryClient.invalidateQueries({ queryKey: ['properties'] });
          queryClient.invalidateQueries({ queryKey: ['featuredProperties'] });
          queryClient.invalidateQueries({ queryKey: ['property', data.id] });
        }
      })
  };
}
