
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Bed, Bath, Square, MapPin, Camera, Eye } from 'lucide-react';
import { Listing } from '@/hooks/useListings';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/components/auth/AuthContext';

interface PropertyCardProps {
  listing: Listing;
  onViewDetails?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ listing, onViewDetails }) => {
  const { user } = useAuth();
  const { data: isFavorite } = useIsFavorite(listing.id);
  const toggleFavorite = useToggleFavorite();

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      // TODO: Open auth modal
      return;
    }
    toggleFavorite.mutate(listing.id);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(listing.id);
    }
  };

  const primaryImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80';
  const imageCount = listing.images?.length || 1;

  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-slate-100">
      <div className="relative overflow-hidden">
        <img 
          src={primaryImage}
          alt={listing.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Top badges and actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="space-y-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium px-3 py-1 shadow-lg">
              {listing.property_type.replace('_', ' ').toUpperCase()}
            </Badge>
            {listing.price && listing.price > 1500000 && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-3 py-1 shadow-lg">
                Luxury
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            {imageCount > 1 && (
              <div className="bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full flex items-center">
                <Camera className="h-3 w-3 mr-1" />
                {imageCount}
              </div>
            )}
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg"
                onClick={handleFavoriteClick}
                disabled={toggleFavorite.isPending}
              >
                <Heart 
                  className={`h-4 w-4 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'
                  }`} 
                />
              </Button>
            )}
          </div>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <div className="text-2xl font-bold text-slate-900">
              {formatPrice(listing.price)}
            </div>
          </div>
        </div>

        {/* View button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleViewDetails}
            className="bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl"
          >
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
            {listing.title}
          </h3>
          
          <div className="flex items-center text-slate-600 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm">{listing.address}, {listing.city}</span>
          </div>
        </div>
        
        {/* Property features */}
        <div className="flex items-center justify-between text-slate-600 py-3 border-t border-slate-100">
          {listing.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm font-medium">{listing.bedrooms} beds</span>
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm font-medium">{listing.bathrooms} baths</span>
            </div>
          )}
          {listing.square_footage && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm font-medium">{listing.square_footage} sqft</span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
