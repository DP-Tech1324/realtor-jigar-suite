import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Home, MapPin, DollarSign, BedDouble, Bath, Compass, Ruler, Tag } from "lucide-react";
import { DIRECTIONS, DIRECTION_LABELS } from "@/lib/vastu";
import { EMPTY_FILTERS, PROPERTY_TYPES, PROVINCE_LABELS, type SearchFilters } from "@/lib/search";
import { supabase } from "@/integrations/supabase/client";

// Cities with listings, for the location suggestions (loaded once per visit)
let citiesCache: string[] | null = null;
function useCities() {
  const [cities, setCities] = useState<string[]>(citiesCache || []);
  useEffect(() => {
    if (citiesCache) return;
    supabase.rpc("listing_cities").then(({ data }) => {
      citiesCache = (data || []).map((c: { city: string }) => c.city);
      setCities(citiesCache);
    });
  }, []);
  return cities;
}

const fieldClass = "w-full h-10 px-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500";
const labelClass = "flex items-center text-xs font-semibold text-gray-700 mb-1";

interface PropertySearchProps {
  initialValues?: Partial<SearchFilters>;
  onSearch: (filters: SearchFilters) => void;
}

export default function PropertySearch({ onSearch, initialValues = {} }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({ ...EMPTY_FILTERS, ...initialValues });
  const cities = useCities();
  const set = (field: keyof SearchFilters, value: string) => setFilters((prev) => ({ ...prev, [field]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // A chosen property type decides residential vs commercial
    const category = filters.propertyType === "commercial" ? "commercial" : filters.propertyType ? "residential" : filters.category;
    onSearch({ ...filters, category });
  };

  const reset = () => {
    setFilters(EMPTY_FILTERS);
    onSearch(EMPTY_FILTERS);
  };

  const typeValue = filters.propertyType || (filters.category === "commercial" ? "commercial" : "");

  return (
    <div className="bg-white border border-slate-200 shadow-lg rounded-3xl px-5 md:px-8 py-6 md:py-8 max-w-5xl mx-auto">
      <form onSubmit={submit} autoComplete="off">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-5 text-center tracking-tight">Property Search</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label htmlFor="ps-location" className={labelClass}>
              <MapPin className="h-4 w-4 mr-2 text-blue-600" /> Location
            </label>
            <input
              id="ps-location"
              type="text"
              list="ps-cities"
              placeholder="City, postal code or MLS® number"
              value={filters.location}
              onChange={(e) => set("location", e.target.value)}
              className={fieldClass}
            />
            <datalist id="ps-cities">
              {cities.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="ps-type" className={labelClass}>
              <Home className="h-4 w-4 mr-2 text-blue-600" /> Property Type
            </label>
            <select
              id="ps-type"
              value={typeValue}
              onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value, category: e.target.value === "commercial" ? "commercial" : "" }))}
              className={fieldClass}
            >
              <option value="">All homes</option>
              {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <span className={labelClass}><Tag className="h-4 w-4 mr-2 text-blue-600" /> Listed For</span>
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-gray-200 p-1 h-10" role="group" aria-label="Listed for">
              {([["", "Any"], ["sale", "Sale"], ["rent", "Rent"]] as const).map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={filters.saleType === value}
                  onClick={() => set("saleType", value)}
                  className={`rounded-lg text-sm font-semibold ${filters.saleType === value ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-slate-100"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-2">
            <span className={labelClass}><DollarSign className="h-4 w-4 mr-2 text-blue-600" /> Price</span>
            <div className="flex gap-2">
              <input type="number" min={0} step={1000} aria-label="Minimum price" placeholder="Min" value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)} className={fieldClass} />
              <input type="number" min={0} step={1000} aria-label="Maximum price" placeholder="Max" value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} className={fieldClass} />
            </div>
          </div>
          <div>
            <label htmlFor="ps-beds" className={labelClass}><BedDouble className="h-4 w-4 mr-2 text-blue-600" /> Bedrooms</label>
            <select id="ps-beds" value={filters.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={fieldClass}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ps-baths" className={labelClass}><Bath className="h-4 w-4 mr-2 text-blue-600" /> Bathrooms</label>
            <select id="ps-baths" value={filters.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={fieldClass}>
              <option value="">Any</option>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="ps-sqft" className={labelClass}><Ruler className="h-4 w-4 mr-2 text-blue-600" /> Min Sq Ft</label>
            <input id="ps-sqft" type="number" min={0} step={100} placeholder="Any" value={filters.minSqft} onChange={(e) => set("minSqft", e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="ps-keywords" className={labelClass}><Search className="h-4 w-4 mr-2 text-blue-600" /> Keywords</label>
            <input id="ps-keywords" type="text" placeholder="Pool, garage, basement…" value={filters.keywords} onChange={(e) => set("keywords", e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="ps-facing" className={labelClass}><Compass className="h-4 w-4 mr-2 text-blue-600" /> Facing</label>
            <select id="ps-facing" value={filters.facing} onChange={(e) => set("facing", e.target.value)} className={fieldClass}>
              <option value="">Any direction</option>
              {DIRECTIONS.map((d) => <option key={d} value={d}>{DIRECTION_LABELS[d]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ps-province" className={labelClass}><MapPin className="h-4 w-4 mr-2 text-blue-600" /> Province</label>
            <select id="ps-province" value={filters.province} onChange={(e) => set("province", e.target.value)} className={fieldClass}>
              <option value="">Ontario</option>
              {Object.entries(PROVINCE_LABELS).filter(([code]) => code !== "ON").map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-800">
            <input type="checkbox" checked={filters.vastu === "1"} onChange={(e) => set("vastu", e.target.checked ? "1" : "")} className="h-4 w-4 accent-blue-600" />
            Vastu-friendly homes only (score 7+)
          </label>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={reset}>Reset</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </div>
        {filters.province && filters.province !== "ON" && (
          <p className="mt-3 text-xs text-slate-500">Outside Ontario we search REALTOR.ca data live; Facing and Vastu filters apply to Ontario listings only.</p>
        )}
      </form>
    </div>
  );
}
