import React from 'react';
import { CheckCircle, AlertTriangle, MinusCircle, Compass, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DIRECTION_LABELS,
  GRID_ZONES,
  ROOM_LABELS,
  evaluateVastu,
  parseVastu,
  vastuLabel,
  type Direction,
  type Verdict,
} from '@/lib/vastu';

interface VastuSectionProps {
  vastu: unknown;
  facing?: Direction | null;
  onAsk?: () => void;
  // Set for an AI estimate read from the listing's floor plan (not verified by Jigar)
  estimate?: { confidence?: string | null; notes?: string | null };
}

const VERDICT_UI: Record<Verdict, { label: string; pill: string; cell: string; Icon: typeof CheckCircle }> = {
  ideal: { label: 'Ideal', pill: 'bg-green-100 text-green-800', cell: 'bg-green-50 border-green-600 text-green-900', Icon: CheckCircle },
  acceptable: { label: 'Acceptable', pill: 'bg-amber-100 text-amber-900', cell: 'bg-amber-50 border-amber-500 text-amber-900', Icon: MinusCircle },
  not_ideal: { label: 'Not ideal', pill: 'bg-red-100 text-red-800', cell: 'bg-red-50 border-red-500 text-red-900', Icon: AlertTriangle },
};

// Shown on the property page when the listing has Vastu details turned on in the admin panel
const VastuSection: React.FC<VastuSectionProps> = ({ vastu: raw, facing, onAsk, estimate }) => {
  const vastu = parseVastu(raw);
  if (!vastu?.enabled) return null;

  const { checks, score } = evaluateVastu(vastu, facing);
  if (score === null) return null;

  const idealCount = checks.filter((c) => c.verdict === 'ideal').length;
  const zoneVerdict = (zone: (typeof GRID_ZONES)[number]): Verdict | null => {
    const room = vastu.zones[zone];
    if (!room) return null;
    return evaluateVastu({ enabled: true, zones: { [zone]: room } }, null).checks[0]?.verdict ?? null;
  };

  return (
    <section id="vastu" className="animate-fade-in scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex flex-wrap items-center gap-3">
            Vastu Details
            {estimate ? (
              <span className="text-sm font-semibold rounded-full bg-amber-100 text-amber-900 px-3 py-1">
                AI estimate{estimate.confidence ? ` · ${estimate.confidence} confidence` : ''} · confirm with Jigar
              </span>
            ) : (
              <span className="text-sm font-semibold rounded-full bg-green-100 text-green-800 px-3 py-1">Verified by Jigar</span>
            )}
          </h2>
          <p className="text-slate-600 max-w-xl">
            {estimate
              ? 'Read by AI from this listing\'s floor plan photo. Room placement and facing may be off; Jigar can confirm before you visit.'
              : 'Where each room sits by direction, so you can check this home against Vastu Shastra before you visit.'}
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 shrink-0">
          <div className="text-4xl font-bold text-green-700 leading-none">
            {score}<span className="text-lg text-green-800">/10</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900">{vastuLabel(score)}</div>
            <div className="text-sm text-green-800">{idealCount} of {checks.length} points ideal</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Direction grid, north at the top */}
        {Object.keys(vastu.zones).length > 0 && (
          <div className="lg:col-span-2">
            <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Room directions</div>
            <div className="relative px-7 py-7 max-w-sm mx-auto">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-1 text-sm font-bold text-blue-700">
                <Compass className="h-4 w-4" aria-hidden="true" /> N
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm font-semibold text-slate-500">S</div>
              <div className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">W</div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">E</div>
              <div className="grid grid-cols-3 gap-1.5 aspect-square" role="list" aria-label="Rooms by direction, north at the top">
                {GRID_ZONES.map((zone) => {
                  const room = vastu.zones[zone];
                  const verdict = zoneVerdict(zone);
                  return (
                    <div
                      key={zone}
                      role="listitem"
                      className={`rounded-lg border-2 p-2 flex flex-col justify-between ${
                        verdict ? VERDICT_UI[verdict].cell : 'bg-slate-50 border-dashed border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-[11px] font-bold tracking-wide opacity-80">{zone === 'C' ? 'CENTRE' : zone}</span>
                      <span className="text-xs sm:text-sm font-semibold leading-tight">{room ? ROOM_LABELS[room] : '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Checklist */}
        <div className={Object.keys(vastu.zones).length > 0 ? 'lg:col-span-3' : 'lg:col-span-5'}>
          <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Vastu checklist</div>
          <ul className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {checks.map((check, i) => {
              const ui = VERDICT_UI[check.verdict];
              return (
                <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                  <span className="flex-1 min-w-[140px] font-semibold text-slate-900">{check.label}</span>
                  <span className="flex-1 min-w-[140px] text-slate-700">{check.value}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${ui.pill}`}>
                    <ui.Icon className="h-4 w-4" aria-hidden="true" /> {ui.label}
                  </span>
                </li>
              );
            })}
          </ul>
          {(estimate?.notes || vastu.notes) && <p className="mt-4 text-slate-700">{estimate?.notes || vastu.notes}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm text-slate-600 max-w-2xl">
          {estimate
            ? 'This is an automated estimate from listing photos, not a professional Vastu assessment. Please consult a Vastu expert'
            : 'Vastu details are provided by the listing agent from the floor plan, for information only. Please consult a Vastu expert'}
          {facing ? ` (main entrance: ${DIRECTION_LABELS[facing]} facing)` : ''} before making a decision.
        </p>
        {onAsk && (
          <Button onClick={onAsk} className="bg-blue-600 hover:bg-blue-700 shrink-0">
            <MessageCircle className="h-4 w-4 mr-2" /> {estimate ? 'Request full Vastu report' : 'Ask about Vastu'}
          </Button>
        )}
      </div>
    </section>
  );
};

export default VastuSection;
