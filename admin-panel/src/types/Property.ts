import type { Direction, VastuData } from '@/lib/vastu';

export type PropertyType = 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial';

// Listing as the admin panel works with it. `status` is the publication state;
// `market_status` is what buyers see once it is published.
// Column mapping to the `listings` table lives in lib/utils.ts.
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  property_type: PropertyType;
  transaction_type: 'sale' | 'rent';
  square_feet?: number;
  lot_size?: number;
  year_built?: number;
  status: 'published' | 'draft';
  market_status: 'for-sale' | 'pending' | 'sold';
  description?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  cover_image?: string;
  images: string[];
  mls_number?: string;
  meta_keywords?: string;
  seo_title?: string;
  seo_description?: string;
  virtual_tour_url?: string;
  facing?: Direction | null;
  vastu?: VastuData | null;
  vastu_score?: number | null;
  // CREA DDF® feed listings: feed fields are read-only in the admin panel
  source: 'manual' | 'ddf';
  is_own_listing?: boolean;
  list_office_name?: string | null;
  listing_url?: string | null;
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  single_family: 'Detached / Single family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  multi_family: 'Multi family',
  land: 'Land',
  commercial: 'Commercial',
};
