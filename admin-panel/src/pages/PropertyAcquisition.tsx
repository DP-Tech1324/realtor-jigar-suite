import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const PropertyAcquisition = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Property Acquisition" 
          subtitle="Secure the right property with strategy, data, and expertise." 
          bgImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12">
          <div className="container mx-auto px-4 prose max-w-none text-gray-700">
            <p className="mb-4">
              Whether you're a first-time buyer or an experienced investor, we guide you through every step of the acquisition process.
              We analyze data, uncover off-market opportunities, and help you make confident offers.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tailored property searches and buyer consultations</li>
              <li>Comparative market analysis and forecasting</li>
              <li>Offer strategy and negotiations</li>
              <li>Due diligence, inspections, and closing support</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyAcquisition;
