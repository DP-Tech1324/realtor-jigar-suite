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

// Pre-written messages, so visitors only fill in the blanks (Contact page follows the topic)
export const TOPIC_MESSAGES: Record<InquiryType, string> = {
  buying: "Hi Jigar, I'm looking to buy a home.\nArea: \nBudget: \nBedrooms: \nWhen I'd like to move: ",
  selling: "Hi Jigar, I'm thinking of selling my home and would like to know what it's worth.\nAddress: \nWhen I'd like to sell: ",
  renting: "Hi Jigar, I'm looking for a place to rent.\nArea: \nBudget per month: \nMove-in date: ",
  commercial: "Hi Jigar, I'm interested in a commercial or business property.\nType (retail, office, restaurant...): \nArea: \nBudget: ",
  'pre-construction': "Hi Jigar, I'm interested in pre-construction homes.\nArea: \nBudget: \nBedrooms: \nMove-in: ",
  vastu: "Hi Jigar, I'd like Vastu advice for a home.\nAddress or MLS® number: \nWhat I'd like checked: ",
  showing: "Hi Jigar, I'd like to book a showing.",
  info: "Hi Jigar, please send me more information.",
  general: "Hi Jigar, I'd like to talk with you about real estate. Please call me.",
};

// A phone number Jigar can call back: at least 10 digits, allowing spaces, dashes, brackets, +1
// Written for the browser's strict pattern mode (the v flag), so brackets and dashes are escaped
export const PHONE_PATTERN = '\\+?[0-9\\s\\(\\)\\.\\-]{10,20}';
export const PHONE_HINT = 'Enter a phone number with area code, e.g. 647-801-5448';

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
