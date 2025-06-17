
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, LineChart, Camera, Users, DollarSign, FileText, HomeIcon } from 'lucide-react';

const Sellers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Sellers Resources" 
          subtitle="Maximize your property's value and sell with confidence"
          bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
        />
        
        {/* Introduction Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-realtor-navy mb-6">Selling Your Home with Confidence</h2>
              <p className="text-gray-700 mb-6">
                Selling your home is a significant financial and emotional decision. My goal is to make the 
                process as smooth and profitable as possible, leveraging my expertise, Royal LePage resources, 
                and proven marketing strategies to achieve the best possible outcome for you.
              </p>
              <p className="text-gray-700 mb-6">
                From pricing your property correctly to staging, marketing, negotiating offers, and closing the deal, 
                I'll be your trusted advisor every step of the way, ensuring your property stands out in today's competitive market.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/contact">
                  <Button size="lg" className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy">
                    Request a Free Home Evaluation
                  </Button>
                </Link>
                <Link to="/home-valuation">
                  <Button size="lg" variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy/10">
                    Online Valuation Tool
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Marketing Strategy Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">My Marketing Strategy</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A comprehensive approach to showcase your property to qualified buyers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-realtor-gold/20 rounded-full flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-realtor-gold" />
                  </div>
                  <CardTitle>Strategic Pricing</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Using comprehensive market analysis and my knowledge of local trends, I'll help you price your property 
                    strategically to attract serious buyers while maximizing your return.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-realtor-gold/20 rounded-full flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-realtor-gold" />
                  </div>
                  <CardTitle>Professional Presentation</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    I arrange professional photography, virtual tours, floor plans, and staging advice to ensure 
                    your property makes an outstanding first impression online and in person.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-realtor-gold/20 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-realtor-gold" />
                  </div>
                  <CardTitle>Maximum Exposure</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Your property will be showcased on multiple platforms including MLS®, Royal LePage's national website, 
                    social media, and my network of qualified buyers and colleagues.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Selling Process Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-3">The Selling Process</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your step-by-step guide to selling your home successfully
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
                    <HomeIcon className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Property Evaluation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    I'll conduct a thorough evaluation of your property, analyzing recent comparable sales, 
                    current market conditions, and your property's unique features to determine the optimal listing price.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">What to expect:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>In-depth property assessment</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Comparative market analysis</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Review of current market trends</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Strategic pricing recommendations</span>
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
                    <Camera className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Preparation & Staging
                  </h3>
                  <p className="text-gray-600 mb-4">
                    First impressions matter. I'll provide guidance on how to prepare your home for sale, 
                    including staging recommendations, minor repairs, and enhancements to highlight your property's best features.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">Services include:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Professional photography and videography</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Virtual tour creation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Staging consultation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Pre-listing home inspection (optional)</span>
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
                    <Users className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Marketing & Exposure
                  </h3>
                  <p className="text-gray-600 mb-4">
                    I'll implement a comprehensive marketing plan to ensure your property receives maximum exposure 
                    to potential buyers, both locally and internationally, through Royal LePage's extensive network.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">Marketing channels:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>MLS® listing with enhanced features</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Royal LePage website and network</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Social media campaigns</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Email marketing to potential buyers</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Open houses (as appropriate)</span>
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
                    Offer Negotiation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    When offers come in, I'll provide expert negotiation to secure the best terms and price. 
                    I'll carefully review each offer, explain the pros and cons, and advise you on the best course of action.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">Negotiation strategy:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Detailed review of all offers</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Strategic counter-offers when appropriate</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Negotiation of favorable terms and conditions</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Clear communication throughout the process</span>
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
                    <FileText className="mr-3 h-6 w-6 text-realtor-gold md:hidden" />
                    Closing & Beyond
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Once an offer is accepted, I'll guide you through the closing process, ensuring all 
                    conditions are met, paperwork is properly handled, and the transaction proceeds smoothly to completion.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-realtor-navy mb-2">Closing support:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Coordination with lawyers and mortgage brokers</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Assistance with condition fulfillment</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Final walkthrough coordination</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Continuous support until keys are handed over</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Home Staging Tips Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-realtor-navy mb-4">Home Staging Tips</h2>
                  <p className="text-gray-700 mb-4">
                    Effective staging can significantly impact how quickly your home sells and the price it commands. 
                    These simple staging tips can help showcase your property's full potential:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-semibold">Declutter and depersonalize</span> - Remove excess items and personal photos to help buyers envision themselves in the space</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-semibold">Enhance curb appeal</span> - First impressions matter, so ensure your property's exterior is well-maintained</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-semibold">Maximize light</span> - Open curtains, clean windows, and use higher-wattage bulbs to create a bright, welcoming environment</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-realtor-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-semibold">Make minor repairs</span> - Fix leaky faucets, replace burnt-out light bulbs, and touch up paint where needed</span>
                    </li>
                  </ul>
                  <Link to="/resources/home-staging-tips">
                    <Button className="flex items-center gap-2 bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy">
                      Read Full Staging Guide <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
                <div className="order-first md:order-last">
                  <img 
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3" 
                    alt="Home Staging" 
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Free Valuation CTA Section */}
        <section className="py-16 bg-realtor-navy">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">What's Your Home Worth?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Get a free, no-obligation home valuation to discover your property's current market value.
            </p>
            <Link to="/home-valuation">
              <Button size="lg" className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy font-medium">
                Request Free Home Valuation
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sellers;
