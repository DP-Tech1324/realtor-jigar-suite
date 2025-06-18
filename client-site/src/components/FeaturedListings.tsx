
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Eye } from "lucide-react";
import { useFeaturedListings } from "@/hooks/useListings";
import PropertyCard from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const FeaturedListings = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: listings, isLoading, error } = useFeaturedListings();
  const navigate = useNavigate();

  const nextSlide = () => {
    if (listings) {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(listings.length / 3));
    }
  };

  const prevSlide = () => {
    if (listings) {
      setCurrentSlide((prev) => (prev - 1 + Math.ceil(listings.length / 3)) % Math.ceil(listings.length / 3));
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/property/${id}`);
  };

  if (error) {
    return (
      <section id="listings" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 13.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Listings</h3>
            <p className="text-red-700">We're experiencing technical difficulties. Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="listings" className="py-20 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-50/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-yellow-500 rounded-full mr-4"></div>
            <span className="text-blue-600 font-semibold text-lg uppercase tracking-wide">Featured Properties</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Discover Your
            <span className="block text-blue-600">Perfect Home</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore our carefully curated selection of premium properties in the Greater Toronto Area. 
            Each home has been chosen for its exceptional value, location, and potential.
          </p>
        </div>

        {/* Market stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">98%</div>
            <div className="text-slate-600">Sales Success Rate</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">500+</div>
            <div className="text-slate-600">Properties Sold</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">14</div>
            <div className="text-slate-600">Avg Days on Market</div>
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <Skeleton className="h-64 w-full rounded-3xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : listings && listings.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-fade-in">
                {listings.slice(currentSlide * 3, (currentSlide + 1) * 3).map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    listing={listing}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {listings.length > 3 && (
                <div className="flex justify-center items-center space-x-6 mb-12">
                  <Button 
                    variant="outline" 
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.ceil(listings.length / 3) }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-blue-600 w-8' 
                            : 'bg-blue-200 hover:bg-blue-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Featured Properties</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                We're currently updating our featured listings. Check back soon for new properties or browse our full inventory.
              </p>
              <Button 
                onClick={() => navigate('/search')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse All Properties
              </Button>
            </div>
          )}
        </div>

        {/*<div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Explore All Available Properties
          </h3>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Ready to find your dream home? Browse our complete collection of properties 
            with advanced search filters and detailed information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/search')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300"
            >
              View All Listings
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              Schedule Consultation
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FeaturedListings;
