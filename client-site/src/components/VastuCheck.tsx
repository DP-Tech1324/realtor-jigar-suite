import React, { useEffect, useState } from 'react';
import { Compass, Loader2, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VastuSection from '@/components/VastuSection';
import { supabase } from '@/integrations/supabase/client';
import { evaluateVastu, type Direction, type VastuData } from '@/lib/vastu';

interface Estimate {
  floor_plan_found: boolean;
  facing: Direction | null;
  zones: VastuData['zones'];
  confidence: string | null;
  notes: string | null;
}

interface VastuCheckProps {
  listingId: string;
  live?: boolean; // live CREA listing outside Ontario: not stored, so only the request option
  onRequest: () => void;
}

// Vastu for MLS® listings without details from Jigar: an on-demand AI estimate from the
// listing's floor plan (cached per listing), or a request for a Vastu report.
const VastuCheck: React.FC<VastuCheckProps> = ({ listingId, live, onRequest }) => {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(!live);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (live) return;
    let cancelled = false;
    supabase.from('listing_vastu_ai').select('*').eq('listing_id', listingId).maybeSingle().then(({ data }) => {
      if (!cancelled) {
        setEstimate((data as Estimate) || null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [listingId, live]);

  const runCheck = async () => {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch('/api/vastu-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'The Vastu check failed.');
      setEstimate(body.estimate);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setChecking(false);
    }
  };

  if (loading) return null;

  const vastu: VastuData | null = estimate?.floor_plan_found ? { enabled: true, zones: estimate.zones || {} } : null;
  const enoughDetail = vastu && evaluateVastu(vastu, estimate?.facing).score !== null;

  if (vastu && enoughDetail) {
    return (
      <VastuSection
        vastu={vastu}
        facing={estimate?.facing}
        estimate={{ confidence: estimate?.confidence, notes: estimate?.notes }}
        onAsk={onRequest}
      />
    );
  }

  return (
    <section id="vastu" className="scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Vastu Details</h2>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
        {estimate ? (
          <p className="text-slate-700">
            {estimate.floor_plan_found
              ? 'The floor plan in this listing doesn\'t show enough of the layout for a Vastu estimate.'
              : 'This listing\'s photos don\'t include a floor plan, so the room layout can\'t be read automatically.'}
            {estimate.facing ? ` The main entrance appears to face ${estimate.facing}.` : ''}
            {estimate.notes ? ` ${estimate.notes}` : ''}
          </p>
        ) : live ? (
          <p className="text-slate-700">
            Want to know how this home lines up with Vastu Shastra? Jigar can review the floor plan and send you a Vastu report.
          </p>
        ) : (
          <p className="text-slate-700">
            See how this home lines up with Vastu Shastra. Our AI reads the floor plan in the listing photos and maps each room
            by direction. It takes about a minute, and Jigar can confirm the result.
          </p>
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap gap-3">
          {!estimate && !live && (
            <Button onClick={runCheck} disabled={checking} className="bg-blue-600 hover:bg-blue-700">
              {checking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {checking ? 'Reading the floor plan…' : 'Check Vastu (AI)'}
            </Button>
          )}
          <Button variant="outline" onClick={onRequest}>
            <MessageCircle className="h-4 w-4 mr-2" /> Request a Vastu report from Jigar
          </Button>
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <Compass className="h-3.5 w-3.5" aria-hidden="true" /> AI estimates are for information only, not a professional Vastu assessment.
        </p>
      </div>
    </section>
  );
};

export default VastuCheck;
