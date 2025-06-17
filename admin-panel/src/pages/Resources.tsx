
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, HomeIcon, DollarSign, Briefcase, Calculator, PiggyBank } from 'lucide-react';

const Resources = () => {
  const articles = [
    {
      id: 1,
      title: "First-Time Buyer's Guide",
      description: "Everything you need to know about buying your first home, from mortgage pre-approval to closing day.",
      category: "Buying",
      icon: HomeIcon,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
      slug: "first-time-buyers-guide"
    },
    {
      id: 2,
      title: "Home Selling Checklist",
      description: "A comprehensive guide to prepare your home for sale and maximize its value in today's market.",
      category: "Selling",
      icon: DollarSign,
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3",
      slug: "home-selling-checklist"
    },
    {
      id: 3,
      title: "Understanding Closing Costs",
      description: "A detailed breakdown of the closing costs associated with buying or selling a home in the GTA.",
      category: "Finance",
      icon: Briefcase,
      image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3",
      slug: "understanding-closing-costs"
    },
    {
      id: 4,
      title: "Mortgage 101",
      description: "Learn about different mortgage types, terms, and strategies to secure the best rate for your home purchase.",
      category: "Finance",
      icon: Calculator,
      image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3",
      slug: "mortgage-101"
    },
    {
      id: 5,
      title: "Investment Property Guide",
      description: "Tips and strategies for finding, evaluating, and managing residential investment properties.",
      category: "Investing",
      icon: PiggyBank,
      image: "https://images.unsplash.com/photo-1560519320-75a8d940fe05?ixlib=rb-4.0.3",
      slug: "investment-property-guide"
    },
    {
      id: 6,
      title: "Home Staging Tips",
      description: "Professional advice on staging your home to attract buyers and fetch top dollar in today's market.",
      category: "Selling",
      icon: HomeIcon,
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3",
      slug: "home-staging-tips"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        <PageHeader 
          title="Real Estate Resources" 
          subtitle="Guides and articles to help you navigate the real estate market"
          bgImage="https://images.unsplash.com/photo-1554232456-c4c477ddcca4?ixlib=rb-4.0.3"
        />
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-realtor-navy mb-4">Knowledge is Power</h2>
              <p className="text-gray-600">
                Browse through our collection of resources designed to help you make informed decisions about buying, selling, or investing in real estate.
              </p>
            </div>
            
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-realtor-gold/20 text-realtor-navy text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <article.icon className="h-5 w-5 text-realtor-gold" />
                    </div>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant="link" 
                      className="text-realtor-navy hover:text-realtor-gold p-0 h-auto font-medium flex items-center"
                      asChild
                    >
                      <Link to={`/resources/${article.slug}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Newsletter Sign-up */}
            <div className="mt-16 max-w-3xl mx-auto bg-realtor-navy rounded-lg shadow-lg p-8 text-center">
              <BookOpen className="h-12 w-12 text-realtor-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Stay Informed</h3>
              <p className="text-white/80 mb-6">
                Subscribe to my newsletter for market updates, new listings, and exclusive real estate tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-realtor-gold/60 sm:min-w-[300px]"
                />
                <Button className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Quick Links Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-realtor-navy mb-8">Quick Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-realtor-navy mb-4">For Buyers</h3>
                <ul className="space-y-2">
                  <li><Link to="/buyers" className="text-realtor-gold hover:text-realtor-navy">First-Time Home Buyer Guide</Link></li>
                  <li><Link to="/calculators" className="text-realtor-gold hover:text-realtor-navy">Mortgage Calculator</Link></li>
                  <li><Link to="/resources/understanding-closing-costs" className="text-realtor-gold hover:text-realtor-navy">Understanding Closing Costs</Link></li>
                  <li><Link to="/resources/mortgage-101" className="text-realtor-gold hover:text-realtor-navy">Mortgage 101</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-realtor-navy mb-4">For Sellers</h3>
                <ul className="space-y-2">
                  <li><Link to="/sellers" className="text-realtor-gold hover:text-realtor-navy">Home Selling Guide</Link></li>
                  <li><Link to="/home-valuation" className="text-realtor-gold hover:text-realtor-navy">Free Home Valuation</Link></li>
                  <li><Link to="/resources/home-staging-tips" className="text-realtor-gold hover:text-realtor-navy">Home Staging Tips</Link></li>
                  <li><Link to="/resources/home-selling-checklist" className="text-realtor-gold hover:text-realtor-navy">Home Selling Checklist</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-realtor-navy mb-4">For Investors</h3>
                <ul className="space-y-2">
                  <li><Link to="/resources/investment-property-guide" className="text-realtor-gold hover:text-realtor-navy">Investment Property Guide</Link></li>
                  <li><Link to="/calculators" className="text-realtor-gold hover:text-realtor-navy">ROI Calculator</Link></li>
                  <li><Link to="/listings" className="text-realtor-gold hover:text-realtor-navy">Investment Opportunities</Link></li>
                  <li><Link to="/contact" className="text-realtor-gold hover:text-realtor-navy">Investment Consultation</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
