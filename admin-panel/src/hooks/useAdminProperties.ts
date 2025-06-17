
import { useState, useEffect } from 'react';
import { Property } from '@/types/Property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { transformPropertyFromDb } from '@/lib/utils';

export function useAdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch properties from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error loading properties", description: error.message, variant: "destructive" });
      } else {
        setProperties(Array.isArray(data) ? data.map(transformPropertyFromDb) : []);
      }
      setLoading(false);
    };
    fetchProperties();
  }, [toast]);

  // Add or Edit property handler
  const handleSubmit = async (formData: any, coverImage?: File, additionalImages?: string[]) => {
    setIsSubmitting(true);
    try {
      const images: string[] = additionalImages || [];
      let coverImageUrl = '';

      // Handle cover image upload if a new one was selected
      if (coverImage) {
        const ext = coverImage.name.split('.').pop();
        const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const { data, error } = await supabase.storage
          .from('realtorjigar-images')
          .upload(`property-images/${fileName}`, coverImage);

        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('realtorjigar-images').getPublicUrl(data.path);
        coverImageUrl = publicUrl;
      }

      const { data, error } = await supabase.from('listings').insert([
        { ...formData, images, cover_image: coverImageUrl }
      ]).select();

      if (error) throw error;
      setProperties((prev) => [transformPropertyFromDb(data[0]), ...prev]);
      toast({ title: "Property created" });

      return true;
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update property handler
  const handleUpdate = async (editingProperty: Property, formData: any, coverImage?: File, additionalImages?: string[]) => {
    setIsSubmitting(true);
    try {
      const images: string[] = additionalImages || [];
      let coverImageUrl = editingProperty.cover_image || '';

      // Handle cover image upload if a new one was selected
      if (coverImage) {
        const ext = coverImage.name.split('.').pop();
        const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const { data, error } = await supabase.storage
          .from('realtorjigar-images')
          .upload(`property-images/${fileName}`, coverImage);

        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('realtorjigar-images').getPublicUrl(data.path);
        coverImageUrl = publicUrl;
      }

      const { error, data } = await supabase.from('listings').update({
        ...formData,
        images,
        cover_image: coverImageUrl,
      }).eq('id', editingProperty.id).select();

      if (error) throw error;
      setProperties((prev) =>
        prev.map((p) => (p.id === editingProperty.id ? transformPropertyFromDb(data[0]) : p))
      );
      toast({ title: "Property updated" });

      return true;
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (!error) setProperties((prev) => prev.filter((p) => p.id !== id));
    toast({ title: error ? "Delete failed" : "Property deleted", variant: error ? "destructive" : "default" });
  };

  // Toggle status handler
  const handleToggleStatus = async (id: string, currentStatus: 'published' | 'draft') => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { data, error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (!error && data) {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      toast({ title: `Property marked as ${newStatus}` });
    } else if (error) {
      toast({ title: "Status update failed", description: error.message, variant: "destructive" });
    }
  };

  return {
    properties,
    loading,
    isSubmitting,
    handleSubmit,
    handleUpdate,
    handleDelete,
    handleToggleStatus
  };
}
