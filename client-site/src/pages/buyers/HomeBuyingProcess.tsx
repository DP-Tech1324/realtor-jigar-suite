
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Home, DollarSign, Key, CheckCircle } from "lucide-react";

const HomeBuyingProcess = () => {
  const processSteps = [
    {
      phase: "Preparation Phase",
      duration: "2-4 weeks",
      steps: [
        {
          title: "Financial Assessment",
          description: "Review credit score, calculate budget, and gather financial documents",
          icon: DollarSign,
          timeframe: "1-2 weeks"
        },
        {
          title: "Mortgage Pre-Approval",
          description: "Meet with lenders and secure pre-approval for your mortgage",
          icon: FileText,
          timeframe: "3-5 days"
        },
        {
          title: "Choose Real Estate Agent",
          description: "Interview and select an experienced buyer's agent",
          icon: Search,
          timeframe: "2-3 days"
        }
      ]
    },
    {
      phase: "House Hunting Phase",
      duration: "4-12 weeks",
      steps: [
        {
          title: "Property Search",
          description: "Search online listings, attend open houses, and schedule viewings",
          icon: Search,
          timeframe: "Ongoing"
        },
        {
          title: "Property Evaluation",
          description: "Assess properties against your criteria and budget",
          icon: Home,
          timeframe: "Per viewing"
        },
        {
          title: "Market Analysis",
          description: "Research comparable sales and neighborhood trends",
          icon: FileText,
          timeframe: "Per property"
        }
      ]
    },
    {
      phase: "Offer & Negotiation Phase",
      duration: "1-2 weeks",
      steps: [
        {
          title: "Make an Offer",
          description: "Submit purchase offer with appropriate terms and conditions",
          icon: FileText,
          timeframe: "1-2 days"
        },
        {
          title: "Negotiate Terms",
          description: "Work through counteroffers and finalize purchase agreement",
          icon: DollarSign,
          timeframe: "2-5 days"
        },
        {
          title: "Accepted Offer",
          description: "Celebrate and prepare for the next steps",
          icon: CheckCircle,
          timeframe: "1 day"
        }
      ]
    },
    {
      phase: "Closing Phase",
      duration: "4-6 weeks",
      steps: [
        {
          title: "Home Inspection",
          description: "Conduct professional inspection and negotiate any issues",
          icon: Search,
          timeframe: "1 week"
        },
        {
          title: "Finalize Financing",
          description: "Complete mortgage application and arrange home insurance",
          icon: FileText,
          timeframe: "2-3 weeks"
        },
        {
          title: "Legal Review",
          description: "Lawyer reviews documents and prepares for closing",
          icon: FileText,
          timeframe: "1-2 weeks"
        },
        {
          title: "Final Walk-Through",
          description: "Inspect property one final time before closing",
          icon: Home,
          timeframe: "1 day"
        },
        {
          title: "Closing Day",
          description: "Sign documents, transfer funds, and receive keys",
          icon: Key,
          timeframe: "1 day"
        }
      ]
    }
  ];

  const importantConsiderations = [
    {
      title: "Conditions to Include in Your Offer",
      items: [
        "Home inspection condition (3-5 days)",
        "Financing condition (5-10 days)",
        "Status certificate review (for condos)",
        "Survey review (if applicable)",
        "Insurance confirmation"
      ]
    },
    {
      title: "Closing Costs to Budget For",
      items: [
        "Land transfer tax",
        "Legal fees ($1,000-$2,000)",
        "Home inspection ($400-$600)",
        "Property insurance",
        "Utility deposits and connections"
      ]
    },
    {
      title: "Red Flags to Watch For",
      items: [
        "Unusual odors or stains",
        "Cracks in walls or foundation",
        "Water damage signs",
        "Electrical or plumbing issues",
        "Overly motivated seller without clear reason"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-violet-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Home Buying Process
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding every step of the home buying process helps you prepare for what's ahead 
            and ensures a smooth transaction from start to finish.
          </p>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Home Buying Timeline
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Typical timeline from start to closing is 3-6 months, depending on market conditions and your specific situation.
            </p>
          </div>

          <div className="space-y-16">
            {processSteps.map((phase, phaseIndex) => (
              <div key={phaseIndex}>
                <div className="text-center mb-8">
                  <div className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full">
                    <h3 className="text-xl font-bold">{phase.phase}</h3>
                    <p className="text-sm opacity-90">{phase.duration}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {phase.steps.map((step, stepIndex) => (
                    <Card key={stepIndex} className="border-2 hover:border-purple-300 transition-colors">
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="bg-purple-100 p-3 rounded-full">
                            <step.icon className="h-8 w-8 text-purple-600" />
                          </div>
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <div className="text-sm text-purple-600 font-semibold">{step.timeframe}</div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-center">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Considerations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Important Considerations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Key things to keep in mind throughout your home buying journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {importantConsiderations.map((consideration, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600">{consideration.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {consideration.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Guidance */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expert Guidance Throughout the Process
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              The home buying process can be complex, but you don't have to navigate it alone. 
              Jigar Patel provides expert guidance and support at every step to ensure your transaction goes smoothly.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Jigar Will Help You:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Navigate market conditions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Structure competitive offers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Negotiate best terms</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Coordinate with other professionals</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Additional Support:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Trusted professional referrals</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Market insights and analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Timeline management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Problem resolution</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Button asChild size="lg">
              <a href="#contact">
                Get Expert Guidance from Jigar Patel
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Begin Your Home Buying Process?
          </h2>
          <p className="text-xl mb-8">
            Start with a consultation to understand your needs and create a personalized home buying strategy.
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href="/contact">
              Schedule Your Consultation
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeBuyingProcess;
