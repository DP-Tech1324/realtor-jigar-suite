import { supabase } from '@/integrations/supabase/client';

// What kind of request a website inquiry is (inquiries.inquiry_type). The admin panel shows
// these as badges; keep the list in step with admin-panel/src/lib/inquiries.ts.
export type InquiryType =
  | 'general'
  | 'showing'
  | 'info'
  | 'vastu'
  | 'pre-construction'
  | 'buying'
  | 'selling'
  | 'renting'
  | 'commercial';

// Contact page: "I'm interested in"
export const CONTACT_TOPICS: { value: InquiryType; label: string }[] = [
  { value: 'buying', label: 'Buying a home' },
  { value: 'selling', label: 'Selling my home' },
  { value: 'renting', label: 'Renting or leasing' },
  { value: 'commercial', label: 'Commercial or business property' },
  { value: 'pre-construction', label: 'Pre-construction' },
  { value: 'vastu', label: 'Vastu advice' },
  { value: 'general', label: 'Something else' },
];

// Book a Showing: 30-minute slots, 9:00 AM to 8:00 PM
export const SHOWING_TIMES = Array.from({ length: 23 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${((h + 11) % 12) + 1}:${m ? '30' : '00'} ${h < 12 ? 'AM' : 'PM'}`;
});

// Newsletter sign-up (homepage box and Blog page). A repeat email counts as success.
export async function subscribeToNewsletter(email: string): Promise<string | null> {
  const { error } = await supabase.from('newsletter_subscriptions').insert({ email: email.trim().toLowerCase() });
  if (error && error.code !== '23505') return error.message;
  return null;
}
