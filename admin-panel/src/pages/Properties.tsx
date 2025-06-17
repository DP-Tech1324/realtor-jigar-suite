
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedProperties from '@/components/FeaturedProperties';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Home, Building, Key, Calendar, Info } from 'lucide-react';
import PropertyCTA from '@/components/properties/PropertyCTA';

const Properties = () => {
  // Property page hero images
  const propertyHeroImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600573472591-61770e120a4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Exclusive Property Collection" 
          subtitle="Discover our handpicked selection of premium properties in desirable locations"
          imageSlider={propertyHeroImages}
          showCta={true}
          ctaText="View Featured Properties"
          ctaLink="#featured-properties"
        />
        
        {/* Introduction to Our Properties */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-realtor-navy mb-6">Your Dream Home Awaits</h2>
              <p className="text-gray-600 mb-8 text-lg">
                At Luxury Realty, we understand that finding the perfect property is more than just a transaction—it's about 
                finding a place where memories will be made for years to come. Our curated collection features only the finest 
                properties that meet our strict standards for quality, location, and value.
              </p>
              <p className="text-gray-600 mb-4 text-lg">
                Each property in our portfolio has been carefully selected and personally evaluated by our expert team. We pride 
                ourselves on offering exclusive properties in the most sought-after neighborhoods, ensuring our clients have access 
                to exceptional homes that match their lifestyle and investment goals.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Properties section */}
        <div id="featured-properties">
          <FeaturedProperties />
        </div>

        {/* Property Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-realtor-navy mb-6 text-center">Property Categories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
              We offer a diverse range of property types to suit every lifestyle and investment strategy. Explore our collection to find the perfect match for your needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-realtor-navy">
                    <Home className="h-5 w-5" />
                    <h3 className="text-xl font-bold">Luxury Homes</h3>
                  </div>
                  <p className="text-gray-600">
                    Exceptional single-family homes with premium amenities, spacious layouts, and high-end finishes in prestigious neighborhoods.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-realtor-navy">
                    <Building className="h-5 w-5" />
                    <h3 className="text-xl font-bold">Premium Condominiums</h3>
                  </div>
                  <p className="text-gray-600">
                    Modern urban condos with world-class amenities, stunning views, and convenient access to city attractions and business districts.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-realtor-navy">
                    <Home className="h-5 w-5" />
                    <h3 className="text-xl font-bold">Elegant Townhouses</h3>
                  </div>
                  <p className="text-gray-600">
                    Sophisticated townhomes that offer the perfect balance of space and convenience with modern designs and private outdoor areas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Buying Process Steps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-realtor-navy mb-6 text-center">The Buying Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
              Our streamlined purchasing experience makes finding and securing your dream home simple and stress-free. Here's how our process works:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-realtor-navy h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">1. Property Discovery</h3>
                <p className="text-gray-600">
                  We'll help you identify your needs and preferences, then match you with properties that meet your criteria.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-realtor-navy h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">2. Viewing & Selection</h3>
                <p className="text-gray-600">
                  Schedule private viewings of your favorite properties with our expert agents who will highlight each home's unique features.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-realtor-navy h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">3. Negotiation & Offer</h3>
                <p className="text-gray-600">
                  We'll guide you through making a competitive offer and negotiate on your behalf to secure the best possible terms.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-realtor-navy h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">4. Closing & Beyond</h3>
                <p className="text-gray-600">
                  Our team manages the closing process and provides continued support even after you receive the keys to your new home.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-realtor-navy hover:bg-realtor-navy/90">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Neighborhoods */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-realtor-navy mb-6 text-center">Featured Neighborhoods</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
              Discover the most desirable neighborhoods where we offer exceptional properties. Each area provides a unique lifestyle and investment opportunity.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1577495508326-19a1b3cf65b1?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-realtor-navy mb-2">Historic District</h3>
                  <p className="text-gray-600 mb-4">
                    Charming streets lined with beautifully preserved historic homes, boutique shopping, and acclaimed restaurants.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Toronto, ON</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-realtor-navy mb-2">Waterfront Estates</h3>
                  <p className="text-gray-600 mb-4">
                    Exclusive waterfront properties with stunning views, private docks, and resort-style amenities.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Vaughan, ON</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-realtor-navy mb-2">Urban Core</h3>
                  <p className="text-gray-600 mb-4">
                    Modern high-rise living with panoramic city views, convenient access to entertainment, dining, and cultural attractions.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Richmond Hill, ON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <PropertyCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
