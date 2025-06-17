import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section className="py-16 bg-white">

        <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow service-card">
            <h3 className="text-xl font-bold text-realtor-navy mb-3">Property Sales</h3>
            <p className="text-gray-600 mb-4">
              Specialized strategies to maximize your property's value and exposure in the market.
            </p>
            <Button className="bg-realtor-navy hover:bg-realtor-navy/90 text-white flex items-center gap-2">
              Learn More
              <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow service-card">
            <h3 className="text-xl font-bold text-realtor-navy mb-3">Property Acquisition</h3>
            <p className="text-gray-600 mb-4">
              Personalized home buying guidance from search to closing and beyond.
            </p>
            <Button className="bg-realtor-navy hover:bg-realtor-navy/90 text-white flex items-center gap-2">
              Learn More
              <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow service-card">
            <h3 className="text-xl font-bold text-realtor-navy mb-3">Relocation Services</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive support for clients moving to or from the Greater Toronto Area.
            </p>
            <Button className="bg-realtor-navy hover:bg-realtor-navy/90 text-white flex items-center gap-2">
              Learn More
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white flex items-center gap-2">
            View All Services
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
