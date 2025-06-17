
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const RlpSearch = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Property Search" 
          subtitle="Search Royal LePage listings across Canada"
          bgImage="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3"
        />
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-4xl mx-auto">
              <p className="text-gray-700 mb-6">
                Access the complete Royal LePage property database below to search for homes across Canada. 
                As your real estate professional, I can assist you with any property you find interesting.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Royal LePage iframe */}
              <div className="aspect-video w-full min-h-[800px]">
                <iframe 
                  src="https://www.royallepage.ca/en/agent/ontario/woodbridge/jigar-patel/79073/"
                  title="Royal LePage Property Search"
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            
            {/* CREA Disclaimer */}
            <div className="mt-6 text-sm text-gray-500 max-w-4xl mx-auto">
              <p>
                The trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate professionals who are members of CREA. The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by CREA and identify the quality of services provided by real estate professionals who are members of CREA.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RlpSearch;
