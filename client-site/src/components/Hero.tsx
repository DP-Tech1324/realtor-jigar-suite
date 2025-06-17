
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Calculator, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleValuationClick = () => {
    navigate('/sellers/valuation');
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-slate-900/40"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        {/* Geometric overlay */}
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 left-0 w-full h-32 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,100 C600,20 1200,100 1200,100 L1200,120 L0,120 Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Jigar Patel
                </span>
                <span className="block text-yellow-400 text-4xl md:text-5xl lg:text-6xl mt-2">
                  Real Estate Excellence
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 font-medium">
                Your Trusted GTA Realtor & Investment Partner
              </p>
              <p className="text-lg text-blue-200 max-w-2xl leading-relaxed">
                Discover exceptional properties and expert guidance in the Greater Toronto Area. 
                With proven expertise and personalized service, we turn your real estate dreams into reality.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={handleSearchClick}
                className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Search className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                Find Your Dream Home
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleValuationClick}
                className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Calculator className="mr-3 h-6 w-6" />
                Get Home Value
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm text-blue-200">Homes Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">15+</div>
                <div className="text-sm text-blue-200">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">5.0</div>
                <div className="text-sm text-blue-200">Client Rating</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Quick Property Search</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-blue-100">Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter city, neighborhood, or postal code"
                    className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/30 transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-blue-100">Min Price</label>
                    <select className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300">
                      <option value="">Any</option>
                      <option value="500000">$500K</option>
                      <option value="750000">$750K</option>
                      <option value="1000000">$1M</option>
                      <option value="1500000">$1.5M</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-blue-100">Max Price</label>
                    <select className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300">
                      <option value="">Any</option>
                      <option value="1000000">$1M</option>
                      <option value="1500000">$1.5M</option>
                      <option value="2000000">$2M</option>
                      <option value="3000000">$3M+</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-blue-100">Bedrooms</label>
                    <select className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300">
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-blue-100">Property Type</label>
                    <select className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300">
                      <option value="">All Types</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                </div>
                <Button 
                  onClick={handleSearchClick}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="mr-3 h-5 w-5" />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
