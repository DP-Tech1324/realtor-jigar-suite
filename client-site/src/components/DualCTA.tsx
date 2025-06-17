
import { Button } from "@/components/ui/button";
import { Search, Calculator, ArrowRight, Home, TrendingUp, Star, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DualCTA = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleValuationClick = () => {
    navigate('/sellers/valuation');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Your Real Estate Journey
            <span className="block text-blue-600">Starts Here</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're buying your first home or selling your property, 
            we provide the tools and expertise to make your real estate goals a reality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Dream Home Search */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Find Your Dream Home
              </h3>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Browse through thousands of properties in the GTA with our advanced search tools. 
                Get exclusive access to new listings and detailed market insights.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-700 justify-center">
                  <Home className="h-5 w-5 mr-4 text-blue-600" />
                  <span>Exclusive new listing alerts</span>
                </div>
                <div className="flex items-center text-slate-700 justify-center">
                  <TrendingUp className="h-5 w-5 mr-4 text-blue-600" />
                  <span>Market insights & analytics</span>
                </div>
                <div className="flex items-center text-slate-700 justify-center">
                  <Star className="h-5 w-5 mr-4 text-blue-600" />
                  <span>Personalized recommendations</span>
                </div>
                <div className="flex items-center text-slate-700 justify-center">
                  <Shield className="h-5 w-5 mr-4 text-blue-600" />
                  <span>Verified property information</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={handleSearchClick}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Search
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Home Worth Calculator */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                What's Your Home Worth?
              </h3>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Get an instant, accurate estimate of your property's market value with our 
                comprehensive analysis using the latest data and comparable sales.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-700 justify-center">
                  <TrendingUp className="h-5 w-5 mr-4 text-yellow-600" />
                  <span>AI-powered market analysis</span>
                </div>
                <div className="flex items-center text-slate-700 justify-center">
                  <Home className="h-5 w-5 mr-4 text-yellow-600" />
                  <span>Detailed property comparisons</span>
                </div>
                <div className="flex items-center text-slate-700 justify-center">
                  <Star className="h-5 w-5 mr-4 text-yellow-600" />
                  <span>Professional consultation included</span>
                </div>
                <div className="flex items-center text-slate-700 justify-center">
                  <Shield className="h-5 w-5 mr-4 text-yellow-600" />
                  <span>No obligation, 100% free</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={handleValuationClick}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Free Valuation
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with Jigar Patel and discover how we can help you achieve your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg rounded-xl"
            >
              Schedule Consultation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg rounded-xl"
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualCTA;
