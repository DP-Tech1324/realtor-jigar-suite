import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, KeyRound, RadioTower, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { timeAgo } from '@/hooks/useActivityFeed';

const WEBSITE_URL = 'https://realtor-jigar-suite.vercel.app';

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-right">{children}</span>
  </div>
);

const AdminSettings = () => {
  const { user, userRole, profile } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  // MLS® feed status: what the sync has stored and when it last ran
  const { data: feed, error: feedError } = useQuery({
    queryKey: ['mls-feed-status'],
    queryFn: async () => {
      const [state, stored, own] = await Promise.all([
        supabase.from('ddf_sync_state').select('*').eq('id', 1).maybeSingle(),
        supabase.from('listings').select('id', { count: 'planned', head: true }).eq('source', 'ddf'),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('is_own_listing', true),
      ]);
      if (state.error) throw state.error;
      return { state: state.data, stored: stored.count ?? null, own: own.count ?? 0 };
    },
  });

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Password too short', description: 'Use at least 8 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not change password', description: error.message, variant: 'destructive' });
      return;
    }
    setPassword('');
    setConfirm('');
    toast({ title: 'Password changed' });
  };

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
  const lastRun = feed?.state?.updated_at;
  const stale = lastRun && Date.now() - new Date(lastRun).getTime() > 2 * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-realtor-navy">Settings</h1>
        <p className="text-gray-600 mt-2">Your account and the status of the MLS® feed</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-5 w-5 text-realtor-gold" /> Your account</CardTitle></CardHeader>
          <CardContent>
            {name && <Row label="Name">{name}</Row>}
            <Row label="Email">{user?.email}</Row>
            <Row label="Role">{userRole}</Row>
            <Row label="Member since">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-CA') : '—'}</Row>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-realtor-gold" /> Change password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={changePassword} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="new-pw">New password</Label>
                <Input id="new-pw" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-pw">Confirm new password</Label>
                <Input id="confirm-pw" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" disabled={saving} className="bg-realtor-gold hover:bg-realtor-gold/90 text-white">
                {saving ? 'Saving…' : 'Change password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><RadioTower className="h-5 w-5 text-realtor-gold" /> MLS® feed (CREA DDF®)</CardTitle></CardHeader>
          <CardContent>
            {feedError ? (
              <p className="text-sm text-red-600">Couldn't read the sync status: {(feedError as Error).message}</p>
            ) : feed && !feed.state ? (
              <p className="text-sm text-gray-600">
                {feed.stored != null && <>About {feed.stored.toLocaleString()} Ontario listings stored, {feed.own} of them Jigar's. </>}
                The sync status isn't visible to this account yet.
              </p>
            ) : (
              <>
                <Row label="Ontario listings stored">{feed?.stored != null ? `≈ ${feed.stored.toLocaleString()}` : '…'}</Row>
                <Row label="Jigar's own listings">{feed?.own ?? '…'}</Row>
                <Row label="Last sync run">
                  {lastRun ? (
                    <span className={stale ? 'text-orange-600' : ''}>{timeAgo(lastRun)}{stale ? ' (the nightly sync may be paused)' : ''}</span>
                  ) : '—'}
                </Row>
                <Row label="Feed position">
                  {feed?.state?.incremental_cursor ? `Changes up to ${new Date(feed.state.incremental_cursor).toLocaleString('en-CA')}` : 'Starting from the beginning'}
                </Row>
                <Row label="Last full check of removed listings">
                  {feed?.state?.reconcile_completed_at ? timeAgo(feed.state.reconcile_completed_at) : 'Not completed yet'}
                </Row>
              </>
            )}
            <p className="text-xs text-gray-500 mt-3">
              The sync runs on Vercel's schedule. Turn it on or off in Vercel → realtor-jigar-suite-bdod → Settings → Cron Jobs.
            </p>
          </CardContent>
        </Card>
      </div>

      <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-realtor-navy hover:underline">
        Open the public website <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};

export default AdminSettings;
