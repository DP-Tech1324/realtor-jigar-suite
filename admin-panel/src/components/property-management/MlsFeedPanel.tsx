import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Loader, RefreshCw, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AgentMatch {
  agent_key: string;
  name: string;
  city: string | null;
  office: string | null;
}

async function callSync(body: Record<string, unknown> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/api/ddf-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

// CREA DDF® controls: run the sync now, and find the agent key for DDF_AGENT_KEYS
export function MlsFeedPanel({ onSynced }: { onSynced: () => void }) {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState('');
  const [agentName, setAgentName] = useState('Jigar Patel');
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState<AgentMatch[] | null>(null);

  const syncNow = async () => {
    setSyncing(true);
    try {
      // Each call works for up to ~4 minutes; the first full Ontario load takes several calls
      const total = { updated: 0, removed: 0, own: 0 };
      for (let round = 1; round <= 30; round++) {
        setProgress(`Run ${round}: ${total.updated.toLocaleString()} listings saved so far…`);
        const r = await callSync();
        total.updated += r.updated || 0;
        total.removed += r.removed || 0;
        total.own = r.own_listings || 0;
        if (!r.more) break;
      }
      toast({
        title: 'MLS® sync complete',
        description: `${total.updated.toLocaleString()} listings saved, ${total.removed.toLocaleString()} removed, ${total.own} of Jigar's own.${total.own ? '' : ' Set DDF_AGENT_KEYS to mark Jigar’s own listings.'}`,
      });
      onSynced();
    } catch (e: any) {
      toast({ title: 'MLS® sync failed', description: e.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
      setProgress('');
    }
  };

  const findAgent = async () => {
    setSearching(true);
    try {
      const r = await callSync({ find_agent: agentName });
      setMatches(r.matches);
    } catch (e: any) {
      toast({ title: 'Lookup failed', description: e.message, variant: 'destructive' });
    } finally {
      setSearching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>MLS® Feed (CREA DDF®)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            All Ontario MLS® listings sync automatically twice a day; other provinces are searched live on the website.
            Jigar's own MLS® listings appear below so you can add Vastu details.
            {progress && <span className="block mt-1 font-medium text-realtor-navy">{progress}</span>}
          </p>
          <Button onClick={syncNow} disabled={syncing} variant="outline" className="shrink-0">
            {syncing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            {syncing ? 'Syncing…' : 'Sync now'}
          </Button>
        </div>

        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer text-sm font-medium">Find Jigar's agent key (for DDF_AGENT_KEYS)</summary>
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <Input value={agentName} onChange={(e) => setAgentName(e.target.value)} aria-label="Agent name" />
              <Button onClick={findAgent} disabled={searching || !agentName.trim()}>
                {searching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2">Find</span>
              </Button>
            </div>
            {matches && matches.length === 0 && <p className="text-sm text-gray-500">No agents found with that name.</p>}
            {matches && matches.length > 0 && (
              <ul className="divide-y text-sm">
                {matches.map((m) => (
                  <li key={m.agent_key} className="flex items-center justify-between gap-3 py-2">
                    <span>
                      <span className="font-medium">{m.name}</span>
                      {m.office ? ` · ${m.office}` : ''}{m.city ? ` · ${m.city}` : ''}
                      <span className="block text-xs text-gray-500">Agent key: {m.agent_key}</span>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Copy agent key ${m.agent_key}`}
                      onClick={() => { navigator.clipboard.writeText(m.agent_key); toast({ title: 'Agent key copied' }); }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-500">
              Copy the key for Jigar's brokerage into DDF_AGENT_KEYS in Vercel (admin project), then run Sync now.
            </p>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
