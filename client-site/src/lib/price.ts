import type { Listing } from '@/hooks/useListings';

const cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export const isRental = (listing: Pick<Listing, 'transaction_type'>) => listing.transaction_type === 'rent';

// "$779,999" for sales, "$3,500/month" for rentals, so a lease never reads as a cheap sale
export const formatListingPrice = (listing: Pick<Listing, 'price' | 'transaction_type'>) => {
  if (!listing.price) return 'Price on request';
  return isRental(listing) ? `${cad.format(listing.price)}/month` : cad.format(listing.price);
};
