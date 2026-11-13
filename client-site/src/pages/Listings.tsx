import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertySearch from "@/components/PropertySearch"; // <- this is your filter bar!
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AiChatBubble from "@/components/AiChatBubble";
import PropertyCard from "@/components/PropertyCard";
import { searchLiveListings } from "@/hooks/useListings";
import { PROVINCE_LABELS } from "@/components/PropertySearch";

const PAGE_SIZE = 24;

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
    facing: params.get("facing") || "",
    vastu: params.get("vastu") || "",
    province: params.get("province") || "", // "" or "ON" = stored Ontario listings; others = live CREA search
  };
}

// Map search field names to DB columns
function applyDbFilters(query: any, filters: any) {
  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.province === "ON") query = query.eq("province", "ON");
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

  // Vastu
  if (filters.facing) query = query.eq("facing", filters.facing);
  if (filters.vastu) query = query.gte("vastu_score", 7); // score is only stored when Vastu is switched on

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  // "stored" = Supabase (Ontario + manual listings); "live" = CREA search for the rest of Canada
  const [mode, setMode] = useState<"stored" | "live">("stored");

  const fetchPage = async (pageNumber: number) => {
    const filters = parseFilters(location.search);
    const liveParams = {
      city: filters.city,
      province: filters.province,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      saleType: filters.saleType,
      propertyType: filters.propertyType,
      page: String(pageNumber),
    };

    if (filters.province && filters.province !== "ON") {
      const live = await searchLiveListings(liveParams);
      return { rows: live.listings, more: live.hasMore, mode: "live" as const };
    }

    // Drafts are hidden by RLS; Jigar's listings first, then available before pending/sold
    let query = supabase
      .from("listings")
      .select("*")
      .neq("status", "draft")
      .order("is_own_listing", { ascending: false })
      .order("status", { ascending: true })
      .order("created_at", { ascending: false })
      .range(pageNumber * PAGE_SIZE, pageNumber * PAGE_SIZE + PAGE_SIZE - 1);
    query = applyDbFilters(query, filters);
    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // A city we don't store (e.g. Calgary): search CREA live across Canada
    if (pageNumber === 0 && (data || []).length === 0 && filters.city && !filters.province) {
      const live = await searchLiveListings(liveParams);
      return { rows: live.listings, more: live.hasMore, mode: "live" as const };
    }
    return { rows: data || [], more: (data || []).length === PAGE_SIZE, mode: "stored" as const };
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPage(0);
    fetchPage(0)
      .then((r) => {
        if (cancelled) return;
        setResults(r.rows);
        setHasMore(r.more);
        setMode(r.mode);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setResults([]);
        setHasMore(false);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [location.search]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const r = await fetchPage(page + 1);
      setResults((prev) => [...prev, ...r.rows]);
      setHasMore(r.more);
      setPage(page + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const filters = parseFilters(location.search);
  const where = filters.city || PROVINCE_LABELS[filters.province] || "";

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
        <>
          <div className="text-sm text-slate-600 mt-8">
            {mode === "live"
              ? `Showing live MLS® listings${where ? ` in ${where}` : ""}. Outside Ontario, Jigar connects you with a trusted local REALTOR®.`
              : `${results.length}${hasMore ? "+" : ""} ${results.length === 1 ? "home" : "homes"} found`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {results.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onViewDetails={(id) => navigate(`/property/${id}`)}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more homes"}
              </Button>
            </div>
          )}
        </>
      )}
      {!loading && results.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-10">No listings found.</div>
      )}

      {/* AI assistant bubble anchored to the bottom‑right */}
      <AiChatBubble />
    </div>
  );
}