import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, CheckCircle, DollarSign, FileText, Key, Users } from "lucide-react";

const FirstTimeGuide = () => {
  const steps = [
    {
      step: 1,
      title: "Assess Your Financial Situation",
      description: "Review your credit score, save for down payment, and determine your budget",
      icon: DollarSign,
      details: [
        "Check your credit score (aim for 650+)",
        "Save for down payment (minimum 5%)",
        "Calculate monthly housing costs",
        "Review and pay down existing debts",
        "Establish stable employment history"
      ]
    },
    {
      step: 2,
      title: "Get Pre-Approved for a Mortgage",
      description: "Secure financing and understand your purchasing power",
      icon: FileText,
      details: [
        "Gather required documents",
        "Shop around for best rates",
        "Get pre-approval letter",
        "Understand mortgage terms",
        "Know your monthly payment limits"
      ]
    },
    {
      step: 3,
      title: "Find a Real Estate Agent",
      description: "Partner with an experienced agent who understands your needs",
      icon: Users,
      details: [
        "Research agents in your area",
        "Check reviews and references",
        "Interview potential agents",
        "Understand the buyer's agreement",
        "Choose someone you trust"
      ]
    },
    {
      step: 4,
      title: "Start House Hunting",
      description: "Search for properties that meet your criteria and budget",
      icon: Home,
      details: [
        "Create a wish list vs. need list",
        "Attend open houses",
        "Schedule private viewings",
        "Research neighborhoods",
        "Consider future resale value"
      ]
    },
    {
      step: 5,
      title: "Make an Offer",
      description: "Submit a competitive offer with appropriate conditions",
      icon: FileText,
      details: [
        "Research comparable sales",
        "Include necessary conditions",
        "Consider closing timeline",
        "Be prepared for negotiations",
        "Have backup options ready"
      ]
    },
    {
      step: 6,
      title: "Complete the Purchase",
      description: "Finalize financing, conduct inspections, and close the deal",
      icon: Key,
      details: [
        "Complete home inspection",
        "Finalize mortgage approval",
        "Review all legal documents",
        "Arrange home insurance",
        "Prepare for closing day"
      ]
    }
  ];

  const firstTimeBuyerBenefits = [
    {
      title: "Land Transfer Tax Rebate",
      description: "Up to $4,000 rebate in Ontario, plus additional $4,475 in Toronto",
      amount: "Up to $8,475"
    },
    {
      title: "Home Buyers' Plan",
      description: "Withdraw up to $35,000 from RRSP for down payment",
      amount: "$35,000 per person"
    },
    {
      title: "First-Time Home Buyer Incentive",
      description: "Government shared equity loan for qualifying buyers",
      amount: "5-10% of home price"
    },
    {
      title: "GST/HST New Housing Rebate",
      description: "Rebate on GST/HST paid for new homes",
      amount: "Up to $30,000"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Home className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            First-Time Home Buyer's Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive step-by-step guide to purchasing your first home in the Greater Toronto Area. 
            From preparation to closing, we'll walk you through every step of the process.
          </p>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Home Buying Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow these essential steps to navigate your first home purchase with confidence.
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="grid lg:grid-cols-2 gap-8 items-center">
                <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <step.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-blue-600 mb-1">STEP {step.step}</div>
                          <CardTitle className="text-2xl">{step.title}</CardTitle>
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg">{step.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} text-center`}>
                  <div className="bg-blue-600 text-white p-12 rounded-2xl">
                    <div className="text-6xl font-bold mb-4">{step.step}</div>
                    <div className="text-xl font-semibold">{step.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First-Time Buyer Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              First-Time Buyer Incentives
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take advantage of government programs and incentives designed specifically for first-time home buyers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {firstTimeBuyerBenefits.map((benefit, index) => (
              <Card key={index} className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">{benefit.title}</CardTitle>
                  <div className="text-3xl font-bold text-green-600">{benefit.amount}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips for Success */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Tips for First-Time Buyer Success
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🏦 Financial Preparation</h3>
                <p className="text-gray-600">Start saving early, improve your credit score, and get pre-approved before house hunting.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🔍 Research Thoroughly</h3>
                <p className="text-gray-600">Learn about neighborhoods, market trends, and property values in your target areas.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">💡 Be Realistic</h3>
                <p className="text-gray-600">Your first home doesn't have to be perfect. Focus on location and potential for growth.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🤝 Choose the Right Team</h3>
                <p className="text-gray-600">Work with experienced professionals including realtor, mortgage broker, and lawyer.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📋 Plan for Additional Costs</h3>
                <p className="text-gray-600">Budget for closing costs, moving expenses, and immediate home improvements.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">⏰ Don't Rush</h3>
                <p className="text-gray-600">Take your time to find the right property. A good deal will come when you're patient.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Home Buying Journey?
          </h2>
          <p className="text-xl mb-8">
            Let Jigar Patel guide you through every step of your first home purchase. 
            Get personalized advice and expert support from start to finish.
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href="/contact">
              Start Working with Jigar Patel
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FirstTimeGuide;
