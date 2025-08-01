import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite (these must be set in your .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a single supabase client for use throughout your app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);