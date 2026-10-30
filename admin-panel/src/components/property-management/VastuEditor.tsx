import React, { useState } from 'react';
import { Compass, Loader, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { callAI, imageToBase64 } from '@/lib/ai';
import {
  DIRECTIONS,
  DIRECTION_LABELS,
  GRID_ZONES,
  ROOM_LABELS,
  evaluateVastu,
  idealZonesFor,
  vastuLabel,
  type Direction,
  type RoomKey,
  type VastuData,
  type Verdict,
  type Zone,
} from '@/lib/vastu';

interface VastuEditorProps {
  vastu: VastuData;
  facing: Direction | null;
  onChange: (vastu: VastuData) => void;
  onFacingChange: (facing: Direction | null) => void;
}

const NONE = 'none';

const VERDICT_STYLES: Record<Verdict, { cell: string; pill: string; label: string }> = {
  ideal: { cell: 'border-green-600 bg-green-50', pill: 'bg-green-100 text-green-800', label: 'Ideal' },
  acceptable: { cell: 'border-amber-500 bg-amber-50', pill: 'bg-amber-100 text-amber-900', label: 'Acceptable' },
  not_ideal: { cell: 'border-red-500 bg-red-50', pill: 'bg-red-100 text-red-800', label: 'Not ideal' },
};

function DirectionSelect({ value, onChange, placeholder, includeFlat = false }: {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  includeFlat?: boolean;
}) {
  return (
    <Select value={value || NONE} onValueChange={(v) => onChange(v === NONE ? undefined : v)}>
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>Not specified</SelectItem>
        {includeFlat && <SelectItem value="flat">Flat</SelectItem>}
        {DIRECTIONS.map((d) => <SelectItem key={d} value={d}>{DIRECTION_LABELS[d]}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function VastuEditor({ vastu, facing, onChange, onFacingChange }: VastuEditorProps) {
  const { toast } = useToast();
  const [reading, setReading] = useState(false);
  const [northHint, setNorthHint] = useState('');
  const { checks, score } = evaluateVastu(vastu, facing);

  const update = (patch: Partial<VastuData>) => onChange({ ...vastu, ...patch });
  const setZone = (zone: Zone, room: string) => {
    const zones = { ...vastu.zones };
    if (room === NONE) delete zones[zone];
    else zones[zone] = room as RoomKey;
    update({ zones });
  };

  // Zone verdict for the grid colouring, using the same rules as the checklist
  const zoneVerdict = (zone: Zone): Verdict | null => {
    const room = vastu.zones[zone];
    if (!room) return null;
    const single = evaluateVastu({ enabled: true, zones: { [zone]: room } }, null);
    return single.checks[0]?.verdict ?? null;
  };

  const readFloorPlan = async (file: File) => {
    setReading(true);
    try {
      const payload = await imageToBase64(file);
      const result = await callAI<{ facing: string; zones: Record<Zone, string>; notes: string }>('floorplan', {
        ...payload,
        north_hint: northHint || undefined,
      });
      const zones: VastuData['zones'] = {};
      for (const zone of GRID_ZONES) {
        const room = result.zones[zone];
        if (room && room !== NONE) zones[zone] = room as RoomKey;
      }
      onChange({ ...vastu, enabled: true, zones, notes: vastu.notes || result.notes });
      if (result.facing !== 'unknown') onFacingChange(result.facing as Direction);
      toast({ title: 'Floor plan read', description: 'Check each zone below before saving. ' + result.notes });
    } catch (e: any) {
      toast({ title: 'Could not read floor plan', description: e.message, variant: 'destructive' });
    } finally {
      setReading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
        <div>
          <Label className="text-base">Show Vastu details on the website</Label>
          <p className="text-sm text-gray-500">Adds a Vastu section, score badge and search filter for this listing.</p>
        </div>
        <Switch checked={vastu.enabled} onCheckedChange={(enabled) => update({ enabled })} />
      </div>

      <div className="rounded-lg border border-dashed p-4 space-y-3">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="h-4 w-4 text-realtor-gold" /> Fill from floor plan (AI)
        </div>
        <p className="text-sm text-gray-500">
          Upload a floor plan image and Claude will suggest the facing and the room in each zone. Always double-check before saving.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Where is north? e.g. 'top of the plan' (optional)"
            value={northHint}
            onChange={(e) => setNorthHint(e.target.value)}
          />
          <Label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-realtor-navy px-4 py-2 text-sm font-medium text-white hover:bg-realtor-navy/90">
            {reading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {reading ? 'Reading plan…' : 'Upload floor plan'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              disabled={reading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) readFloorPlan(file);
                e.target.value = '';
              }}
            />
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Main entrance faces</Label>
          <DirectionSelect
            value={facing ?? undefined}
            onChange={(v) => onFacingChange((v as Direction) ?? null)}
            placeholder="Select facing"
          />
        </div>
        <div className="space-y-2">
          <Label>Plot shape</Label>
          <Select value={vastu.plot_shape || NONE} onValueChange={(v) => update({ plot_shape: v === NONE ? undefined : (v as VastuData['plot_shape']) })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Not specified</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="irregular">Irregular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <Compass className="h-4 w-4 text-realtor-navy" />
          <Label>Room in each zone (north at the top)</Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {GRID_ZONES.map((zone) => {
            const verdict = zoneVerdict(zone);
            const room = vastu.zones[zone];
            return (
              <div key={zone} className={`rounded-lg border-2 p-2 space-y-1 ${verdict ? VERDICT_STYLES[verdict].cell : 'border-gray-200'}`}>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>{DIRECTION_LABELS[zone]}</span>
                  {verdict && <span className={`rounded-full px-2 py-0.5 ${VERDICT_STYLES[verdict].pill}`}>{VERDICT_STYLES[verdict].label}</span>}
                </div>
                <Select value={room || NONE} onValueChange={(v) => setZone(zone, v)}>
                  <SelectTrigger className="h-9 bg-white" aria-label={`Room in ${DIRECTION_LABELS[zone]} zone`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>—</SelectItem>
                    {(Object.keys(ROOM_LABELS) as RoomKey[]).map((r) => (
                      <SelectItem key={r} value={r}>{ROOM_LABELS[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {room && verdict === 'not_ideal' && idealZonesFor(room).length > 0 && (
                  <p className="text-xs text-gray-600">Ideal: {idealZonesFor(room).map((z) => DIRECTION_LABELS[z]).join(', ')}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Land slopes down towards</Label>
          <DirectionSelect value={vastu.slope} onChange={(v) => update({ slope: v as VastuData['slope'] })} placeholder="Slope" includeFlat />
        </div>
        <div className="space-y-2">
          <Label>Underground water tank / well</Label>
          <DirectionSelect value={vastu.water_underground} onChange={(v) => update({ water_underground: v as Direction })} placeholder="Direction" />
        </div>
        <div className="space-y-2">
          <Label>Overhead water tank</Label>
          <DirectionSelect value={vastu.water_overhead} onChange={(v) => update({ water_overhead: v as Direction })} placeholder="Direction" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vastu notes (shown on the website)</Label>
        <Textarea
          rows={2}
          placeholder="e.g. Pooja room can be moved to the north-east bedroom easily."
          value={vastu.notes || ''}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <div className="rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Vastu score preview</span>
          {score !== null ? (
            <span className="text-lg font-bold text-realtor-navy">{score}/10 · {vastuLabel(score)}</span>
          ) : (
            <span className="text-sm text-gray-500">Fill in at least 3 items (facing, zones, plot details) to see the score</span>
          )}
        </div>
        {checks.length > 0 && (
          <ul className="mt-3 divide-y text-sm">
            {checks.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-1.5">
                <span><span className="font-medium">{c.label}</span> · {c.value}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${VERDICT_STYLES[c.verdict].pill}`}>{VERDICT_STYLES[c.verdict].label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
