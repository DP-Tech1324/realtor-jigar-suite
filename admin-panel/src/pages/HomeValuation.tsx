
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import HomeValuationForm from '@/components/HomeValuationForm';

const HomeValuation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Free Home Valuation" 
          subtitle="Discover what your property is worth in today's market"
          bgImage="https://images.unsplash.com/photo-1560185008-a8de49506789?ixlib=rb-4.0.3"
        />

        {/* Valuation Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-realtor-navy mb-6">
                  Request Your Free Home Valuation
                </h2>
                <p className="text-gray-600 mb-6">
                  Whether you're considering selling, refinancing, or just curious about your property's current market value, I'm here to provide you with a professional, data-driven valuation at no cost or obligation.
                </p>
                <p className="text-gray-600 mb-8">
                  Simply complete the form below with your property details, and I'll analyze recent comparable sales, current market trends, and your home's unique features to provide you with an accurate valuation.
                </p>
                
                <div className="bg-gray-50 p-8 rounded-lg">
                  <HomeValuationForm />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold text-realtor-navy mb-4">Why Get a Professional Valuation?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-realtor-gold mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">More accurate than automated online estimates</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-realtor-gold mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Includes local market insights not available online</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-realtor-gold mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Takes into account your property's unique features and improvements</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-realtor-gold mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Helps you make informed decisions about selling, refinancing, or renovating</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-realtor-navy p-6 rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-4">What Happens Next?</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-realtor-gold text-realtor-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                      <span>I'll review your submission within 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-realtor-gold text-realtor-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                      <span>I may contact you for additional details or to schedule a brief virtual or in-person visit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-realtor-gold text-realtor-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                      <span>You'll receive a comprehensive valuation report within 2-3 business days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-realtor-gold text-realtor-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                      <span>I'll be available to discuss the results and answer any questions you may have</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">
                What Clients Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from clients who've benefited from my valuation services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="italic text-gray-600 mb-4">
                  "Jigar's valuation of our home was spot-on. The detailed report he provided gave us confidence in our asking price, which resulted in multiple offers within a week of listing!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3"
                      alt="Client" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-realtor-navy">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Woodbridge</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="italic text-gray-600 mb-4">
                  "We were considering renovations and wanted to understand which improvements would add the most value. Jigar's detailed valuation and advice helped us prioritize our renovation budget for maximum ROI."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3"
                      alt="Client" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-realtor-navy">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Richmond Hill</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Common questions about home valuations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">How is this different from online valuations?</h3>
                <p className="text-gray-600">
                  Online automated valuations use algorithms and publicly available data, often missing important details about your property's condition, upgrades, and unique features. My professional valuation includes a comprehensive analysis of these factors along with recent comparable sales in your specific neighborhood.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">Is there any obligation if I request a valuation?</h3>
                <p className="text-gray-600">
                  Absolutely not. This service is completely free and comes with no obligations. Whether you decide to sell now, in the future, or not at all, the valuation is yours to keep and use as you see fit.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">How long does the valuation process take?</h3>
                <p className="text-gray-600">
                  After receiving your submission, I typically provide a comprehensive valuation report within 2-3 business days. For more complex properties or situations, it may take slightly longer, but I'll keep you updated throughout the process.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-realtor-navy mb-2">Will I need to have you visit my home?</h3>
                <p className="text-gray-600">
                  While an in-person visit allows for the most accurate valuation, it's not always necessary. I can provide an initial estimate based on the information you provide, photos, and my knowledge of your area. If a more precise valuation is needed, we can discuss arranging a brief visit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomeValuation;
