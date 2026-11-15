import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { Listing } from '@/hooks/useListings';

// Property facts grouped like the major brokerage sites: summary, building, land & parking,
// rooms by level. MLS® listings get the full CREA record live (client-site/api/ddf-search.js
// ?details=), so nothing extra is stored; Jigar's own manual listings show what the admin holds.

export interface Fact { label: string; value: string }
interface Room { type: string; level: string | null; metric: string | null; imperial: string | null; dimensions: string | null; description: string | null }
interface ListingDetails { summary: Fact[]; building: Fact[]; land: Fact[]; rooms: Room[]; inclusions: string | null }

export const useListingDetails = (listing: Listing) => {
  const key = listing.source === 'ddf' ? listing.listing_key : null;
  return useQuery({
    queryKey: ['listing-details', key],
    queryFn: async () => {
      const res = await fetch(`/api/ddf-search?details=${encodeURIComponent(key!)}`);
      if (!res.ok) throw new Error('Details unavailable');
      return (await res.json()).details as ListingDetails;
    },
    enabled: !!key,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
};

const FactGroup: React.FC<{ title: string; facts: Fact[] }> = ({ title, facts }) => {
  if (!facts.length) return null;
  return (
    <section>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <dl className="grid sm:grid-cols-2 gap-x-8 rounded-2xl border border-slate-200 bg-white px-5">
        {facts.map((f) => (
          <div key={f.label} className="flex justify-between gap-4 py-3 border-b border-slate-100">
            <dt className="text-slate-600">{f.label}</dt>
            <dd className="text-slate-900 font-medium text-right">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

const RoomsTable: React.FC<{ rooms: Room[] }> = ({ rooms }) => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('imperial');
  if (!rooms.length) return null;
  // Group by level, keeping CREA's order
  const levels: [string, Room[]][] = [];
  rooms.forEach((r) => {
    const level = r.level || 'Other';
    const group = levels.find(([l]) => l === level);
    if (group) group[1].push(r);
    else levels.push([level, [r]]);
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-slate-900">Rooms</h3>
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-sm" role="group" aria-label="Room size units">
          {(['imperial', 'metric'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              aria-pressed={unit === u}
              className={`px-3 py-1 rounded-md ${unit === u ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {u === 'imperial' ? 'Feet' : 'Metres'}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-4 py-2">Room</th>
              <th className="text-left font-medium px-4 py-2">Size</th>
              <th className="text-left font-medium px-4 py-2 hidden sm:table-cell">Features</th>
            </tr>
          </thead>
          {levels.map(([level, list]) => (
            <tbody key={level}>
              <tr className="bg-slate-50/60">
                <th colSpan={3} className="text-left px-4 py-2 font-semibold text-slate-900 border-t border-slate-200">{level}</th>
              </tr>
              {list.map((r, i) => (
                <tr key={`${r.type}-${i}`} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-2 text-slate-900">{r.type}</td>
                  <td className="px-4 py-2 text-slate-700 whitespace-nowrap">{r[unit] || r.dimensions || '—'}</td>
                  <td className="px-4 py-2 text-slate-600 hidden sm:table-cell">{r.description || ''}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  );
};

const ListingFacts: React.FC<{ listing: Listing; basic: Fact[] }> = ({ listing, basic }) => {
  const { data, isLoading, isError } = useListingDetails(listing);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }
  // Manual listings, or CREA unreachable: the basics we hold
  if (!data || isError) return <FactGroup title="Property Summary" facts={basic} />;

  // Keep the MLS® number, which isn't part of the CREA groups
  const summary = [...data.summary, ...basic.filter((f) => f.label === 'MLS® number')];
  return (
    <div className="space-y-8">
      <FactGroup title="Property Summary" facts={summary} />
      <FactGroup title="Building Features" facts={data.building} />
      <FactGroup title="Land & Parking" facts={data.land} />
      <RoomsTable rooms={data.rooms} />
      {data.inclusions && (
        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Inclusions</h3>
          <p className="text-slate-700">{data.inclusions}</p>
        </section>
      )}
    </div>
  );
};

export default ListingFacts;
