
import React from 'react';
import { Button } from '@/components/ui/button';

const PropertyCTA: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-realtor-navy to-realtor-navy-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Property?</h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Our professional real estate agents are ready to help you every step of the way.
          Schedule a viewing today and take the first step toward your new home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="realtor-gold"
            className="shadow-realtor-lg text-base px-8 py-6 h-auto font-semibold"
          >
            Book a Viewing
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 shadow-md text-base px-8 py-6 h-auto font-semibold"
          >
            Contact an Agent
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PropertyCTA;
