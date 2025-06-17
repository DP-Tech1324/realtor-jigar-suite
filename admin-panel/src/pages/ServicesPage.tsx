import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ServicesLinkWrapper from '@/components/ServicesLinkWrapper';

const ServicesPage = () => {
  const servicesHeroImages = [
    "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Our Comprehensive Services" 
          subtitle="Tailored real estate solutions to meet your specific needs and exceed your expectations"
          imageSlider={servicesHeroImages}
        />
        <Services />
        <ServicesLinkWrapper />

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">Specialized Real Estate Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Additional services tailored to meet specific real estate needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Property Sales */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Property Sales</h3>
                <p className="text-gray-600 mb-4">
                  Sell properties with confidence using our marketing expertise and strategic pricing.
                </p>
                <Link to="/property-sales">
                  <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Property Acquisition */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Property Acquisition</h3>
                <p className="text-gray-600 mb-4">
                  Strategic support to help you acquire the right property at the right time.
                </p>
                <Link to="/property-acquisition">
                  <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Relocation */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Relocation Services</h3>
                <p className="text-gray-600 mb-4">
                  Personalized relocation support for individuals and families moving into or out of town.
                </p>
                <Link to="/relocation">
                  <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Investment */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Investment Properties</h3>
                <p className="text-gray-600 mb-4">
                  Guidance and analysis for investors seeking profitable real estate opportunities.
                </p>
                <Link to="/investment">
                  <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Luxury */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Luxury Properties</h3>
                <p className="text-gray-600 mb-4">
                  Exclusive high-end services for luxury property buyers and sellers.
                </p>
                <Link to="/luxury">
                  <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Commercial */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Commercial Real Estate</h3>
                <p className="text-gray-600 mb-4">
                  End-to-end solutions for retail, office, and industrial property needs.
                </p>
                <Link to="/commercial">
                  <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
