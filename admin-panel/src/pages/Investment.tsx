import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Investment = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Investment Properties" 
          subtitle="Build long-term wealth through strategic real estate investments." 
          bgImage="https://images.unsplash.com/photo-1599427309740-990b894a3762?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12">
          <div className="container mx-auto px-4 prose max-w-none text-gray-700">
            <p className="mb-4">
              Whether you're interested in flipping, renting, or long-term holding, we help you identify profitable opportunities and 
              structure your deals for strong returns and lower risk.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Multi-family and single-family investment strategies</li>
              <li>Pre-construction and resale analysis</li>
              <li>Rental income forecasting and ROI models</li>
              <li>Local market trend insights and portfolio planning</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Investment;
