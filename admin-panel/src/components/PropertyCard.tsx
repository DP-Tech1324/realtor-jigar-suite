
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, ArrowRight, MapPin, Home, Calendar, MessageSquare, Heart, Share2, Eye } from 'lucide-react';
import { Property } from '@/types/Property';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import ConsultationForm from '@/components/ConsultationForm';
import { useToast } from '@/hooks/use-toast';

interface PropertyCardProps {
  property: Property;
  showViewDetails?: boolean;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(price);
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, showViewDetails = true }) => {
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleBookTourClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenBookingDialog(true);
  };

  const handleContactAgentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenContactDialog(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Property removed from your favorites list" : "Property saved to your favorites list",
    });
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.share?.({
      title: property.title,
      text: `Check out this property: ${property.title}`,
      url: window.location.origin + `/properties/${property.id}`
    }).catch(() => {
      navigator.clipboard.writeText(window.location.origin + `/properties/${property.id}`);
      toast({
        title: "Link copied!",
        description: "Property link copied to clipboard",
      });
    });
  };

  const handleFormSubmitSuccess = (type: 'booking' | 'contact') => {
    if (type === 'booking') {
      setOpenBookingDialog(false);
      toast({
        title: "Tour scheduled successfully",
        description: `We've received your request for a tour of ${property.title}. Our agent will contact you shortly.`,
      });
    } else {
      setOpenContactDialog(false);
      toast({
        title: "Message sent successfully",
        description: `Thank you for your interest in ${property.title}. Our agent will contact you shortly.`,
      });
    }
  };

  // Use market_status for display, fallback to status if market_status not available
  const displayStatus = property.market_status || (property.status === 'published' ? 'for-sale' : 'draft');

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 group border-0 shadow-md">
          <div className="relative h-60 overflow-hidden">
            <Link to={`/properties/${property.id}`}>
              <motion.img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
              />
              
              {/* Overlay with quick actions */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-realtor-navy"
                        onClick={handleFavoriteClick}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-realtor-navy"
                        onClick={handleShareClick}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-realtor-navy"
                        asChild
                      >
                        <Link to={`/properties/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute top-3 left-3">
                <Badge 
                  className={`font-medium ${
                    displayStatus === 'for-sale' ? 'bg-green-600' :
                    displayStatus === 'for-rent' ? 'bg-blue-600' :
                    displayStatus === 'sold' ? 'bg-gray-600' : 'bg-orange-600'
                  } text-white`}
                >
                  {displayStatus === 'for-sale' ? 'For Sale' : 
                  displayStatus === 'for-rent' ? 'For Rent' : 
                  displayStatus === 'sold' ? 'Sold' : 'Pending'}
                </Badge>
              </div>

              {property.featured && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-realtor-gold text-realtor-navy font-medium">
                    Featured
                  </Badge>
                </div>
              )}
            </Link>
          </div>

          <CardContent className="p-5">
            <div className="mb-3">
              <Link to={`/properties/${property.id}`}>
                <h3 className="font-bold text-xl text-realtor-navy truncate hover:text-realtor-gold transition-colors duration-200">{property.title}</h3>
              </Link>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1 text-realtor-gold" />
                <p className="text-sm truncate">
                  {property.address}, {property.city}, {property.province}
                </p>
              </div>
              <p className="text-realtor-gold font-bold text-2xl">
                {formatPrice(property.price)}
              </p>
            </div>

            <div className="flex justify-between text-gray-600 my-4 border-y border-gray-100 py-3">
              <div className="flex items-center gap-1">
                <Bed size={16} className="text-realtor-navy" />
                <span className="text-sm font-medium">{property.bedrooms}</span>
                <span className="text-xs text-gray-500">Beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath size={16} className="text-realtor-navy" />
                <span className="text-sm font-medium">{property.bathrooms}</span>
                <span className="text-xs text-gray-500">Baths</span>
              </div>
              <div className="flex items-center gap-1">
                <Home size={16} className="text-realtor-navy" />
                <span className="text-sm font-medium">{property.square_feet || 'N/A'}</span>
                <span className="text-xs text-gray-500">sq ft</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button 
                size="sm"
                className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy flex items-center justify-center font-medium transition-all duration-200"
                onClick={handleBookTourClick}
              >
                <Calendar className="mr-1" size={14} />
                Book Tour
              </Button>
              <Button 
                size="sm"
                variant="outline" 
                className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white flex items-center justify-center font-medium transition-all duration-200"
                onClick={handleContactAgentClick}
              >
                <MessageSquare className="mr-1" size={14} />
                Contact
              </Button>
            </div>

            {showViewDetails && (
              <div className="mt-3">
                <Link to={`/properties/${property.id}`}>
                  <Button className="w-full bg-realtor-navy hover:bg-realtor-navy/90 flex items-center justify-center gap-2 font-medium transition-all duration-200">
                    View Details 
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Book a Tour Dialog */}
      <Dialog open={openBookingDialog} onOpenChange={setOpenBookingDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-realtor-navy">Book a Tour</DialogTitle>
            <DialogDescription>
              Complete the form below to schedule a tour of {property.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ConsultationForm 
              defaultType="buyer" 
              propertyId={property.id}
              onSubmitSuccess={() => handleFormSubmitSuccess('booking')}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Agent Dialog */}
      <Dialog open={openContactDialog} onOpenChange={setOpenContactDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-realtor-navy">Request Property Information</DialogTitle>
            <DialogDescription>
              Have questions about {property.title}? I'll get back to you promptly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ConsultationForm 
              defaultType="buyer" 
              propertyId={property.id}
              onSubmitSuccess={() => handleFormSubmitSuccess('contact')}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
