import { createClient } from '@supabase/supabase-js';
import { processLock } from '@supabase/auth-js';

// Get environment variables from Vite (these must be set in your .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a single supabase client for use throughout your app.
// processLock keeps the auth lock inside this tab: with the default cross-tab browser lock,
// one stuck tab of the site froze every other open tab (pages stuck on "Loading...").
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { lock: processLock },
});
