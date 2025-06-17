
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import MortgageCalculator from '@/components/MortgageCalculator';
import AffordabilityCalculator from '@/components/AffordabilityCalculator';
import ClosingCostCalculator from '@/components/ClosingCostCalculator';
import { Button } from '@/components/ui/button';

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState<'mortgage' | 'affordability' | 'closing'>('mortgage');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Financial Calculators" 
          subtitle="Tools to help you make informed real estate decisions"
          bgImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3"
        />

        {/* Calculator Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <Button
                  onClick={() => setActiveCalculator('mortgage')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    activeCalculator === 'mortgage'
                      ? 'bg-realtor-navy text-white'
                      : 'bg-white text-realtor-navy hover:bg-gray-50 border border-realtor-navy'
                  }`}
                >
                  Mortgage Calculator
                </Button>
                <Button
                  onClick={() => setActiveCalculator('affordability')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeCalculator === 'affordability'
                      ? 'bg-realtor-navy text-white'
                      : 'bg-white text-realtor-navy hover:bg-gray-50 border-y border-realtor-navy'
                  }`}
                >
                  Affordability Calculator
                </Button>
                <Button
                  onClick={() => setActiveCalculator('closing')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    activeCalculator === 'closing'
                      ? 'bg-realtor-navy text-white'
                      : 'bg-white text-realtor-navy hover:bg-gray-50 border border-realtor-navy'
                  }`}
                >
                  Closing Cost Calculator
                </Button>
              </div>
            </div>

            {activeCalculator === 'mortgage' && (
              <div className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-realtor-navy mb-3">Mortgage Calculator</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Estimate your monthly mortgage payments based on home price, down payment, interest rate, and loan term.
                  </p>
                </div>
                <MortgageCalculator />
              </div>
            )}

            {activeCalculator === 'affordability' && (
              <div className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-realtor-navy mb-3">Affordability Calculator</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Find out how much home you can afford based on your income, expenses, down payment, and other financial factors.
                  </p>
                </div>
                <AffordabilityCalculator />
              </div>
            )}

            {activeCalculator === 'closing' && (
              <div className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-realtor-navy mb-3">Closing Cost Calculator</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Estimate the additional costs beyond the purchase price when buying a home in Ontario.
                  </p>
                </div>
                <ClosingCostCalculator />
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg mt-12 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-realtor-navy mb-4">Need Help Understanding Your Results?</h3>
              <p className="text-gray-600 mb-4">
                These calculators provide estimates to help with your planning. For personalized advice based on your specific financial situation, I'm here to help. I can connect you with mortgage professionals who can provide detailed guidance and pre-approval options.
              </p>
              <div className="flex items-center justify-between">
                <p className="font-medium text-realtor-navy">Contact me for personalized assistance:</p>
                <div className="space-x-3">
                  <Button className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy">
                    Schedule a Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">
                Additional Financial Resources
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Helpful information to assist in your real estate financial decisions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">First-Time Home Buyer Programs</h3>
                <p className="text-gray-600 mb-4">
                  Learn about government programs and incentives available to help first-time buyers enter the housing market.
                </p>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>First-Time Home Buyer Incentive</li>
                  <li>Home Buyers' Plan (RRSP withdrawals)</li>
                  <li>Land Transfer Tax Rebates</li>
                  <li>First-Time Home Buyer Tax Credit</li>
                </ul>
                <Button variant="outline" className="w-full border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                  Learn More
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Mortgage Types Explained</h3>
                <p className="text-gray-600 mb-4">
                  Understand the differences between fixed, variable, and other mortgage options to make an informed choice.
                </p>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Fixed vs. Variable Rates</li>
                  <li>Open vs. Closed Mortgages</li>
                  <li>Conventional vs. High-Ratio</li>
                  <li>Term vs. Amortization Period</li>
                </ul>
                <Button variant="outline" className="w-full border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                  Learn More
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-realtor-navy mb-3">Home Buying Costs Guide</h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive overview of all costs associated with purchasing a home beyond the sale price.
                </p>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li>Down Payment Requirements</li>
                  <li>Closing Costs Breakdown</li>
                  <li>Moving Expenses</li>
                  <li>Ongoing Homeownership Costs</li>
                </ul>
                <Button variant="outline" className="w-full border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-realtor-navy">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Take the Next Step?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Let's discuss your financial situation and find the perfect property within your budget.
            </p>
            <Button size="lg" className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy font-medium">
              Schedule a Consultation
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Calculators;
