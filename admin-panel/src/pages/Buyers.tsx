import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Home, FileText, Search, DollarSign, Key, ThumbsUp } from 'lucide-react';

const Buyers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Buyers Resources" 
          subtitle="Everything you need to know about buying a home in the GTA"
          bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
        />
        
        {/* Introduction Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-realtor-navy mb-6">Your Homebuying Journey Starts Here</h2>
              <p className="text-gray-700 mb-6">
                Buying a home is one of the most significant investments you'll make in your lifetime. 
                Whether you're a first-time buyer or looking for your next property, I'm here to guide you through 
                every step of the process, ensuring a smooth and successful transaction.
              </p>
              <p className="text-gray-700 mb-6">
                As your dedicated real estate professional, I'll help you navigate the complexities of the market, 
                find the perfect property that meets your needs and budget, and negotiate the best possible terms.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/contact">
                  <Button size="lg" className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy">
                    Schedule a Consultation
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button size="lg" variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy/10">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Homebuying Process Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">The Homebuying Process</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your step-by-step guide to purchasing a home in today's market
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="relative mb-12 pl-8 md:pl-0">
                <div className="hidden md:flex items-center justify-center absolute left-0 top-0 -ml-8 mt-1">
                  <div className="bg-realtor-gold rounded-full h-16 w-16 flex items-center justify-center text-realtor-navy font-bold text-xl">
                    1
                  </div>
                </div>
                <div className="md:ml-16">
                  <h3 className="text-2xl font-bold text-realtor-navy mb-3 flex items-center">
                    <Home className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Get Pre-Approved
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Before you start your home search, it's essential to understand how much you can afford. 
                    Getting pre-approved for a mortgage gives you a clear budget and shows sellers that you're a serious buyer.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">What you'll need:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Proof of income (T4 slips, pay stubs, notice of assessment)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Proof of assets (bank statements, investments)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Information about your debts and obligations</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Personal identification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative mb-12 pl-8 md:pl-0">
                <div className="hidden md:flex items-center justify-center absolute left-0 top-0 -ml-8 mt-1">
                  <div className="bg-realtor-gold rounded-full h-16 w-16 flex items-center justify-center text-realtor-navy font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="md:ml-16">
                  <h3 className="text-2xl font-bold text-realtor-navy mb-3 flex items-center">
                    <Search className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Property Search
                  </h3>
                  <p className="text-gray-600 mb-4">
                    With a clear budget in mind, we'll search for properties that match your criteria. 
                    I'll help you identify neighborhoods that align with your lifestyle and preferences, 
                    and schedule viewings of properties that interest you.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">My approach:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Understand your must-haves vs. nice-to-haves</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Preview properties to save you time</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Provide neighborhood insights and property history</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Access to exclusive and off-market listings</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative mb-12 pl-8 md:pl-0">
                <div className="hidden md:flex items-center justify-center absolute left-0 top-0 -ml-8 mt-1">
                  <div className="bg-realtor-gold rounded-full h-16 w-16 flex items-center justify-center text-realtor-navy font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="md:ml-16">
                  <h3 className="text-2xl font-bold text-realtor-navy mb-3 flex items-center">
                    <FileText className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Make an Offer
                  </h3>
                  <p className="text-gray-600 mb-4">
                    When you find the right property, I'll help you prepare a competitive offer. 
                    I'll analyze comparable sales data and market conditions to determine the right price 
                    and terms that protect your interests while maximizing your chances of success.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">The offer includes:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Purchase price and deposit amount</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Conditions (financing, home inspection, etc.)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Closing date and occupancy terms</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Inclusions and exclusions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative mb-12 pl-8 md:pl-0">
                <div className="hidden md:flex items-center justify-center absolute left-0 top-0 -ml-8 mt-1">
                  <div className="bg-realtor-gold rounded-full h-16 w-16 flex items-center justify-center text-realtor-navy font-bold text-xl">
                    4
                  </div>
                </div>
                <div className="md:ml-16">
                  <h3 className="text-2xl font-bold text-realtor-navy mb-3 flex items-center">
                    <DollarSign className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Due Diligence & Financing
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Once your offer is accepted, we'll work through the due diligence process, including home inspection, 
                    finalizing your mortgage, and reviewing all legal documents. I'll coordinate with all parties 
                    to ensure everything progresses smoothly.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">Key considerations:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Professional home inspection</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Final mortgage approval</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Title search and insurance</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Review of condo documents (if applicable)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 5 */}
              <div className="relative pl-8 md:pl-0">
                <div className="hidden md:flex items-center justify-center absolute left-0 top-0 -ml-8 mt-1">
                  <div className="bg-realtor-gold rounded-full h-16 w-16 flex items-center justify-center text-realtor-navy font-bold text-xl">
                    5
                  </div>
                </div>
                <div className="md:ml-16">
                  <h3 className="text-2xl font-bold text-realtor-navy mb-3 flex items-center">
                    <Key className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Closing & Moving In
                  </h3>
                  <p className="text-gray-600 mb-4">
                    On closing day, ownership of the property is officially transferred to you. I'll be there to ensure 
                    everything goes smoothly, from the final walkthrough to getting the keys to your new home.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">Final steps:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Final walkthrough of the property</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Meeting with your lawyer to sign closing documents</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Transfer of funds</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Receiving the keys to your new home</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* First-Time Buyer Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-realtor-navy mb-4">First-Time Buyer?</h2>
                  <p className="text-gray-700 mb-4">
                    Buying your first home can be both exciting and overwhelming. As your dedicated real estate professional, 
                    I specialize in guiding first-time buyers through every step of the process.
                  </p>
                  <p className="text-gray-700 mb-6">
                    From explaining the intricacies of the market to helping you access first-time buyer programs and incentives, 
                    I'll ensure you feel confident and informed throughout your journey to homeownership.
                  </p>
                  <Link to="/resources/first-time-buyers-guide">
                    <Button className="flex items-center gap-2 bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy">
                      Read First-Time Buyer's Guide <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
                <div className="order-first md:order-last">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3" 
                    alt="First-Time Home Buyers" 
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Additional Services Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">Additional Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Complementary resources to help you through your homebuying journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-realtor-gold/20 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-realtor-gold" />
                  </div>
                  <CardTitle>Mortgage Calculator</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    Calculate your monthly mortgage payments based on different interest rates, down payments, and amortization periods.
                  </p>
                  <Link to="/calculators">
                    <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy/10">
                      Use Calculator
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-realtor-gold/20 rounded-full flex items-center justify-center mb-4">
                    <ThumbsUp className="h-6 w-6 text-realtor-gold" />
                  </div>
                  <CardTitle>Get Pre-Approved</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    Connect with trusted mortgage specialists who can help you get pre-approved and understand your buying power.
                  </p>
                  <Link to="/contact">
                    <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy/10">
                      Request Referral
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-realtor-gold/20 rounded-full flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-realtor-gold" />
                  </div>
                  <CardTitle>Neighborhood Guides</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    Explore detailed guides to popular neighborhoods in the Greater Toronto Area to find your perfect location.
                  </p>
                  <Button variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy/10">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-realtor-navy">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Let's discuss your real estate goals and start your homebuying journey today.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy font-medium">
                Schedule a Free Consultation
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Buyers;
