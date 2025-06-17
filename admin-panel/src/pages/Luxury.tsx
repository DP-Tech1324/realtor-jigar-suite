import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Luxury = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Luxury Properties" 
          subtitle="Exclusive service for high-end real estate buyers and sellers." 
          bgImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12">
          <div className="container mx-auto px-4 prose max-w-none text-gray-700">
            <p className="mb-4">
              Our luxury property service provides discretion, premium marketing, and access to exclusive listings. From lakefront estates 
              to designer penthouses, we elevate every step of your buying or selling journey.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Luxury home marketing and global exposure</li>
              <li>Confidential listing and off-market deals</li>
              <li>Private tours, events, and white-glove service</li>
              <li>Specialist negotiation and valuation expertise</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Luxury;
