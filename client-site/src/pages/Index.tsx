
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import DualCTA from "@/components/DualCTA";
import BioSection from "@/components/BioSection";
import Testimonials from "@/components/Testimonials";
import PropertySearch from "@/components/PropertySearch";
import NewsletterSignup from "@/components/NewsletterSignup";
import InquiryForm from "@/components/InquiryForm";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Calculator, Users, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/search');
  };

  const stats = [
    { icon: TrendingUp, value: "500+", label: "Properties Sold" },
    { icon: Users, value: "400+", label: "Happy Families" },
    { icon: Calculator, value: "15+", label: "Years Experience" },
    { icon: Star, value: "5.0", label: "Client Rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Quick Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Search Component */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Find Your Perfect Home
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Search through thousands of properties in the Greater Toronto Area with our advanced search tools.
            </p>
          </div>
          <PropertySearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Featured Listings */}
      <FeaturedListings />

      {/* Dual CTA Section */}
      <DualCTA />

      {/* About/Bio Section */}
      <BioSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Service Areas Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Serving the Greater Toronto Area
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              With deep local knowledge and expertise across all GTA communities, 
              we're here to help you find the perfect property in your preferred neighborhood.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Toronto", properties: "150+ Properties", description: "Downtown condos, family homes, luxury estates" },
              { name: "Mississauga", properties: "80+ Properties", description: "Modern developments, family-friendly communities" },
              { name: "Brampton", properties: "70+ Properties", description: "Growing suburbs, new constructions" },
              { name: "Markham", properties: "90+ Properties", description: "Established neighborhoods, top schools" },
              { name: "Richmond Hill", properties: "60+ Properties", description: "Premium locations, luxury homes" },
              { name: "Vaughan", properties: "75+ Properties", description: "Modern communities, great amenities" },
            ].map((area, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{area.name}</h3>
                <div className="text-blue-600 font-semibold mb-3">{area.properties}</div>
                <p className="text-slate-600 mb-6">{area.description}</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/search?city=${area.name}`)}
                  className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                >
                  View Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Contact Jigar Patel today for a free consultation and let's discuss your real estate goals.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
            <InquiryForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
