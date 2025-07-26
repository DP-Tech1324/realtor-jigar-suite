import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertySearch from "@/components/PropertySearch"; // <- this is your filter bar!
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AiChatBubble from "@/components/AiChatBubble";

// Helper: parse URL params into filter fields matching your DB
function parseFilters(search: string) {
  const params = new URLSearchParams(search);
  return {
    city: params.get("city") || "",
    propertyType: params.get("propertyType") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    bedrooms: params.get("bedrooms") || "",
    bathrooms: params.get("bathrooms") || "",
    saleType: params.get("saleType") || "", // will be "sale" or "rent"
    keywords: params.get("keywords") || "",
    mls: params.get("mls") || "",
    address: params.get("address") || "",
    postal_code: params.get("postal_code") || "",
  };
}

// Map search field names to DB columns
function applyDbFilters(query: any, filters: any) {
  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.propertyType) query = query.eq("property_type", filters.propertyType);

  // Price filter: min/max (always works, if filled)
  if (filters.minPrice) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);

  // Bedrooms/Bathrooms
  if (filters.bedrooms) query = query.gte("bedrooms", filters.bedrooms);
  if (filters.bathrooms) query = query.gte("bathrooms", filters.bathrooms);

  // Sale type
  if (filters.saleType) query = query.eq("transaction_type", filters.saleType);

  // MLS
  if (filters.mls) query = query.ilike("mls_number", `%${filters.mls}%`);

  // Address/postal
  if (filters.address) query = query.ilike("address", `%${filters.address}%`);
  if (filters.postal_code) query = query.ilike("postal_code", `%${filters.postal_code}%`);

  // Keywords (searches title, description, meta_keywords)
  if (filters.keywords) {
    query = query.or([
      `title.ilike.%${filters.keywords}%`,
      `description.ilike.%${filters.keywords}%`,
      `meta_keywords.ilike.%${filters.keywords}%`,
    ].join(","));
  }
  return query;
}

export default function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);
      const filters = parseFilters(location.search);

      let query = supabase.from("listings").select("*");
      query = applyDbFilters(query, filters);

      const { data, error } = await query;
      if (error) {
        setError(error.message);
        setResults([]);
      } else {
        setResults(data || []);
      }
      setLoading(false);
    }
    fetchProperties();
  }, [location.search]);

  return (
    <div className="container mx-auto py-10">
      {/* Filter bar at the top */}
      <PropertySearch
        initialValues={parseFilters(location.search)}
        onSearch={(filters) => {
          const qs = new URLSearchParams(
            Object.entries(filters)
              .filter(([_, v]) => v !== "" && v !== undefined)
              .map(([k, v]) => [k, String(v)]),
          ).toString();
          navigate(qs ? `/listings?${qs}` : "/listings");
        }}
      />

      {loading && <div>Loading properties...</div>}
      {error && <div className="text-red-500 text-center my-4">{error}</div>}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {results.map((listing) => (
            <div
              key={listing.id}
              className="border rounded-lg shadow p-4 bg-white flex flex-col"
            >
              <img
                src={listing.cover_image || "https://via.placeholder.com/300x200"}
                alt="Property"
                className="w-full h-48 object-cover rounded mb-2"
              />
              <div className="font-bold text-lg">
                {listing.title || listing.address}
              </div>
              <div className="text-sm text-gray-600">
                {listing.city}
                {listing.province ? `, ${listing.province}` : ""}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {listing.description?.slice(0, 80)}...
              </div>
              <div className="font-semibold text-blue-700 mb-2">
                {listing.price
                  ? `$${Number(listing.price).toLocaleString()}`
                  : "Price on Request"}
              </div>
              <Button
                className="mt-auto"
                onClick={() => navigate(`/property/${listing.id}`)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
      {!loading && results.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-10">No listings found.</div>
      )}

      {/* AI assistant bubble anchored to the bottom‑right */}
      <AiChatBubble />
    </div>
  );
}