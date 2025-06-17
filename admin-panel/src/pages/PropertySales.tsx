import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const PropertySales = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Property Sales" 
          subtitle="Maximize your home’s value with expert guidance and powerful marketing." 
          bgImage="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12">
          <div className="container mx-auto px-4 prose max-w-none text-gray-700">
            <p className="mb-4">
              We specialize in helping homeowners and investors sell properties with confidence. 
              Our sales strategy is built on market data, custom marketing, and professional presentation.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Strategic pricing analysis and staging support</li>
              <li>Professional photos, videos, and virtual tours</li>
              <li>MLS, social media, and targeted email marketing</li>
              <li>Negotiation expertise and contract management</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertySales;
