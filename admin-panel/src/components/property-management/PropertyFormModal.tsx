
import React from 'react';
import { PropertyForm } from './PropertyForm';
import { Property } from '@/types/Property';

interface PropertyFormModalProps {
  isOpen: boolean;
  editingProperty: Property | null;
  isSubmitting: boolean;
  onSubmit: (formData: any, coverImage?: File, additionalImages?: string[]) => Promise<void>;
  onClose: () => void;
}

export function PropertyFormModal({ 
  isOpen, 
  editingProperty, 
  isSubmitting, 
  onSubmit, 
  onClose 
}: PropertyFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
          aria-label="Close"
        >
          ✕
        </button>
        <PropertyForm
          onSubmit={onSubmit}
          initialData={editingProperty ?? undefined}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
