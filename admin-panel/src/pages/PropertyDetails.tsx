
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bed, Bath, Home, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConsultationForm from '@/components/ConsultationForm';
import { useToast } from '@/hooks/use-toast';
import { useProperties } from '@/hooks/useProperties';
import { properties as localProperties } from '@/data/properties';
import { Property } from '@/types/Property';

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [localProperty, setLocalProperty] = useState<Property | null>(null);
  
  const { usePropertyById } = useProperties();
  const { data: property, isLoading, error } = usePropertyById(propertyId || '');
  
  // Fallback to local properties if Supabase fetch fails
  useEffect(() => {
    if (error && propertyId) {
      const foundProperty = localProperties.find(p => p.id === propertyId);
      if (foundProperty) {
        setLocalProperty(foundProperty);
      }
    }
  }, [error, propertyId]);

  // Use either the fetched property or the local fallback
  const displayProperty = property || localProperty;

  const handleBookTourClick = () => {
    setOpenBookingDialog(true);
  };

  const handleContactAgentClick = () => {
    setOpenContactDialog(true);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-[72px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-realtor-gold"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error state - show property not found only if we don't have a local fallback
  if ((error && !localProperty) || (!property && !localProperty)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-realtor-navy mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Link to="/listings">
              <Button className="bg-realtor-navy hover:bg-realtor-navy/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Properties
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If we don't have a property to display (either from API or local), don't render the rest
  if (!displayProperty) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        {/* Property Header Section */}
        <section className="bg-white py-8 border-b">
          <div className="container mx-auto px-4">
            <Link to="/listings" className="flex items-center text-realtor-navy hover:text-realtor-gold mb-4">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Properties
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-realtor-navy mb-2">{displayProperty.title}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{displayProperty.address}, {displayProperty.city}, {displayProperty.province}</span>
                </div>
              </div>
              <div className="text-realtor-gold font-bold text-xl md:text-2xl mt-2 md:mt-0">
                {formatPrice(displayProperty.price)}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
                  <img 
                    src={displayProperty.images[0]} 
                    alt={displayProperty.title} 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {displayProperty.images.slice(1, 5).map((image, index) => (
                  <AspectRatio key={index} ratio={4/3} className="overflow-hidden rounded-md">
                    <img 
                      src={image} 
                      alt={`${displayProperty.title} - Image ${index + 2}`} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Property Details Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-xl font-bold text-realtor-navy mb-4">Property Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-md">
                      <Bed className="text-realtor-navy mb-2" size={24} />
                      <span className="text-gray-600 text-sm">Bedrooms</span>
                      <span className="font-bold text-realtor-navy">{displayProperty.bedrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-md">
                      <Bath className="text-realtor-navy mb-2" size={24} />
                      <span className="text-gray-600 text-sm">Bathrooms</span>
                      <span className="font-bold text-realtor-navy">{displayProperty.bathrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-md">
                      <Home className="text-realtor-navy mb-2" size={24} />
                      <span className="text-gray-600 text-sm">Area</span>
                      <span className="font-bold text-realtor-navy">{displayProperty.square_feet} sq ft</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-md">
                      <MapPin className="text-realtor-navy mb-2" size={24} />
                      <span className="text-gray-600 text-sm">Type</span>
                      <span className="font-bold text-realtor-navy capitalize">{displayProperty.property_type}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-realtor-navy mb-3">Description</h3>
                  <p className="text-gray-600 mb-6">{displayProperty.description}</p>
                  
                  <h3 className="text-lg font-semibold text-realtor-navy mb-3">Location</h3>
                  <p className="text-gray-600">{displayProperty.address}, {displayProperty.city}, {displayProperty.province}</p>
                </div>
              </div>
              
              {/* Sidebar */}
              <div>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-lg font-semibold text-realtor-navy mb-4">Interested in this property?</h3>
                  <Button 
                    className="w-full bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy mb-3 flex items-center justify-center"
                    onClick={handleBookTourClick}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Tour
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white"
                    onClick={handleContactAgentClick}
                  >
                    Request More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Book a Tour Dialog */}
      <Dialog open={openBookingDialog} onOpenChange={setOpenBookingDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-realtor-navy">Book a Tour</DialogTitle>
            <DialogDescription>
              Complete the form below to schedule a tour of {displayProperty.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ConsultationForm 
              defaultType="buyer" 
              propertyId={displayProperty.id}
              onSubmitSuccess={() => setOpenBookingDialog(false)}
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
              Have questions about {displayProperty.title}? I'll get back to you promptly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ConsultationForm 
              defaultType="buyer" 
              propertyId={displayProperty.id}
              onSubmitSuccess={() => setOpenContactDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetails;
