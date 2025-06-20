import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Home, MapPin, DollarSign, BedDouble, Bath } from "lucide-react";

const defaultFilters = {
  city: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  saleType: "sale", // "sale" or "rent"
  keywords: "",
};

export default function PropertySearch({ onSearch, initialValues = {} }) {
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialValues });

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "" ? "" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  };

  // For filter chips
  const activeChips = Object.entries(filters)
    .filter(([k, v]) => v && v !== "sale") // Only show non-empty filters (exclude default)
    .map(([k, v]) => ({
      key: k,
      label:
        k === "city"
          ? v
          : k === "propertyType"
          ? v.replace("_", " ")
          : k === "minPrice"
          ? `Min $${v}`
          : k === "maxPrice"
          ? `Max $${v}`
          : k === "bedrooms"
          ? `${v}+ Beds`
          : k === "bathrooms"
          ? `${v}+ Baths`
          : k === "keywords"
          ? `Keyword: ${v}`
          : v,
    }));

  const removeChip = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: defaultFilters[key] || "",
    }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-6 md:px-10 py-8 md:py-10 max-w-4xl mx-auto sticky top-4 z-20">
      <form onSubmit={handleSubmit} autoComplete="off">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center tracking-tight">
          <span className="text-blue-700">Property Search</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          {/* Location */}
          <div>
            <label className="flex items-center text-xs font-semibold text-gray-700 mb-1">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" /> Location
            </label>
            <input
              type="text"
              placeholder="City or Postal Code"
              value={filters.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Property Type */}
          <div>
            <label className="flex items-center text-xs font-semibold text-gray-700 mb-1">
              <Home className="h-4 w-4 mr-2 text-blue-600" /> Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleInputChange("propertyType", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="single_family">Single Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="multi_family">Multi Family</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          {/* Price Range */}
          <div>
            <label className="flex items-center text-xs font-semibold text-gray-700 mb-1">
              <DollarSign className="h-4 w-4 mr-2 text-blue-600" /> Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleInputChange("minPrice", e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Bedrooms */}
          <div>
            <label className="flex items-center text-xs font-semibold text-gray-700 mb-1">
              <BedDouble className="h-4 w-4 mr-2 text-blue-600" /> Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleInputChange("bedrooms", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>
        {/* Additional Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          {/* Bathrooms */}
          <div>
            <label className="flex items-center text-xs font-semibold text-gray-700 mb-1">
              <Bath className="h-4 w-4 mr-2 text-blue-600" /> Bathrooms
            </label>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleInputChange("bathrooms", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          {/* Sale Type */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1">Sale Type</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={filters.saleType === "sale" ? "default" : "outline"}
                className={filters.saleType === "sale" ? "bg-blue-600 text-white" : ""}
                onClick={() => handleInputChange("saleType", "sale")}
              >
                For Sale
              </Button>
              <Button
                type="button"
                variant={filters.saleType === "rent" ? "default" : "outline"}
                className={filters.saleType === "rent" ? "bg-blue-600 text-white" : ""}
                onClick={() => handleInputChange("saleType", "rent")}
              >
                For Rent
              </Button>
            </div>
          </div>
          {/* Keywords */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1">Keywords</label>
            <input
              type="text"
              placeholder="Pool, Garage, etc."
              value={filters.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="w-full border-blue-200"
            >
              Reset Filters
            </Button>
          </div>
        </div>
        {/* Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {activeChips.map((chip) => (
              <span key={chip.key} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center gap-1">
                {chip.label} <button onClick={() => removeChip(chip.key)} className="text-blue-500">&times;</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
            <Search className="mr-2 h-5 w-5" />
            Search Properties
          </Button>
        </div>
      </form>
    </div>
  );
}
