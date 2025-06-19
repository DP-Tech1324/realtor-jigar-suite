import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

// --- Options ---
const searchByOptions = [
  { value: "city", label: "City" },
  { value: "address", label: "Address" },
  { value: "postal_code", label: "Postal Code" },
  { value: "mls", label: "MLS#" },
];

const homeTypeOptions = [
  { value: "", label: "Home Type" },
  { value: "detached", label: "Detached" },
  { value: "semi", label: "Semi-Detached" },
  { value: "townhouse", label: "Townhouse" },
  { value: "condo", label: "Condo" },
];

const priceOptions = [
  { value: "", label: "Price Range" },
  { value: "0-500000", label: "Up to $500K" },
  { value: "500000-750000", label: "$500K-$750K" },
  { value: "750000-1000000", label: "$750K-$1M" },
  { value: "1000000-2000000", label: "$1M-$2M" },
  { value: "2000000+", label: "$2M+" },
];

const propertyTypeOptions = [
  { value: "", label: "Property Type" },
  { value: "freehold", label: "Freehold" },
  { value: "condo", label: "Condo" },
  { value: "other", label: "Other" },
];

const showOnlyOptions = [
  { value: "", label: "Show Only" },
  { value: "openhouse", label: "Open House" },
  { value: "newlistings", label: "New Listings" },
  { value: "price_reduced", label: "Price Reduced" },
];

// --- Main Component ---
export default function MasterPropertySearchForm({ onSearch }: { onSearch?: (fields: any) => void }) {
  const [fields, setFields] = useState({
    searchBy: "city",
    search: "",
    listingType: "residential",
    price: "",
    homeType: "",
    saleType: "sale",
    beds: "",
    baths: "",
    propertyType: "",
    sqft: "",
    daysOnMarket: "",
    showOnly: "",
    keywords: "",
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setFields(f => ({
      ...f,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value
    }));
  };

  const handleToggle = () => {
    setFields(f => ({
      ...f,
      saleType: f.saleType === "sale" ? "rent" : "sale"
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Build query params from fields
    const params = new URLSearchParams();

    if (fields.search && fields.searchBy) {
      if (fields.searchBy === "city") params.append("city", fields.search);
      if (fields.searchBy === "address") params.append("address", fields.search);
      if (fields.searchBy === "postal_code") params.append("postal_code", fields.search);
      if (fields.searchBy === "mls") params.append("mls", fields.search);
    }
    if (fields.listingType) params.append("type", fields.listingType);
    if (fields.price) params.append("price", fields.price);
    if (fields.homeType) params.append("homeType", fields.homeType);
    if (fields.saleType) params.append("saleType", fields.saleType);
    if (fields.beds) params.append("beds", fields.beds);
    if (fields.baths) params.append("baths", fields.baths);
    if (fields.propertyType) params.append("propertyType", fields.propertyType);
    if (fields.sqft) params.append("sqft", fields.sqft);
    if (fields.daysOnMarket) params.append("daysOnMarket", fields.daysOnMarket);
    if (fields.showOnly) params.append("showOnly", fields.showOnly);
    if (fields.keywords) params.append("keywords", fields.keywords);

    try {
      const res = await fetch(
        `https://realtor-jigar-suite-bdod.vercel.app/api/ddf-listings?${params.toString()}`
      );
      const data = await res.json();
      setResults(data || []);
    } catch (error) {
      alert("Error fetching listings.");
      setResults([]);
    }
    setLoading(false);

    if (onSearch) onSearch(fields);
  };

  // Glassmorphic field style
  const fieldClass =
    "h-14 w-full px-4 py-2 rounded-2xl border border-white/20 bg-white/60 backdrop-blur-sm text-base text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white/80 transition-all";
  const selectClass = fieldClass + " font-medium";

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-6 md:px-10 py-10 md:py-12 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} autoComplete="off">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center tracking-tight drop-shadow-lg">
          Find Your <span className="text-blue-700">Dream Home</span>
        </h2>

        {/* Main search row */}
        <div className="flex flex-col md:flex-row gap-3 mb-7">
          <select
            name="searchBy"
            value={fields.searchBy}
            onChange={handleChange}
            className={selectClass + " md:max-w-[170px]"}
            aria-label="Search By"
          >
            {searchByOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            name="search"
            value={fields.search}
            onChange={handleChange}
            placeholder="Type City, Address, Postal Code, MLS#"
            className={fieldClass + " flex-1"}
            autoComplete="off"
          />
          <Button
            type="submit"
            className="h-14 px-8 bg-gradient-to-tr from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-2xl flex items-center justify-center text-lg shadow-xl hover:scale-[1.03] transition-all duration-200"
          >
            <Search className="mr-2 h-6 w-6" />
            Search
          </Button>
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select name="listingType" value={fields.listingType} onChange={handleChange} className={selectClass}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          <select name="price" value={fields.price} onChange={handleChange} className={selectClass}>
            {priceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select name="homeType" value={fields.homeType} onChange={handleChange} className={selectClass}>
            {homeTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Sale/Rent Toggle */}
          <div className="flex items-center gap-4 col-span-1 min-h-[56px]">
            <span className={`font-semibold ${fields.saleType === "sale" ? "text-blue-700" : "text-gray-700"}`}>For Sale</span>
            <button
              type="button"
              onClick={handleToggle}
              className={`relative w-14 h-8 flex items-center bg-white/40 border border-white/30 rounded-full p-1 transition-all duration-300 ${fields.saleType === "rent" ? "bg-blue-600/80" : "bg-white/40"}`}
              aria-label="Toggle Sale/Rent"
              tabIndex={0}
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${fields.saleType === "rent" ? "translate-x-6" : ""}`}
              ></span>
            </button>
            <span className={`font-semibold ${fields.saleType === "rent" ? "text-blue-700" : "text-gray-700"}`}>For Rent</span>
          </div>
          <select name="beds" value={fields.beds} onChange={handleChange} className={selectClass}>
            <option value="">Beds</option>
            <option value="1">1+ Bed</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
          </select>
          <select name="baths" value={fields.baths} onChange={handleChange} className={selectClass}>
            <option value="">Baths</option>
            <option value="1">1+ Bath</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
            <option value="4">4+ Baths</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select name="propertyType" value={fields.propertyType} onChange={handleChange} className={selectClass}>
            {propertyTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="text"
            name="sqft"
            value={fields.sqft}
            onChange={handleChange}
            placeholder="Min Sqft"
            className={fieldClass}
          />
          <input
            type="text"
            name="daysOnMarket"
            value={fields.daysOnMarket}
            onChange={handleChange}
            placeholder="Days On Market"
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="showOnly" value={fields.showOnly} onChange={handleChange} className={selectClass}>
            {showOnlyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="text"
            name="keywords"
            value={fields.keywords}
            onChange={handleChange}
            placeholder="Keywords: Pool, Parking, etc."
            className={fieldClass}
          />
          <div className="hidden md:block" />
        </div>
      </form>

      {/* Results Section */}
      <div className="mt-10">
        {loading && <div>Loading listings...</div>}
        {!loading && results.length === 0 && <div>No listings found.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map(listing => (
            <div key={listing.ListingKey} className="border rounded-lg shadow p-4 bg-white">
              {listing.Media && listing.Media[0]?.MediaURL && (
                <img src={listing.Media[0].MediaURL} alt="Property" className="w-full h-48 object-cover rounded mb-2" />
              )}
              <div className="font-bold text-lg">{listing.PropertySubType || "Property"}</div>
              <div className="text-sm text-gray-600">{listing.City}</div>
              <div className="text-xs text-gray-500 mb-2">{listing.PublicRemarks?.slice(0, 80)}...</div>
              {listing.ListingURL && (
                <a
                  className="text-blue-700 underline text-xs"
                  href={`https://${listing.ListingURL.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on REALTOR.ca
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <a href="https://www.realtor.ca/en" target="_blank" rel="noopener noreferrer">
            <img width="125" src="https://www.realtor.ca/images/en-ca/powered_by_realtor.svg" alt="Powered by REALTOR.ca" />
          </a>
        </div>
      </div>
    </div>
  );
}
