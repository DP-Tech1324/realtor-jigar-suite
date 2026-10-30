import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Property, PropertyType } from '@/types/Property'
import { evaluateVastu, parseVastu, type Direction } from '@/lib/vastu'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LEGACY_PROPERTY_TYPES: Record<string, PropertyType> = { house: 'single_family' };

// listings.status (active | draft | pending | sold) -> admin publication + market status
function splitStatus(dbStatus: string): Pick<Property, 'status' | 'market_status'> {
  switch (dbStatus) {
    case 'active':
    case 'published':
      return { status: 'published', market_status: 'for-sale' };
    case 'pending':
      return { status: 'published', market_status: 'pending' };
    case 'sold':
      return { status: 'published', market_status: 'sold' };
    default:
      return { status: 'draft', market_status: 'for-sale' };
  }
}

function joinStatus(status: Property['status'], marketStatus: Property['market_status']): string {
  if (status === 'draft') return 'draft';
  if (marketStatus === 'pending' || marketStatus === 'sold') return marketStatus;
  return 'active';
}

// Transformer function to convert Supabase listing to Property type
export function transformPropertyFromDb(listing: any): Property {
  return {
    id: listing.id,
    title: listing.title,
    address: listing.address,
    city: listing.city,
    province: listing.province,
    postal_code: listing.postal_code || '',
    price: Number(listing.price) || 0,
    bedrooms: listing.bedrooms || 0,
    bathrooms: Number(listing.bathrooms) || 0,
    square_feet: listing.square_footage || 0,
    lot_size: listing.lot_size || undefined,
    year_built: listing.year_built || undefined,
    property_type: LEGACY_PROPERTY_TYPES[listing.property_type] || listing.property_type || 'single_family',
    transaction_type: listing.transaction_type === 'rent' ? 'rent' : 'sale',
    ...splitStatus(listing.status),
    featured: listing.is_featured || false,
    description: listing.description || '',
    images: Array.isArray(listing.images) ? listing.images : [],
    cover_image: listing.cover_image,
    created_at: listing.created_at,
    updated_at: listing.updated_at,
    mls_number: listing.mls_number || '',
    meta_keywords: listing.meta_keywords,
    seo_title: listing.seo_title,
    seo_description: listing.seo_description,
    virtual_tour_url: listing.virtual_tour_url,
    facing: listing.facing || null,
    vastu: parseVastu(listing.vastu),
    vastu_score: listing.vastu_score ?? null,
  };
}

// Form values -> listings row. Recomputes vastu_score so search filters stay correct.
export function transformPropertyToDb(form: Partial<Property>) {
  const vastu = form.vastu ?? null;
  const facing = (form.facing || null) as Direction | null;
  const { score } = vastu?.enabled ? evaluateVastu(vastu, facing) : { score: null };

  return {
    title: form.title,
    description: form.description || null,
    address: form.address,
    city: form.city,
    province: form.province,
    postal_code: form.postal_code || null,
    price: form.price || null,
    property_type: form.property_type,
    transaction_type: form.transaction_type || 'sale',
    bedrooms: form.bedrooms ?? null,
    bathrooms: form.bathrooms ?? null,
    square_footage: form.square_feet || null,
    lot_size: form.lot_size || null,
    year_built: form.year_built || null,
    status: joinStatus(form.status || 'draft', form.market_status || 'for-sale'),
    is_featured: !!form.featured,
    mls_number: form.mls_number || null,
    virtual_tour_url: form.virtual_tour_url || null,
    seo_title: form.seo_title || null,
    seo_description: form.seo_description || null,
    meta_keywords: form.meta_keywords || null,
    facing,
    vastu,
    vastu_score: score,
  };
}
