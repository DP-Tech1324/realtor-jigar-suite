import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatShowing, inquiryTypeInfo } from '@/lib/inquiries';

// What happened on the site recently, newest first, built from the real tables:
// website inquiries, consultation requests, newsletter sign-ups, changes to Jigar's
// listings and AI Vastu checks. Used by the dashboard and the notification bell.

export type ActivityKind = 'inquiry' | 'consultation' | 'subscriber' | 'listing' | 'vastu';

export interface Activity {
  id: string;
  kind: ActivityKind;
  title: string;
  detail?: string;
  at: string; // ISO timestamp
  link: string; // admin page to open
  needsAction?: boolean; // a lead nobody has handled yet
}

const LAST_SEEN_KEY = 'adminActivityLastSeen';

export const getLastSeen = () => {
  try {
    return localStorage.getItem(LAST_SEEN_KEY) || '1970-01-01T00:00:00Z';
  } catch {
    return '1970-01-01T00:00:00Z';
  }
};

export const markAllSeen = () => {
  try {
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
  } catch {
    // private mode: unread counts just won't persist
  }
};

export const timeAgo = (iso: string) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString('en-CA');
};

export const useActivityFeed = (limit = 15) =>
  useQuery({
    queryKey: ['activity-feed', limit],
    queryFn: async (): Promise<Activity[]> => {
      const [inquiries, consultations, subscribers, listings, vastu] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(limit),
        supabase.from('consultations').select('id, name, consultation_type, status, created_at').order('created_at', { ascending: false }).limit(limit),
        supabase.from('newsletter_subscriptions').select('id, email, created_at').order('created_at', { ascending: false }).limit(limit),
        supabase
          .from('listings')
          .select('id, title, address, created_at, updated_at')
          .or('source.eq.manual,is_own_listing.eq.true')
          .order('updated_at', { ascending: false })
          .limit(limit),
        supabase.from('listing_vastu_ai').select('listing_id, floor_plan_found, created_at').order('created_at', { ascending: false }).limit(limit),
      ]);
      const failed = [inquiries, consultations, subscribers, listings, vastu].find((r) => r.error);
      if (failed?.error) throw failed.error;

      const items: Activity[] = [
        ...(inquiries.data || []).map((i) => ({
          id: `inquiry-${i.id}`,
          kind: 'inquiry' as const,
          title: i.inquiry_type === 'showing'
            ? `Showing request from ${i.name}`
            : `${inquiryTypeInfo(i.inquiry_type).label} inquiry from ${i.name}`,
          detail: i.inquiry_type === 'showing' && i.preferred_date
            ? `Wants ${formatShowing(i.preferred_date, i.preferred_time)}`
            : i.message?.slice(0, 90),
          at: i.created_at,
          link: '/admin/inquiries',
          needsAction: i.status === 'new',
        })),
        ...(consultations.data || []).map((c) => ({
          id: `consultation-${c.id}`,
          kind: 'consultation' as const,
          title: `Consultation request from ${c.name}`,
          detail: c.consultation_type || undefined,
          at: c.created_at,
          link: '/admin/marketing',
          needsAction: c.status === 'new',
        })),
        ...(subscribers.data || []).map((s) => ({
          id: `subscriber-${s.id}`,
          kind: 'subscriber' as const,
          title: 'New newsletter subscriber',
          detail: s.email,
          at: s.created_at,
          link: '/admin/marketing',
        })),
        ...(listings.data || []).map((l) => {
          // Rows written within a minute of creation count as "added"
          const added = Math.abs(new Date(l.updated_at).getTime() - new Date(l.created_at).getTime()) < 60_000;
          return {
            id: `listing-${l.id}-${l.updated_at}`,
            kind: 'listing' as const,
            title: added ? 'Listing added' : 'Listing updated',
            detail: l.address || l.title,
            at: l.updated_at,
            link: '/admin/properties',
          };
        }),
        ...(vastu.data || []).map((v) => ({
          id: `vastu-${v.listing_id}`,
          kind: 'vastu' as const,
          title: 'AI Vastu check run by a visitor',
          detail: v.floor_plan_found ? 'Floor plan found' : 'No floor plan in the photos',
          at: v.created_at,
          link: '/admin/properties',
        })),
      ];

      return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
    },
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
