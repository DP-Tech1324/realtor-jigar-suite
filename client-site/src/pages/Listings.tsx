import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MasterPropertySearchForm from "@/components/MasterPropertySearchForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Helper to parse filters from location.search
function parseFilters(search: string) {
  const params = new URLSearchParams(search);
  return {
    city: params.get("city") || undefined,
    address: params.get("address") || undefined,
    postal_code: params.get("postal_code") || undefined,
    mls: params.get("mls") || undefined,
    type: params.get("type") || undefined,
    price: params.get("price") || undefined,
    homeType: params.get("homeType") || undefined,
    commercialType: params.get("commercialType") || undefined,
    saleType: params.get("saleType") || undefined,
    beds: params.get("beds") || undefined,
    baths: params.get("baths") || undefined,
    propertyType: params.get("propertyType") || undefined,
    commercialPropertyType: params.get("commercialPropertyType") || undefined,
    sqft: params.get("sqft") || undefined,
    daysOnMarket: params.get("daysOnMarket") || undefined,
    showOnly: params.get("showOnly") || undefined,
    keywords: params.get("keywords") || undefined,
  };
}

export default function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      const filters = parseFilters(location.search);
      let query = supabase.from("listings").select("*");

      // Apply filters
      if (filters.city) query = query.ilike("city", `%${filters.city}%`);
      if (filters.address) query = query.ilike("address", `%${filters.address}%`);
      if (filters.mls) query = query.eq("mls_number", filters.mls);
      if (filters.type) query = query.eq("property_type", filters.type);
      if (filters.price && filters.price.includes("-")) {
        const [min, max] = filters.price.split("-");
        query = query.gte("price", min).lte("price", max);
      } else if (filters.price && filters.price.endsWith("+")) {
        const min = filters.price.replace("+", "");
        query = query.gte("price", min);
      }
      if (filters.homeType) query = query.ilike("homeType", `%${filters.homeType}%`);
      if (filters.commercialType) query = query.ilike("commercialType", `%${filters.commercialType}%`);
      if (filters.saleType) query = query.eq("sale_type", filters.saleType);
      if (filters.beds) query = query.gte("bedrooms", filters.beds);
      if (filters.baths) query = query.gte("bathrooms", filters.baths);
      if (filters.propertyType) query = query.eq("property_type", filters.propertyType);
      if (filters.commercialPropertyType) query = query.eq("commercial_property_type", filters.commercialPropertyType);
      if (filters.sqft) query = query.gte("square_footage", filters.sqft);
      // Add more as needed...

      // Fetch data
      const { data, error } = await query;
      setResults(data || []);
      setLoading(false);
    }
    fetchProperties();
  }, [location.search]);

  return (
    <div className="container mx-auto py-10">
      <MasterPropertySearchForm
        onSearch={filters => {
          const qs = new URLSearchParams(
            Object.entries(filters)
              .filter(([k, v]) => v !== "" && v !== undefined)
              .map(([k, v]) => [k, String(v)])
          ).toString();
          navigate(`/listings?${qs}`);
        }}
      />

      {loading && <div>Loading properties...</div>}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {results.map(listing => (
            <div key={listing.id} className="border rounded-lg shadow p-4 bg-white flex flex-col">
              <img src={listing.cover_image || "https://via.placeholder.com/300x200"} alt="Property" className="w-full h-48 object-cover rounded mb-2" />
              <div className="font-bold text-lg">{listing.title || listing.address}</div>
              <div className="text-sm text-gray-600">{listing.city}</div>
              <div className="text-xs text-gray-500 mb-2">{listing.description?.slice(0, 80)}...</div>
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
      {!loading && results.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No listings found.</div>
      )}
    </div>
  );
}
