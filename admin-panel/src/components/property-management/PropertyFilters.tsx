
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface PropertyFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priceFilter: string;
  setPriceFilter: (price: string) => void;
  onClearFilters: () => void;
}

export function PropertyFilters({
  searchTerm,
  setSearchTerm,
  cityFilter,
  setCityFilter,
  statusFilter,
  setStatusFilter,
  priceFilter,
  setPriceFilter,
  onClearFilters
}: PropertyFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-realtor-navy">Search & Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            <SelectItem value="Toronto">Toronto</SelectItem>
            <SelectItem value="Woodbridge">Woodbridge</SelectItem>
            <SelectItem value="Richmond Hill">Richmond Hill</SelectItem>
            <SelectItem value="Vaughan">Vaughan</SelectItem>
            <SelectItem value="Mississauga">Mississauga</SelectItem>
            <SelectItem value="Brampton">Brampton</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Prices</SelectItem>
            <SelectItem value="0-500000">Under $500K</SelectItem>
            <SelectItem value="500000-750000">$500K - $750K</SelectItem>
            <SelectItem value="750000-1000000">$750K - $1M</SelectItem>
            <SelectItem value="1000000-1500000">$1M - $1.5M</SelectItem>
            <SelectItem value="1500000-999999999">$1.5M+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
