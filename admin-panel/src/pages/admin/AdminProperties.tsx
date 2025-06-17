
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PropertyGrid } from '@/components/property-management/PropertyGrid';
import { PropertyStats } from '@/components/property-management/PropertyStats';
import { PropertyFormModal } from '@/components/property-management/PropertyFormModal';
import { Property } from '@/types/Property';
import { useAdminProperties } from '@/hooks/useAdminProperties';

const AdminProperties = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  const {
    properties,
    loading,
    isSubmitting,
    handleSubmit,
    handleUpdate,
    handleDelete,
    handleToggleStatus
  } = useAdminProperties();

  // Handle form submission for both create and update
  const handleFormSubmit = async (formData: any, coverImage?: File, additionalImages?: string[]) => {
    let success = false;
    
    if (editingProperty) {
      success = await handleUpdate(editingProperty, formData, coverImage, additionalImages);
    } else {
      success = await handleSubmit(formData, coverImage, additionalImages);
    }

    if (success) {
      setModalOpen(false);
      setEditingProperty(null);
    }
  };

  // Edit handler
  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProperty(null);
  };

  // Calculate stats
  const total = properties.length;
  const published = properties.filter((p) => p.status === 'published').length;
  const draft = properties.filter((p) => p.status === 'draft').length;
  const featured = properties.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-realtor-navy">Properties Management</h1>
          <p className="text-gray-600 mt-2">Manage property listings and details</p>
        </div>
        <Button 
          className="bg-realtor-gold hover:bg-realtor-gold/90" 
          onClick={() => { setModalOpen(true); setEditingProperty(null); }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <PropertyStats 
        total={total}
        published={published}
        draft={draft}
        featured={featured}
      />

      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyGrid
            properties={properties}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={loading}
          />
        </CardContent>
      </Card>

      <PropertyFormModal
        isOpen={modalOpen}
        editingProperty={editingProperty}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AdminProperties;
