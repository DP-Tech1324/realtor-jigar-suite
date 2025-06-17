import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Commercial = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Commercial Real Estate" 
          subtitle="Spaces that drive business growth and investment success." 
          bgImage="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12">
          <div className="container mx-auto px-4 prose max-w-none text-gray-700">
            <p className="mb-4">
              We serve entrepreneurs, developers, and investors looking for prime commercial opportunities. Our team supports everything 
              from leasing to acquisitions with market intelligence and deal strategy.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Retail storefronts, office space, and industrial properties</li>
              <li>Tenant and landlord representation</li>
              <li>Income analysis and cap rate projections</li>
              <li>Site selection and zoning consultation</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Commercial;
