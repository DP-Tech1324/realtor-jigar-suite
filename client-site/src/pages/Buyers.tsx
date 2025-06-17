
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, DollarSign, FileText, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Buyers = () => {
  const buyerResources = [
    {
      title: "Financing Options",
      description: "Explore different mortgage types, down payment programs, and financing solutions available to GTA home buyers.",
      icon: DollarSign,
      link: "/buyers/financing-options",
      color: "bg-blue-500"
    },
    {
      title: "First-Time Buyers Guide",
      description: "Complete step-by-step guide specifically designed for first-time home buyers in the Greater Toronto Area.",
      icon: Home,
      link: "/buyers/first-time-guide",
      color: "bg-green-500"
    },
    {
      title: "Home Buying Process",
      description: "Understand every step of the home buying process from pre-approval to closing and beyond.",
      icon: FileText,
      link: "/buyers/home-buying-process",
      color: "bg-purple-500"
    }
  ];

  const whyChooseJigar = [
    "Extensive knowledge of GTA neighborhoods and market trends",
    "Strong network of trusted mortgage brokers and home inspectors",
    "Proven track record of successful transactions",
    "Dedicated support throughout the entire buying process",
    "Expert negotiation skills to get you the best deal",
    "Access to exclusive listings and off-market properties"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Home Buying Journey Starts Here
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Whether you're a first-time buyer or looking to upgrade, Jigar Patel provides 
                expert guidance to help you navigate the GTA real estate market with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <a href="/contact">
                    Start Your Search
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/calculators">
                    Use Our Calculators
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-600 p-4 rounded-full">
                    <Home className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Buy?</h3>
                <p className="text-gray-600 mb-6">
                  Get personalized assistance from a trusted GTA realtor with years of experience.
                </p>
                <Button asChild className="w-full">
                  <a href="/contact">
                    Contact Jigar Patel
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Essential Resources for Home Buyers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access comprehensive guides and tools designed to help you make informed decisions 
              throughout your home buying journey in the Greater Toronto Area.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {buyerResources.map((resource, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 transition-colors duration-300 group">
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
                <CardContent className="text-center">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Jigar Patel as Your Buyer's Agent?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                With years of experience in the GTA real estate market, Jigar brings expertise, 
                dedication, and a client-first approach to every transaction.
              </p>
              <ul className="space-y-4">
                {whyChooseJigar.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-6 w-6 mr-2 text-blue-600" />
                    Client Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-600 italic mb-4">
                    "Jigar made our first home buying experience smooth and stress-free. 
                    His knowledge of the Toronto market was invaluable, and he always had our best interests at heart."
                  </blockquote>
                  <p className="font-semibold">- Sarah & Mike T., First-Time Buyers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Market Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Specializing in Toronto, Mississauga, Brampton, and surrounding GTA areas. 
                    Stay ahead with current market insights and neighborhood expertise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Current Market Insights */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              GTA Market Insights
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              Stay informed with the latest market trends and opportunities in the Greater Toronto Area.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$850K</div>
              <p className="text-blue-100">Average Home Price (GTA)</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15</div>
              <p className="text-blue-100">Average Days on Market</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5.5%</div>
              <p className="text-blue-100">Current Mortgage Rates</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="secondary">
              <a href="#contact">
                Get Personalized Market Analysis
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Buyers;
