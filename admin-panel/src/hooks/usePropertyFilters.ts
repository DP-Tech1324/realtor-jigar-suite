
import { useState, useEffect } from 'react';
import { Property } from '@/types/Property';

interface UsePropertyFiltersProps {
  properties: Property[];
  initialLocationFilter?: string;
  initialPriceFilter?: string;
  initialTypeFilter?: string;
}

export const usePropertyFilters = ({
  properties,
  initialLocationFilter = '',
  initialPriceFilter = '',
  initialTypeFilter = ''
}: UsePropertyFiltersProps) => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>(initialPriceFilter);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>(initialTypeFilter);
  // default to showing all market statuses
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('price-asc');
  const [locationFilter, setLocationFilter] = useState<string>(initialLocationFilter);

  // Reset all filters
  const resetFilters = () => {
    setPriceRangeFilter('');
    setPropertyTypeFilter('');
    setStatusFilter('');
    setSortOrder('price-asc');
    setLocationFilter('');
  };

  // Apply filters when filter states change
  useEffect(() => {
    // Apply filters
    let results = [...properties];
    
    // Filter by location (case insensitive search)
    if (locationFilter) {
      const searchTerm = locationFilter.toLowerCase();
      results = results.filter(p => 
        p.address.toLowerCase().includes(searchTerm) || 
        p.city.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by price range
    if (priceRangeFilter && priceRangeFilter !== 'any') {
      if (priceRangeFilter === '0-500000') {
        results = results.filter(p => p.price < 500000);
      } else if (priceRangeFilter === '500000-1000000') {
        results = results.filter(p => p.price >= 500000 && p.price <= 1000000);
      } else if (priceRangeFilter === '1000000-2000000') {
        results = results.filter(p => p.price >= 1000000 && p.price <= 2000000);
      } else if (priceRangeFilter === '2000000+') {
        results = results.filter(p => p.price > 2000000);
      }
    }

    // Filter by property type
    if (propertyTypeFilter && propertyTypeFilter !== 'any') {
      // property objects use `property_type` as the key
      // filter correctly by that field
      results = results.filter(p => p.property_type === propertyTypeFilter);
    }

    // Filter by market status
    if (statusFilter) {
      results = results.filter(p => p.market_status === statusFilter);
    }

    // Sort results
    if (sortOrder === 'price-asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      // In a real app, you'd sort by date added
      // For demo purposes, we'll just use the existing order
    }

    setFilteredProperties(results);
  }, [priceRangeFilter, propertyTypeFilter, statusFilter, sortOrder, locationFilter, properties]);

  return {
    filteredProperties,
    locationFilter,
    setLocationFilter,
    priceRangeFilter,
    setPriceRangeFilter,
    propertyTypeFilter,
    setPropertyTypeFilter,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    resetFilters
  };
};
