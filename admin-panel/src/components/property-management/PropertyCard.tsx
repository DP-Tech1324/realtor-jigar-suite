
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Home } from 'lucide-react';
import { Property } from '@/types/Property';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: 'published' | 'draft') => void;
}

export function PropertyCard({ property, onEdit, onDelete, onToggleStatus }: PropertyCardProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      onDelete(property.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: 'published' | 'draft') => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getMarketStatusColor = (marketStatus?: string) => {
    switch (marketStatus) {
      case 'sold':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'for-rent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {property.cover_image || (property.images && property.images.length > 0) ? (
          <img
            src={property.cover_image || property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
          {property.market_status && (
            <Badge className={getMarketStatusColor(property.market_status)}>
              {property.market_status}
            </Badge>
          )}
          {property.featured && (
            <Badge className="bg-gold-100 text-gold-800">
              Featured
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-realtor-navy truncate">
              {property.title}
            </h3>
            <p className="text-2xl font-bold text-realtor-gold">
              {formatPrice(property.price)}
            </p>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">
              {property.address}, {property.city}, {property.province}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.square_feet || 0} sqft</span>
            </div>
          </div>

          {property.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {property.description}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(property)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleStatus(property.id, property.status)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              {property.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
