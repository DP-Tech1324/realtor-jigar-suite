
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px] flex items-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-9xl font-bold text-realtor-gold mb-4">404</h1>
          <h2 className="text-4xl font-bold text-realtor-navy mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-realtor-navy hover:bg-realtor-navy/90">
                Back to Home
              </Button>
            </Link>
            <Link to="/listings">
              <Button size="lg" variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                Browse Properties
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
