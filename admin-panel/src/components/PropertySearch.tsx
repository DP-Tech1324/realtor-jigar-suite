
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertySearchProps {
  className?: string;
  variant?: 'default' | 'hero';
}

const PropertySearch: React.FC<PropertySearchProps> = ({ className = '', variant = 'default' }) => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType) params.append('type', propertyType);
    if (priceRange) params.append('price', priceRange);
    
    // Navigate to properties page with search params
    navigate(`/listings?${params.toString()}`);
  };

  const isHero = variant === 'hero';

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5">
          <Input 
            placeholder="Enter location, city, or postal code" 
            className={`w-full ${isHero ? 'border-2 border-gray-200 focus:border-realtor-gold h-11' : ''}`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className={`${isHero ? 'h-11 border-2 border-gray-200 focus:border-realtor-gold' : ''}`}>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className={`${isHero ? 'h-11 border-2 border-gray-200 focus:border-realtor-gold' : ''}`}>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any">All Prices</SelectItem>
                <SelectItem value="0-500000">Under $500k</SelectItem>
                <SelectItem value="500000-1000000">$500k - $1M</SelectItem>
                <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                <SelectItem value="2000000+">$2M+</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Button 
            type="submit" 
            variant="realtor-gold" 
            className={`w-full ${isHero ? 'h-11' : ''} shadow-md`}
          >
            <Search size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearch;
