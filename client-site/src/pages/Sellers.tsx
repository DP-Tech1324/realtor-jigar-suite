import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, TrendingUp, Camera, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Sellers = () => {
  const sellerResources = [
    {
      title: "Home Valuation",
      description: "Get an accurate market analysis to understand your home's current value and optimal pricing strategy.",
      icon: DollarSign,
      link: "/sellers/valuation",
      color: "bg-green-500"
    },
    {
      title: "Marketing Strategy",
      description: "Comprehensive marketing plan to showcase your property and attract qualified buyers quickly.",
      icon: TrendingUp,
      link: "/sellers/marketing-strategy",
      color: "bg-blue-500"
    },
    {
      title: "Home Staging Tips",
      description: "Professional staging advice to help your home make the best first impression on potential buyers.",
      icon: Camera,
      link: "/sellers/staging-tips",
      color: "bg-purple-500"
    }
  ];

  const sellingAdvantages = [
    "Professional photography and virtual tours",
    "Comprehensive MLS listing with maximum exposure",
    "Strategic pricing based on current market analysis",
    "Expert negotiation to secure the best price",
    "Extensive network of qualified buyers and agents",
    "Full-service support from listing to closing"
  ];

  const marketStats = [
    {
      stat: "96%",
      description: "Of listings sell within 30 days",
      color: "text-green-600"
    },
    {
      stat: "$875K",
      description: "Average sale price (GTA)",
      color: "text-blue-600"
    },
    {
      stat: "18",
      description: "Average days on market",
      color: "text-purple-600"
    },
    {
      stat: "102%",
      description: "Average sale-to-list ratio",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Sell Your Home for Maximum Value
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get top dollar for your property with Jigar Patel's proven marketing strategies, 
                expert pricing, and comprehensive selling approach in the GTA market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <a href="/contact">
                    Get Free Home Valuation
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/sellers/valuation">
                    Learn About Valuation
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-600 p-4 rounded-full">
                    <Home className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Sell?</h3>
                <p className="text-gray-600 mb-6">
                  Get a personalized marketing plan and competitive market analysis for your property.
                </p>
                <Button asChild className="w-full">
                  <a href="/contact">
                    Contact Jigar Patel Today
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current GTA Market Performance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take advantage of strong market conditions to maximize your home's selling potential.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {marketStats.map((item, index) => (
              <div key={index} className="text-center">
                <div className={`text-5xl font-bold mb-2 ${item.color}`}>
                  {item.stat}
                </div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Selling Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access expert tools and guidance to prepare your home for sale and maximize your return.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sellerResources.map((resource, index) => (
              <Card key={index} className="border-2 hover:border-green-300 transition-colors duration-300 group h-full">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`${resource.color} p-3 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                      <resource.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center mt-auto">
                  <Button asChild className="w-full group">
                    <Link to={resource.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Jigar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Jigar Patel Selling Advantage
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                With proven marketing strategies and deep market knowledge, Jigar delivers results 
                that exceed expectations for home sellers throughout the GTA.
              </p>
              <ul className="space-y-4">
                {sellingAdvantages.map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                    Proven Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average Sale Price vs. Asking:</span>
                      <span className="font-bold text-green-600">102%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Days on Market:</span>
                      <span className="font-bold text-green-600">18 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client Satisfaction Rate:</span>
                      <span className="font-bold text-green-600">98%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Client Testimonial</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-600 italic mb-4">
                    "Jigar's marketing strategy was incredible. Our home sold in just 8 days for 5% over asking price. 
                    His attention to detail and market knowledge made all the difference."
                  </blockquote>
                  <p className="font-semibold">- Jennifer & David K., Mississauga</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Selling Process Made Simple
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From initial consultation to closing day, we handle every detail to ensure a smooth, successful sale.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: 1, title: "Initial Consultation", desc: "Discuss goals and market analysis" },
              { step: 2, title: "Prepare Home", desc: "Staging and photography recommendations" },
              { step: 3, title: "List & Market", desc: "Professional photography and MLS listing" },
              { step: 4, title: "Show & Negotiate", desc: "Handle showings and negotiate offers" },
              { step: 5, title: "Close Sale", desc: "Manage closing process and paperwork" }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {phase.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-600 text-sm">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Sell Your Home?
          </h2>
          <p className="text-xl mb-8">
            Get started with a free, no-obligation home valuation and personalized selling strategy from Jigar Patel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">
                Get Free Home Valuation
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              <Link to="/sellers/valuation">
                Learn About Home Valuation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sellers;
