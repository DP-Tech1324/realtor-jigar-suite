
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Heart, AlertCircle } from 'lucide-react';
import { Property } from '@/types/Property';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProperties } from '@/hooks/useProperties';

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { useAllProperties } = useProperties();
  const { data: allProperties, isLoading: propertiesLoading } = useAllProperties();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: favorites, error } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (favorites && allProperties) {
          const favoriteIds = favorites.map(fav => fav.listing_id);
          const favoriteProps = allProperties.filter(property => 
            favoriteIds.includes(property.id)
          );
          setFavoriteProperties(favoriteProps);
        }
      } catch (error: any) {
        console.error('Error fetching favorites:', error);
        toast({
          title: "Error",
          description: "Failed to load your favorite properties. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!propertiesLoading) {
      fetchFavorites();
    }
  }, [user, propertiesLoading, allProperties, toast]);

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', propertyId);

      if (error) {
        throw error;
      }

      setFavoriteProperties(prev => prev.filter(property => property.id !== propertyId));
      toast({
        title: "Removed from favorites",
        description: "The property has been removed from your favorites",
      });
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove this property from your favorites",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="My Favorites" 
          subtitle="View and manage your saved properties"
          bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
        />
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {!user ? (
              <div className="text-center bg-white p-8 rounded-lg shadow max-w-2xl mx-auto">
                <AlertCircle className="h-12 w-12 text-realtor-gold mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-realtor-navy mb-4">Sign in required</h2>
                <p className="text-gray-600 mb-6">
                  Please sign in to view and manage your favorite properties.
                </p>
                <Link to="/auth">
                  <Button className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-realtor-gold"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-realtor-navy">Your Favorite Properties</h2>
                      <p className="text-gray-600">
                        {favoriteProperties.length > 0 
                          ? `You have ${favoriteProperties.length} saved ${favoriteProperties.length === 1 ? 'property' : 'properties'}.`
                          : 'You have no saved properties yet.'}
                      </p>
                    </div>

                    {favoriteProperties.length === 0 ? (
                      <div className="text-center bg-white p-8 rounded-lg shadow">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-realtor-navy mb-2">No Favorites Yet</h3>
                        <p className="text-gray-600 mb-6">
                          Save properties you're interested in by clicking the heart icon on any property card or detail page.
                        </p>
                        <Link to="/listings">
                          <Button className="bg-realtor-navy hover:bg-realtor-navy/90">
                            Browse Properties
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoriteProperties.map((property) => (
                          <div key={property.id} className="relative">
                            <PropertyCard property={property} />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="absolute top-4 right-4 bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                              onClick={() => removeFavorite(property.id)}
                            >
                              <Heart className="h-4 w-4 fill-current" />
                              <span className="ml-1">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Discover More Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-realtor-navy mb-4">Discover More Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore our latest listings to find your perfect home or investment opportunity.
            </p>
            <Link to="/listings">
              <Button size="lg" className="bg-realtor-navy hover:bg-realtor-navy/90">
                View All Properties
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
