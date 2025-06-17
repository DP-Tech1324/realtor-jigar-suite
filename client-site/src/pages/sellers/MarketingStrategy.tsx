
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Globe, Users, TrendingUp, Star, CheckCircle } from "lucide-react";

const MarketingStrategy = () => {
  const marketingServices = [
    {
      title: "Professional Photography",
      description: "High-quality photos that showcase your home's best features and attract more buyers online.",
      icon: Camera,
      features: ["HDR photography", "Drone aerial shots", "Virtual staging", "Twilight photos"]
    },
    {
      title: "Online Marketing",
      description: "Comprehensive digital marketing strategy to reach qualified buyers across multiple platforms.",
      icon: Globe,
      features: ["MLS listing optimization", "Social media marketing", "Google Ads campaigns", "Real estate websites"]
    },
    {
      title: "Network Reach",
      description: "Leverage extensive agent network and buyer connections throughout the GTA.",
      icon: Users,
      features: ["Agent referrals", "Buyer database", "Industry connections", "VIP buyer events"]
    },
    {
      title: "Market Analysis",
      description: "Strategic pricing and timing based on current market conditions and trends.",
      icon: TrendingUp,
      features: ["Competitive pricing", "Market timing", "Trend analysis", "Buyer behavior insights"]
    }
  ];

  const marketingStats = [
    { stat: "500+", description: "Online platforms", color: "text-blue-600" },
    { stat: "95%", description: "Online buyer engagement", color: "text-green-600" },
    { stat: "3x", description: "More exposure than average", color: "text-purple-600" },
    { stat: "18", description: "Average days to sell", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Marketing Strategy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Maximize your home's exposure and attract qualified buyers with Jigar Patel's 
            proven marketing strategies and extensive reach across the GTA market.
          </p>
        </div>
      </section>

      {/* Marketing Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marketing That Gets Results
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive marketing approach ensures maximum exposure for your property
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {marketingStats.map((item, index) => (
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

      {/* Marketing Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Marketing Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every aspect of marketing your home is covered with our comprehensive approach
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {marketingServices.map((service, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 p-3 rounded-full mr-4">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Marketing Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A step-by-step approach to maximize your home's market appeal and selling potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Property Preparation", desc: "Professional photography, staging consultation, and listing optimization" },
              { step: 2, title: "Launch Strategy", desc: "Multi-platform listing launch with targeted marketing campaigns" },
              { step: 3, title: "Active Promotion", desc: "Ongoing social media, advertising, and network marketing efforts" },
              { step: 4, title: "Performance Analysis", desc: "Track metrics, adjust strategy, and optimize for maximum results" }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {phase.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-600 text-sm">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <CardTitle className="text-2xl">Client Success Story</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <blockquote className="text-lg text-gray-700 italic mb-6">
                "Jigar's marketing strategy was phenomenal. The professional photos were stunning, 
                and within 24 hours of listing, we had 3 offers. His social media marketing and 
                network reach brought in qualified buyers immediately. Sold for 8% over asking!"
              </blockquote>
              <p className="font-semibold text-gray-900">- Michael & Sarah T., Oakville</p>
              <p className="text-gray-600">Sold in 2 days | 8% over asking price</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Market Your Home?
          </h2>
          <p className="text-xl mb-8">
            Get a personalized marketing strategy that will showcase your home to thousands of qualified buyers.
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href="/contact">
              Get Your Marketing Plan
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketingStrategy;
