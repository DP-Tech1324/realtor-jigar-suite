import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Listing } from '@/hooks/useListings';

// CREA DDF® display rules: show the listing brokerage, link to REALTOR.ca and carry the
// trademark notice wherever MLS® listing data appears.

export const isDdf = (listing: Pick<Listing, 'source'>) => listing.source === 'ddf';

export const DDF_TRADEMARK_NOTICE =
  'The trademarks REALTOR®, REALTORS® and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate professionals who are members of CREA. The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by CREA and identify the quality of services provided by real estate professionals who are members of CREA. Listing information is provided by members of CREA and is deemed reliable but not guaranteed.';

// One line for listing cards
export const DdfCardCredit: React.FC<{ listing: Listing }> = ({ listing }) => {
  if (!isDdf(listing) || listing.is_own_listing) return null;
  return (
    <p className="text-xs text-slate-500 -mt-2 mb-2 line-clamp-1">
      Listed by {listing.list_office_name || 'a CREA member brokerage'} · MLS® {listing.mls_number}
    </p>
  );
};

// Block for the property page
export const DdfDetailCredit: React.FC<{ listing: Listing }> = ({ listing }) => {
  if (!isDdf(listing)) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm text-slate-700">
          <div className="font-semibold text-slate-900">
            {listing.is_own_listing ? 'Listed by Jigar Patel' : `Listed by ${listing.list_office_name || 'a CREA member brokerage'}`}
          </div>
          {listing.mls_number && <div>MLS® Number: {listing.mls_number}</div>}
        </div>
        {listing.listing_url && (
          <a
            href={listing.listing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            View on REALTOR.ca <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{DDF_TRADEMARK_NOTICE}</p>
    </div>
  );
};
