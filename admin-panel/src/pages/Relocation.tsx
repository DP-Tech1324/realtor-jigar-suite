import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Relocation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px]">
        <PageHeader
          title="Relocation Services"
          subtitle="Move with confidence and settle in smoothly."
          bgImage="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12">
          <div className="container mx-auto px-4 prose max-w-none text-gray-700">
            <p className="mb-4">
              Moving to a new city can be daunting. We provide the resources and expertise to make your relocation seamless, whether you're arriving in the Greater Toronto Area or heading elsewhere.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Virtual or in-person tours of prospective communities</li>
              <li>Detailed information on schools, amenities and transport</li>
              <li>Connections to trusted local service providers</li>
              <li>Ongoing assistance as you settle into your new home</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Relocation;
