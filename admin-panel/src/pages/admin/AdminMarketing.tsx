import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarCheck, Copy, Download, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { timeAgo } from '@/hooks/useActivityFeed';

// Marketing = the leads the website collects: newsletter sign-ups and consultation
// requests (website inquiries have their own page). Everything here is live data.

interface Subscriber { id: string; email: string; created_at: string }
interface Consultation {
  id: string; name: string; email: string; phone: string | null; consultation_type: string | null;
  date: string | null; time: string | null; message: string | null; status: string; created_at: string;
}

const CONSULTATION_STATUSES = ['new', 'contacted', 'booked', 'closed'];
const DAY = 24 * 60 * 60 * 1000;

const downloadCsv = (filename: string, rows: string[][]) => {
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminMarketing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['marketing-leads'],
    queryFn: async () => {
      const since30 = new Date(Date.now() - 30 * DAY).toISOString();
      const [subs, consults, inquiries30] = await Promise.all([
        supabase.from('newsletter_subscriptions').select('id, email, created_at').order('created_at', { ascending: false }),
        supabase.from('consultations').select('*').order('created_at', { ascending: false }),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).gte('created_at', since30),
      ]);
      const failed = [subs, consults, inquiries30].find((r) => r.error);
      if (failed?.error) throw failed.error;
      return {
        subscribers: (subs.data || []) as Subscriber[],
        consultations: (consults.data || []) as Consultation[],
        inquiries30: inquiries30.count || 0,
      };
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('consultations').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-leads'] });
      queryClient.invalidateQueries({ queryKey: ['activity-feed'] });
    },
    onError: (e: Error) => toast({ title: 'Could not update status', description: e.message, variant: 'destructive' }),
  });

  if (error) {
    return <p className="text-red-600">Couldn't load marketing data: {(error as Error).message}</p>;
  }

  const subscribers = data?.subscribers || [];
  const consultations = data?.consultations || [];
  const since30 = Date.now() - 30 * DAY;
  const newSubs30 = subscribers.filter((s) => new Date(s.created_at).getTime() > since30).length;
  const openConsults = consultations.filter((c) => c.status === 'new').length;
  const q = search.trim().toLowerCase();
  const shownSubs = q ? subscribers.filter((s) => s.email.toLowerCase().includes(q)) : subscribers;

  const stats = [
    { label: 'Newsletter subscribers', value: subscribers.length, sub: `${newSubs30} in the last 30 days`, icon: Mail },
    { label: 'Consultation requests', value: consultations.length, sub: `${openConsults} waiting for a reply`, icon: CalendarCheck },
    { label: 'Website inquiries', value: data?.inquiries30 ?? 0, sub: 'Last 30 days', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-realtor-navy">Marketing & Leads</h1>
        <p className="text-gray-600 mt-2">Newsletter sign-ups and consultation requests from the website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="h-5 w-5 text-realtor-gold" /> {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? '…' : value.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle>Consultation Requests</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={!consultations.length}
            onClick={() => downloadCsv('consultations.csv', [
              ['Name', 'Email', 'Phone', 'Type', 'Preferred date', 'Preferred time', 'Status', 'Message', 'Received'],
              ...consultations.map((c) => [c.name, c.email, c.phone || '', c.consultation_type || '', c.date || '', c.time || '', c.status, c.message || '', c.created_at]),
            ])}
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : consultations.length === 0 ? (
            <p className="text-sm text-gray-500">No consultation requests yet. They arrive from the website's consultation form.</p>
          ) : (
            <div className="divide-y">
              {consultations.map((c) => (
                <div key={c.id} className="py-3 flex flex-col md:flex-row md:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{c.name} <span className="text-xs text-gray-400 font-normal">· {timeAgo(c.created_at)}</span></div>
                    <div className="text-sm text-gray-600">
                      <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                      {c.phone && <> · <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a></>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {[c.consultation_type, c.date, c.time].filter(Boolean).join(' · ')}
                    </div>
                    {c.message && <p className="text-sm text-gray-700 mt-1">{c.message}</p>}
                  </div>
                  <Select value={c.status} onValueChange={(status) => setStatus.mutate({ id: c.id, status })}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[...new Set([...CONSULTATION_STATUSES, c.status])].map((s) => (
                        <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
          <CardTitle>Newsletter Subscribers</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search email…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
            <Button
              variant="outline"
              size="sm"
              disabled={!subscribers.length}
              onClick={async () => {
                await navigator.clipboard.writeText(subscribers.map((s) => s.email).join(', '));
                toast({ title: 'Emails copied', description: `${subscribers.length} addresses, ready to paste into your email tool.` });
              }}
            >
              <Copy className="h-4 w-4 mr-2" /> Copy all emails
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!subscribers.length}
              onClick={() => downloadCsv('newsletter-subscribers.csv', [['Email', 'Subscribed'], ...subscribers.map((s) => [s.email, s.created_at])])}
            >
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : shownSubs.length === 0 ? (
            <p className="text-sm text-gray-500">
              {subscribers.length ? 'No subscribers match that search.' : 'No subscribers yet. They sign up through the newsletter box on the website.'}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr><th className="py-2 font-medium">Email</th><th className="py-2 font-medium">Subscribed</th></tr>
              </thead>
              <tbody className="divide-y">
                {shownSubs.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2"><a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a></td>
                    <td className="py-2 text-gray-500">{new Date(s.created_at).toLocaleDateString('en-CA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketing;
