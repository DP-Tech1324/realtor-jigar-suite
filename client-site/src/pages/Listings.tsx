import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertySearch from "@/components/PropertySearch";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AiChatBubble from "@/components/AiChatBubble";
import PropertyCard from "@/components/PropertyCard";
import { searchLiveListings, type Listing } from "@/hooks/useListings";
import { applyFilters, describeSearch, isLiveSearch, liveParams, locationKind, parseSearch, searchUrl } from "@/lib/search";

const PAGE_SIZE = 24;

type Page = { rows: Listing[]; more: boolean; live: boolean };

// Stored listings (Ontario + Jigar's own), newest first, with Jigar's own listings on top
async function fetchStored(search: string, page: number): Promise<Page> {
  const filters = parseSearch(search);
  const from = page * PAGE_SIZE;

  const others = applyFilters(supabase.from("listings").select("*"), filters)
    .eq("is_own_listing", false)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const [own, rest] = await Promise.all([
    page === 0
      ? applyFilters(supabase.from("listings").select("*"), filters).eq("is_own_listing", true).order("created_at", { ascending: false }).limit(50)
      : Promise.resolve({ data: [], error: null }),
    others,
  ]);
  const error = own.error || rest.error;
  if (error) throw new Error(error.message);
  return { rows: [...(own.data || []), ...(rest.data || [])] as Listing[], more: (rest.data || []).length === PAGE_SIZE, live: false };
}

async function fetchPage(search: string, page: number): Promise<Page> {
  const filters = parseSearch(search);
  if (isLiveSearch(filters)) {
    const live = await searchLiveListings(liveParams(filters, page));
    return { rows: live.listings, more: live.hasMore, live: true };
  }
  const stored = await fetchStored(search, page);
  // A city we don't store (e.g. Calgary): search CREA live across Canada
  if (page === 0 && stored.rows.length === 0 && locationKind(filters.location) === "city" && !filters.featured) {
    const live = await searchLiveListings(liveParams(filters, 0));
    if (live.listings.length) return { rows: live.listings, more: live.hasMore, live: true };
  }
  return stored;
}

export default function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPage(0);
    fetchPage(location.search, 0)
      .then((r) => {
        if (cancelled) return;
        setResults(r.rows);
        setHasMore(r.more);
        setLive(r.live);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message.includes("timeout") ? "That search took too long. Try adding a city or narrowing the filters." : e.message);
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
      const r = await fetchPage(location.search, page + 1);
      setResults((prev) => [...prev, ...r.rows]);
      setHasMore(r.more);
      setPage(page + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const filters = parseSearch(location.search);

  return (
    <div className="container mx-auto py-10 px-4">
      <PropertySearch
        key={location.search}
        initialValues={filters}
        onSearch={(next) => navigate(searchUrl(next))}
      />

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">{describeSearch(filters)}</h1>
        {!loading && results.length > 0 && (
          <div className="text-sm text-slate-600">
            {live
              ? "Live MLS® listings. Outside Ontario, Jigar connects you with a trusted local REALTOR®."
              : `${results.length}${hasMore ? "+" : ""} ${results.length === 1 ? "listing" : "listings"}`}
          </div>
        )}
      </div>

      {loading && <div className="mt-6 text-slate-600">Loading properties...</div>}
      {error && <div className="text-red-600 text-center my-6">{error}</div>}

      {!loading && results.length > 0 && (
        <>
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
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
      {!loading && results.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-10">
          No listings match this search. Try a nearby city, a wider price range, or fewer filters.
        </div>
      )}

      <AiChatBubble />
    </div>
  );
}
