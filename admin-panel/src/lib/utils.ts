
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Property } from '@/types/Property'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Transformer function to convert Supabase listing to Property type
export function transformPropertyFromDb(listing: any): Property {
  return {
    id: listing.id,
    title: listing.title,
    address: listing.address,
    city: listing.city,
    province: listing.province,
    price: Number(listing.price),
    bedrooms: listing.bedrooms || 0,
    bathrooms: listing.bathrooms || 0,
    square_feet: listing.square_feet || listing.squarefeet || 0, // Handle both column names
    property_type: listing.property_type,
    status: listing.status === 'published' ? 'published' : 'draft',
    market_status: listing.market_status || 'for-sale',
    featured: listing.featured || false,
    description: listing.description || '',
    images: Array.isArray(listing.images) ? listing.images : [],
    cover_image: listing.cover_image,
    created_at: listing.created_at,
    updated_at: listing.updated_at,
    meta_keywords: listing.meta_keywords,
    seo_title: listing.seo_title,
    seo_description: listing.seo_description,
    virtual_tour_url: listing.virtual_tour_url
  };
}
