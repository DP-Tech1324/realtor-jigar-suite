
import React from 'react';
import { PropertyCard } from './PropertyCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Property } from '@/types/Property';

interface PropertyGridProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: 'published' | 'draft') => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function PropertyGrid({ 
  properties, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No properties found</div>
        <p className="text-gray-400 mt-2">Try adjusting your search filters or add a new property.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-realtor-navy" />
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="flex justify-center pt-4 pb-8">
          <Button 
            onClick={onLoadMore} 
            disabled={isLoadingMore}
            variant="outline"
            className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy/10"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
