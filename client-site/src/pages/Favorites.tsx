
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Grid, List, Search, Trash2 } from "lucide-react";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useAuth } from "@/components/auth/AuthContext";
import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: favorites, isLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleViewDetails = (id: string) => {
    navigate(`/property/${id}`);
  };

  const handleRemoveFavorite = (listingId: string) => {
    toggleFavorite.mutate(listingId);
  };

  // Show auth modal if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-red-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sign In to View Your Favorites
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Create an account or sign in to save properties and access your favorites list.
            </p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In / Sign Up
            </Button>
          </div>
        </section>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="signin"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-500 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Favorite Properties
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Keep track of properties you love and compare them easily
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header with Controls */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLoading ? 'Loading...' : `${favorites?.length || 0} Saved Properties`}
              </h2>
              <p className="text-gray-600">Properties you've saved for later</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {favorites.map((favorite: any) => {
                if (!favorite.listings) return null;
                
                return (
                  <div key={favorite.id} className="relative">
                    <PropertyCard
                      listing={favorite.listings}
                      onViewDetails={handleViewDetails}
                    />
                    {/* Remove from favorites button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => handleRemoveFavorite(favorite.listing_id)}
                      disabled={toggleFavorite.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Favorites Yet
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Start exploring properties and save your favorites by clicking the heart icon on any listing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/search')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  View Featured Listings
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tips Card */}
      {favorites && favorites.length > 0 && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  💡 Tips for Managing Your Favorites
                </h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Compare properties side by side to make informed decisions</li>
                  <li>• Share your favorites list with family members or your realtor</li>
                  <li>• Set up alerts to get notified about price changes</li>
                  <li>• Schedule viewings for multiple properties in the same area</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Favorites;
