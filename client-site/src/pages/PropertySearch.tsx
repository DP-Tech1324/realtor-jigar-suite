import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, MapPin, SlidersHorizontal, X, TrendingUp } from "lucide-react";
import { useListings, SearchFilters } from "@/hooks/useListings";
import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const PropertySearch = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: listings, isLoading, error } = useListings(filters);

  const handleFilterChange = (field: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleViewDetails = (id: string) => {
    navigate(`/property/${id}`);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== undefined && value !== '').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Search through thousands of properties in the Greater Toronto Area with advanced filters and real-time updates
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">2,500+</div>
              <div className="text-blue-200 text-sm">Active Listings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-blue-200 text-sm">Updated Daily</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">15</div>
              <div className="text-blue-200 text-sm">GTA Areas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-blue-200 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 sticky top-0 z-40 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Search Bar */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Enter city, neighborhood, postal code, or MLS number..."
                      value={filters.city || ''}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="pl-12 h-12 text-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="h-12 px-4 md:px-6 border-slate-300 hover:bg-slate-100"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-blue-600 text-white text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                  <Button className="h-12 px-6 md:px-8 bg-blue-600 hover:bg-blue-700">
                    <Search className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6 shadow-lg animate-fade-in">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Advanced Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="md:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="propertyType" className="text-sm font-medium text-slate-700 mb-2 block">Property Type</Label>
                    <Select 
                      value={filters.propertyType || ''} 
                      onValueChange={(value) => handleFilterChange('propertyType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="single_family">Single Family Home</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="multi_family">Multi-Family</SelectItem>
                        <SelectItem value="land">Land/Lot</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="minPrice" className="text-sm font-medium text-slate-700 mb-2 block">Min Price</Label>
                    <Select 
                      value={filters.minPrice?.toString() || ''} 
                      onValueChange={(value) => handleFilterChange('minPrice', value ? Number(value) : '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No Min" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Minimum</SelectItem>
                        <SelectItem value="200000">$200,000</SelectItem>
                        <SelectItem value="400000">$400,000</SelectItem>
                        <SelectItem value="600000">$600,000</SelectItem>
                        <SelectItem value="800000">$800,000</SelectItem>
                        <SelectItem value="1000000">$1,000,000</SelectItem>
                        <SelectItem value="1500000">$1,500,000</SelectItem>
                        <SelectItem value="2000000">$2,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxPrice" className="text-sm font-medium text-slate-700 mb-2 block">Max Price</Label>
                    <Select 
                      value={filters.maxPrice?.toString() || ''} 
                      onValueChange={(value) => handleFilterChange('maxPrice', value ? Number(value) : '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No Max" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Maximum</SelectItem>
                        <SelectItem value="500000">$500,000</SelectItem>
                        <SelectItem value="750000">$750,000</SelectItem>
                        <SelectItem value="1000000">$1,000,000</SelectItem>
                        <SelectItem value="1500000">$1,500,000</SelectItem>
                        <SelectItem value="2000000">$2,000,000</SelectItem>
                        <SelectItem value="3000000">$3,000,000</SelectItem>
                        <SelectItem value="5000000">$5,000,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bedrooms" className="text-sm font-medium text-slate-700 mb-2 block">Bedrooms</Label>
                    <Select 
                      value={filters.bedrooms?.toString() || ''} 
                      onValueChange={(value) => handleFilterChange('bedrooms', value ? Number(value) : '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="1">1+ Bedroom</SelectItem>
                        <SelectItem value="2">2+ Bedrooms</SelectItem>
                        <SelectItem value="3">3+ Bedrooms</SelectItem>
                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                        <SelectItem value="5">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Button variant="outline" onClick={clearFilters} className="order-2 sm:order-1">
                    Clear All Filters
                  </Button>
                  <div className="text-sm text-slate-600 order-1 sm:order-2">
                    <span className="font-medium">{listings?.length || 0}</span> properties found
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 text-blue-600">• {activeFiltersCount} filters active</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {isLoading ? 'Searching Properties...' : `${listings?.length || 0} Properties Found`}
              </h2>
              {activeFiltersCount > 0 && !isLoading && (
                <p className="text-slate-600 mt-1">Showing filtered results for the GTA</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 mr-2 hidden sm:inline">View:</span>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3 py-2"
              >
                <Grid className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3 py-2"
              >
                <List className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">List</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className={`grid ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <Skeleton className="h-64 w-full rounded-3xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Unable to Load Properties</h3>
              <p className="text-red-600 mb-8 max-w-md mx-auto">
                We're experiencing technical difficulties. Please try again or contact us for assistance.
              </p>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
              </div>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 animate-fade-in`}>
              {listings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Properties Found</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or clearing filters to see more results. 
                Our inventory is updated daily with new listings.
              </p>
              <div className="space-x-4">
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Get Personalized Help
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Help Finding the Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let Jigar Patel help you navigate the GTA market with personalized recommendations and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg"
            >
              Schedule Consultation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/sellers/valuation')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg"
            >
              Get Home Valuation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertySearch;
