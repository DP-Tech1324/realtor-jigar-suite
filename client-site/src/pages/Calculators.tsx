import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, Home, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";

const Calculators = () => {
  const calculators = [
    {
      title: "Mortgage Calculator",
      description: "Calculate your monthly mortgage payments based on home price, down payment, and interest rate.",
      icon: Home,
      link: "/calculators/mortgage",
      color: "bg-blue-500"
    },
    {
      title: "Land Transfer Tax Calculator",
      description: "Determine the land transfer tax you'll pay when purchasing property in Ontario.",
      icon: DollarSign,
      link: "/calculators/land-transfer-tax",
      color: "bg-green-500"
    },
    {
      title: "Affordability Calculator",
      description: "Find out how much home you can afford based on your income and expenses.",
      icon: PiggyBank,
      link: "/calculators/affordability",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Calculator className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real Estate Calculators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Make informed real estate decisions with our comprehensive suite of financial calculators. 
            Get instant estimates and plan your home buying or selling journey with confidence.
          </p>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {calculators.map((calc, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 transition-colors duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`${calc.color} p-3 rounded-full`}>
                      <calc.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{calc.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild className="w-full">
                    <Link to={calc.link}>
                      Use Calculator
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use Our Calculators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Use Our Calculators?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our calculators are designed specifically for the Greater Toronto Area real estate market, 
              providing accurate estimates based on current rates and regulations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Accurate Results</h3>
              <p className="text-gray-600">Based on current GTA market conditions and rates</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">Plan your budget and avoid surprises</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">Get immediate calculations without waiting</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Plan Better</h3>
              <p className="text-gray-600">Make informed financial decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Personalized Advice?
          </h2>
          <p className="text-xl mb-8">
            While our calculators provide great estimates, every situation is unique. 
            Get personalized advice from Jigar Patel for your specific circumstances.
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href="#contact">
              Contact Jigar Patel
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculators;
