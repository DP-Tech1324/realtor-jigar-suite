// Vastu Shastra rules shared by the admin panel and the client site.
// Keep admin-panel/src/lib/vastu.ts and client-site/src/lib/vastu.ts identical.
//
// A listing stores its facing direction in `listings.facing`, the room layout in
// `listings.vastu` (VastuData), and the computed score in `listings.vastu_score`
// so the site can filter on it.

export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
export type Zone = Direction | 'C';

export type RoomKey =
  | 'living'
  | 'kitchen'
  | 'master_bedroom'
  | 'bedroom'
  | 'pooja'
  | 'dining'
  | 'bathroom'
  | 'staircase'
  | 'study'
  | 'garage'
  | 'open'
  | 'other';

export interface VastuData {
  enabled: boolean;
  zones: Partial<Record<Zone, RoomKey>>;
  plot_shape?: 'square' | 'rectangle' | 'irregular';
  slope?: Direction | 'flat';
  water_underground?: Direction;
  water_overhead?: Direction;
  notes?: string;
}

export type Verdict = 'ideal' | 'acceptable' | 'not_ideal';

export interface VastuCheck {
  label: string;
  value: string;
  verdict: Verdict;
}

export const MIN_CHECKS_FOR_SCORE = 3;

export const DIRECTIONS: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Grid order for a north-up 3x3 plan: top row NW N NE, middle W C E, bottom SW S SE
export const GRID_ZONES: Zone[] = ['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'];

export const DIRECTION_LABELS: Record<Zone, string> = {
  N: 'North',
  NE: 'North-east',
  E: 'East',
  SE: 'South-east',
  S: 'South',
  SW: 'South-west',
  W: 'West',
  NW: 'North-west',
  C: 'Centre',
};

export const ROOM_LABELS: Record<RoomKey, string> = {
  living: 'Living room',
  kitchen: 'Kitchen',
  master_bedroom: 'Master bedroom',
  bedroom: 'Bedroom',
  pooja: 'Pooja room',
  dining: 'Dining',
  bathroom: 'Washroom',
  staircase: 'Staircase',
  study: 'Study',
  garage: 'Garage',
  open: 'Open / courtyard',
  other: 'Other',
};

const ROOM_RULES: Partial<Record<RoomKey, { ideal: Zone[]; acceptable: Zone[] }>> = {
  living: { ideal: ['N', 'NE', 'E'], acceptable: ['NW', 'W'] },
  kitchen: { ideal: ['SE'], acceptable: ['NW'] },
  master_bedroom: { ideal: ['SW'], acceptable: ['S', 'W'] },
  bedroom: { ideal: ['S', 'W', 'NW'], acceptable: ['SW', 'E'] },
  pooja: { ideal: ['NE'], acceptable: ['N', 'E'] },
  dining: { ideal: ['W', 'E'], acceptable: ['N', 'NW', 'S'] },
  bathroom: { ideal: ['NW', 'W'], acceptable: ['S', 'SE'] },
  staircase: { ideal: ['S', 'SW', 'W'], acceptable: ['SE', 'NW'] },
  study: { ideal: ['NE', 'E', 'N'], acceptable: ['W'] },
  garage: { ideal: ['NW', 'SE'], acceptable: ['N', 'E', 'S', 'W'] },
};

function judge(zone: Zone, rule: { ideal: Zone[]; acceptable: Zone[] }): Verdict {
  if (rule.ideal.includes(zone)) return 'ideal';
  if (rule.acceptable.includes(zone)) return 'acceptable';
  return 'not_ideal';
}

export function emptyVastu(): VastuData {
  return { enabled: false, zones: {} };
}

// Reads whatever is stored in the jsonb column and returns a well-formed object.
export function parseVastu(raw: unknown): VastuData | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Partial<VastuData>;
  return {
    enabled: !!value.enabled,
    zones: value.zones && typeof value.zones === 'object' ? value.zones : {},
    plot_shape: value.plot_shape,
    slope: value.slope,
    water_underground: value.water_underground,
    water_overhead: value.water_overhead,
    notes: value.notes,
  };
}

export function evaluateVastu(
  vastu: VastuData | null,
  facing?: Direction | null,
): { checks: VastuCheck[]; score: number | null } {
  const checks: VastuCheck[] = [];

  if (facing) {
    checks.push({
      label: 'Main entrance',
      value: `${DIRECTION_LABELS[facing]} facing`,
      verdict: judge(facing, { ideal: ['N', 'NE', 'E'], acceptable: ['NW', 'W'] }),
    });
  }

  if (vastu) {
    for (const zone of GRID_ZONES) {
      const room = vastu.zones[zone];
      if (!room) continue;

      if (zone === 'C') {
        const verdict: Verdict =
          room === 'open' ? 'ideal' : ['bathroom', 'kitchen', 'staircase'].includes(room) ? 'not_ideal' : 'acceptable';
        checks.push({ label: 'Centre (Brahmasthan)', value: ROOM_LABELS[room], verdict });
        continue;
      }

      const rule = ROOM_RULES[room];
      if (!rule) continue;
      checks.push({ label: ROOM_LABELS[room], value: DIRECTION_LABELS[zone], verdict: judge(zone, rule) });
    }

    if (vastu.plot_shape) {
      checks.push({
        label: 'Plot shape',
        value: vastu.plot_shape === 'irregular' ? 'Irregular' : vastu.plot_shape === 'square' ? 'Square' : 'Rectangle',
        verdict: vastu.plot_shape === 'irregular' ? 'not_ideal' : 'ideal',
      });
    }
    if (vastu.slope) {
      checks.push({
        label: 'Land slope',
        value: vastu.slope === 'flat' ? 'Flat' : `Down towards ${DIRECTION_LABELS[vastu.slope]}`,
        verdict: vastu.slope === 'flat' ? 'acceptable' : judge(vastu.slope, { ideal: ['NE', 'N', 'E'], acceptable: ['NW'] }),
      });
    }
    if (vastu.water_underground) {
      checks.push({
        label: 'Underground water tank',
        value: DIRECTION_LABELS[vastu.water_underground],
        verdict: judge(vastu.water_underground, { ideal: ['NE', 'N', 'E'], acceptable: ['W'] }),
      });
    }
    if (vastu.water_overhead) {
      checks.push({
        label: 'Overhead water tank',
        value: DIRECTION_LABELS[vastu.water_overhead],
        verdict: judge(vastu.water_overhead, { ideal: ['SW', 'S', 'W'], acceptable: ['NW'] }),
      });
    }
  }

  // A score from one or two data points would mislead buyers, so require a few
  if (checks.length < MIN_CHECKS_FOR_SCORE) return { checks, score: null };
  const points = checks.reduce((sum, c) => sum + (c.verdict === 'ideal' ? 1 : c.verdict === 'acceptable' ? 0.5 : 0), 0);
  return { checks, score: Math.round((points / checks.length) * 10) };
}

export function vastuLabel(score: number): string {
  if (score >= 8) return 'Vastu-friendly';
  if (score >= 6) return 'Mostly Vastu-friendly';
  return 'Some Vastu concerns';
}

// Zone a room should ideally sit in, used for the hint text in the admin editor.
export function idealZonesFor(room: RoomKey): Zone[] {
  return ROOM_RULES[room]?.ideal ?? [];
}
