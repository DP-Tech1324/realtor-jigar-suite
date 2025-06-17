
// Updated Property interface to handle both publication and market status correctly
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  square_feet?: number;
  status: 'published' | 'draft'; // Publication status for admin
  market_status?: 'for-sale' | 'for-rent' | 'sold' | 'pending'; // Market status for display
  description?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  cover_image?: string;
  images: string[];
  meta_keywords?: string;
  seo_title?: string;
  seo_description?: string;
  virtual_tour_url?: string;
  [key: string]: any;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  photo: string;
  bio: string;
  specialties: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  image?: string;
}
