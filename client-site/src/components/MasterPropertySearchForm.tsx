import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RESIDENTIAL_TYPES, searchUrl, type SearchFilters } from "@/lib/search";

// --- Options (every value maps to a database filter, see lib/search.ts) ---
const searchByOptions = [
  { value: "city", label: "City" },
  { value: "postal_code", label: "Postal Code" },
  { value: "mls", label: "MLS®#" },
  { value: "address", label: "Street / Keywords" },
];
const homeTypeOptions = [
  { value: "", label: "Any Home Type" },
  ...RESIDENTIAL_TYPES,
];
// Commercial sub-types aren't separate in the MLS® feed, so they search the listing text
const commercialTypeOptions = [
  { value: "", label: "Any Commercial" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "industrial", label: "Industrial" },
  { value: "business", label: "Business" },
  { value: "land", label: "Land" },
];
const priceOptions = [
  { value: "", label: "Any Price" },
  { value: "0-500000", label: "Up to $500K" },
  { value: "500000-750000", label: "$500K-$750K" },
  { value: "750000-1000000", label: "$750K-$1M" },
  { value: "1000000-2000000", label: "$1M-$2M" },
  { value: "2000000+", label: "$2M+" },
];

const defaultFields = {
  searchBy: "city",
  search: "",
  listingType: "residential",
  price: "",
  homeType: "",
  commercialType: "",
  saleType: "sale",
  beds: "",
  baths: "",
  sqft: "",
  keywords: "",
};

export default function MasterPropertySearchForm() {
  const navigate = useNavigate();
  const [fields, setFields] = useState(defaultFields);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setFields((prev) => ({
      ...prev,
      saleType: prev.saleType === "sale" ? "rent" : "sale",
    }));
  };

  // "Residential" vs "Commercial" dropdown
  const handleListingType = (e) => {
    setFields((prev) => ({
      ...prev,
      listingType: e.target.value,
      // Reset type-specific fields
      homeType: "",
      commercialType: "",
      beds: "",
      baths: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters: Partial<SearchFilters> = { saleType: fields.saleType as SearchFilters["saleType"] };
    const keywords = [fields.keywords];

    // Main search box
    const text = fields.search.trim();
    if (text) {
      if (fields.searchBy === "address") keywords.push(text);
      else filters.location = text;
    }

    if (fields.listingType === "commercial") {
      filters.category = "commercial";
      if (fields.commercialType === "land") filters.propertyType = "land";
      else {
        filters.propertyType = "commercial";
        if (fields.commercialType) keywords.push(fields.commercialType);
      }
    } else {
      filters.category = "residential";
      if (fields.homeType) filters.propertyType = fields.homeType;
      if (fields.beds) filters.bedrooms = fields.beds;
      if (fields.baths) filters.bathrooms = fields.baths;
    }

    if (fields.price) {
      const [min, max] = fields.price.replace("+", "-").split("-");
      if (min && min !== "0") filters.minPrice = min;
      if (max) filters.maxPrice = max;
    }
    if (fields.sqft) filters.minSqft = fields.sqft.replace(/\D/g, "");
    filters.keywords = keywords.filter(Boolean).join(" ");

    navigate(searchUrl(filters));
  };

  // --- UI Section ---
  const isResidential = fields.listingType === "residential";
  const fieldClass =
    "h-14 w-full px-4 py-2 rounded-2xl border border-white/20 bg-white/60 backdrop-blur-sm text-base text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white/80 transition-all";
  const selectClass = fieldClass + " font-medium";

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-6 md:px-10 py-10 md:py-12 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} autoComplete="off">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center tracking-tight drop-shadow-lg">
          Find Your <span className="text-blue-700">Dream Home</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            name="searchBy"
            value={fields.searchBy}
            onChange={handleChange}
            className={selectClass}
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
            placeholder={{ city: "e.g. Brampton", postal_code: "e.g. L6Y 1A1", mls: "e.g. W1234567", address: "e.g. Main St, pool, walkout" }[fields.searchBy]}
            aria-label="Search"
            className={fieldClass}
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select name="listingType" value={fields.listingType} onChange={handleListingType} className={selectClass}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          <select name="price" value={fields.price} onChange={handleChange} className={selectClass}>
            {priceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {isResidential ? (
            <select name="homeType" value={fields.homeType} onChange={handleChange} className={selectClass}>
              {homeTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <select name="commercialType" value={fields.commercialType} onChange={handleChange} className={selectClass}>
              {commercialTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          {isResidential && (
            <>
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
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            inputMode="numeric"
            name="sqft"
            value={fields.sqft}
            onChange={handleChange}
            placeholder="Min Sq Ft"
            aria-label="Minimum square feet"
            className={fieldClass}
          />
          <input
            type="text"
            name="keywords"
            value={fields.keywords}
            onChange={handleChange}
            placeholder="Keywords: Pool, Parking, etc."
            aria-label="Keywords"
            className={fieldClass}
          />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="h-14 px-8 bg-gradient-to-tr from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-2xl flex items-center justify-center text-lg shadow-xl hover:scale-[1.03] transition-all duration-200"
          >
            <Search className="mr-2 h-6 w-6" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
