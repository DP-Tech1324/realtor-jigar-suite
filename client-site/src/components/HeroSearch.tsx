import { Search, DollarSign, Home, Users, MapPin } from "lucide-react";
import { useState } from "react";

export default function HeroSearch() {
  // Form states
  const [filters, setFilters] = useState({
    query: "",
    price: "",
    homeType: "",
    beds: "",
    baths: "",
    sqft: "",
    keywords: ""
  });

  const handleChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="relative flex items-center justify-center h-[340px] bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')" // Replace with your hero image
      }}
    >
      <div className="bg-white/95 shadow-2xl rounded-xl p-8 max-w-3xl w-full border border-slate-200">
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl text-slate-800 tracking-tight">FIND YOUR PERFECT PROPERTY</h1>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {/* Top Row */}
          <div className="col-span-1">
            <select name="query" className="w-full border rounded px-3 py-2" value={filters.query} onChange={handleChange}>
              <option>Search by</option>
              <option>City</option>
              <option>Address</option>
              <option>Postal Code</option>
              <option>MLS#</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <input
              name="keywords"
              className="w-full border rounded px-3 py-2"
              placeholder="City, Address, Postal Code, MLS#"
              value={filters.keywords}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded flex justify-center items-center"
            >
              <Search className="mr-2" /> Search
            </button>
          </div>
          {/* 2nd Row */}
          <div>
            <select name="homeType" className="w-full border rounded px-3 py-2" value={filters.homeType} onChange={handleChange}>
              <option>Home Type</option>
              <option>Detached</option>
              <option>Semi-Detached</option>
              <option>Townhouse</option>
              <option>Condo</option>
            </select>
          </div>
          <div>
            <select name="price" className="w-full border rounded px-3 py-2" value={filters.price} onChange={handleChange}>
              <option>Price Range</option>
              <option>Up to $500K</option>
              <option>$500K - $1M</option>
              <option>$1M - $1.5M</option>
              <option>$1.5M+</option>
            </select>
          </div>
          <div>
            <select name="beds" className="w-full border rounded px-3 py-2" value={filters.beds} onChange={handleChange}>
              <option>Beds</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
            </select>
          </div>
          <div>
            <select name="baths" className="w-full border rounded px-3 py-2" value={filters.baths} onChange={handleChange}>
              <option>Baths</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
            </select>
          </div>
          <div>
            <input
              name="sqft"
              className="w-full border rounded px-3 py-2"
              placeholder="Square Feet"
              value={filters.sqft}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              name="keywords"
              className="w-full border rounded px-3 py-2"
              placeholder="Keywords: Pool, Parking, A/C…"
              value={filters.keywords}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
