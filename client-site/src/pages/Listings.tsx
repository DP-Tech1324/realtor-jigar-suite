// src/pages/Listings.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertySearch from "@/components/PropertySearch"; // <-- reuse your filter bar!
import { Button } from "@/components/ui/button";

export default function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://realtor-jigar-suite-bdod.vercel.app/api/ddf-listings${location.search}`)
      .then(res => res.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <div className="container mx-auto py-10">
      {/* Filter bar at the top */}
      <PropertySearch onSearch={filters => {
        // When filters submitted, update URL
        const params = new URLSearchParams(
          Object.fromEntries(
            Object.entries(filters).map(([k, v]) => [k, v?.toString() ?? ""])
          )
        ).toString();
        navigate(`/listings?${params}`);
      }} />

      {/* Results */}
      {loading && <div>Loading properties...</div>}
      {!loading && results.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {results.map(listing => (
            <div key={listing.ListingKey} className="border rounded-lg shadow p-4 bg-white flex flex-col">
              {listing.Media && listing.Media[0]?.MediaURL && (
                <img src={listing.Media[0].MediaURL} alt="Property" className="w-full h-48 object-cover rounded mb-2" />
              )}
              <div className="font-bold text-lg">{listing.PropertySubType || "Property"}</div>
              <div className="text-sm text-gray-600">{listing.City}</div>
              <div className="text-xs text-gray-500 mb-2">{listing.PublicRemarks?.slice(0, 80)}...</div>
              <Button
  className="mt-auto"
  onClick={() => navigate(`/ddf/${listing.ListingKey}`)}
>
  View Details
</Button>
            </div>
          ))}
        </div>
      )}
      {!loading && results.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No listings found.</div>
      )}
    </div>
  );
}
