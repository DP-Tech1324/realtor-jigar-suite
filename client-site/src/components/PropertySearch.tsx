import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Home, MapPin, DollarSign } from "lucide-react";
import { SearchFilters } from "@/hooks/useListings";

interface PropertySearchProps {
  onSearch?: (filters: SearchFilters) => void;
}

const PropertySearch = ({ onSearch }: PropertySearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleInputChange = (field: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Property
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through thousands of properties in the GTA with our advanced search tools
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSearch}>
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  Location
                </label>
                <input 
                  type="text" 
                  placeholder="City, Neighborhood, Postal Code"
                  value={filters.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Home className="h-4 w-4 mr-2 text-blue-600" />
                  Property Type
                </label>
                <select 
                  value={filters.propertyType || ''}
                  onChange={(e) => handleInputChange('propertyType', e.target.value as SearchFilters['propertyType'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                  Max Price
                </label>
                <select 
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Price</option>
                  <option value="500000">Under $500K</option>
                  <option value="750000">Under $750K</option>
                  <option value="1000000">Under $1M</option>
                  <option value="1500000">Under $1.5M</option>
                  <option value="2000000">Under $2M</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                <select 
                  value={filters.bedrooms || ''}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className="flex justify-center">
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                <Search className="mr-2 h-5 w-5" />
                Search Properties
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PropertySearch;
