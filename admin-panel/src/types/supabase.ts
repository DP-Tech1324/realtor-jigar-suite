
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          address: string
          city: string
          province: string
          price: number
          bedrooms: number
          bathrooms: number
          square_feet: number
          property_type: 'house' | 'condo' | 'townhouse' | 'land'
          status: 'for-sale' | 'for-rent' | 'sold' | 'pending'
          featured: boolean
          description: string
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          address: string
          city: string
          province: string
          price: number
          bedrooms: number
          bathrooms: number
          square_feet: number
          property_type: 'house' | 'condo' | 'townhouse' | 'land'
          status: 'for-sale' | 'for-rent' | 'sold' | 'pending'
          featured?: boolean
          description: string
          images: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          address?: string
          city?: string
          province?: string
          price?: number
          bedrooms?: number
          bathrooms?: number
          square_feet?: number
          property_type?: 'house' | 'condo' | 'townhouse' | 'land'
          status?: 'for-sale' | 'for-rent' | 'sold' | 'pending'
          featured?: boolean
          description?: string
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          title: string
          phone: string
          email: string
          photo: string
          bio: string
          specialties: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          phone: string
          email: string
          photo: string
          bio: string
          specialties: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          phone?: string
          email?: string
          photo?: string
          bio?: string
          specialties?: string[]
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          quote: string
          name: string
          location: string
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quote: string
          name: string
          location: string
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quote?: string
          name?: string
          location?: string
          image?: string | null
          created_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          consultation_type: string
          preferred_date: string
          preferred_time: string
          message: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          property_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          consultation_type: string
          preferred_date: string
          preferred_time: string
          message?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          property_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          consultation_type?: string
          preferred_date?: string
          preferred_time?: string
          message?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          property_id?: string | null
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
