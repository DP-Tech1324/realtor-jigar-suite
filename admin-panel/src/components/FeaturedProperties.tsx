
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useProperties } from '@/hooks/useProperties';
import PropertyCardSkeleton from '@/components/ui/PropertyCardSkeleton';

const FeaturedProperties = () => {
  const { useFeaturedProperties } = useProperties();
  const { data: featuredProperties, isLoading, error } = useFeaturedProperties();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-realtor-light-gray">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-realtor-navy mb-3">Featured Properties</h2>
          <div className="w-24 h-1 bg-realtor-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of exceptional properties in the most desirable locations
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        )}

        {error && (
          <motion.div 
            className="text-center text-red-500 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Sorry, we couldn't load the featured properties. Please try again later.</p>
          </motion.div>
        )}

        {featuredProperties && featuredProperties.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-4">
                {featuredProperties.map((property, index) => (
                  <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full group border-0 shadow-md">
                        <div className="relative h-64 overflow-hidden">
                          <Link to={`/properties/${property.id}`}>
                            <motion.img 
                              src={property.images[0]} 
                              alt={property.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading={index < 3 ? "eager" : "lazy"}
                            />
                            {property.featured && (
                              <Badge className="absolute top-3 left-3 bg-realtor-gold text-realtor-navy font-medium shadow-lg">
                                Featured
                              </Badge>
                            )}
                          </Link>
                        </div>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <Link to={`/properties/${property.id}`}>
                              <h3 className="text-xl font-bold text-realtor-navy hover:text-realtor-gold transition-colors duration-200 line-clamp-1">{property.title}</h3>
                            </Link>
                            <p className="text-realtor-gold font-bold text-lg ml-2">{formatPrice(property.price)}</p>
                          </div>
                          <div className="flex items-center text-gray-500 mb-4">
                            <MapPin size={16} className="mr-1 text-realtor-gold" />
                            <span className="text-sm line-clamp-1">{property.address}, {property.city}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-4">
                            <div className="flex items-center text-gray-600">
                              <Bed size={18} className="mr-1 text-realtor-navy" />
                              <span className="font-medium">{property.bedrooms}</span>
                              <span className="text-sm ml-1">Beds</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Bath size={18} className="mr-1 text-realtor-navy" />
                              <span className="font-medium">{property.bathrooms}</span>
                              <span className="text-sm ml-1">Baths</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Home size={18} className="mr-1 text-realtor-navy" />
                              <span className="font-medium">{property.square_feet || 'N/A'}</span>
                              <span className="text-sm ml-1">sqft</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link to={`/properties/${property.id}`} className="w-full">
                            <Button 
                              variant="outline" 
                              className="w-full border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white transition-all duration-300 font-medium"
                            >
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-8">
                <CarouselPrevious className="relative static left-0 right-0 translate-y-0 bg-realtor-navy text-white hover:bg-realtor-gold hover:text-realtor-navy transition-all duration-300" />
                <CarouselNext className="relative static left-0 right-0 translate-y-0 bg-realtor-navy text-white hover:bg-realtor-gold hover:text-realtor-navy transition-all duration-300" />
              </div>
            </Carousel>
          </motion.div>
        )}

        {featuredProperties && featuredProperties.length === 0 && (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">No featured properties available at the moment.</p>
          </motion.div>
        )}

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/listings">
            <Button className="bg-realtor-navy hover:bg-realtor-gold hover:text-realtor-navy transition-all duration-300 text-white flex items-center gap-2 mx-auto font-medium px-8 py-3">
              View All Properties
              <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
