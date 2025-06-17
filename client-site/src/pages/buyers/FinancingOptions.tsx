
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Home, CreditCard, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FinancingOptions = () => {
  const mortgageTypes = [
    {
      title: "Fixed Rate Mortgage",
      description: "Interest rate remains the same throughout the term",
      pros: ["Predictable payments", "Protection against rate increases", "Better for budgeting"],
      cons: ["Higher initial rates", "Less flexibility", "May miss rate decreases"],
      bestFor: "First-time buyers and those who prefer payment certainty"
    },
    {
      title: "Variable Rate Mortgage",
      description: "Interest rate fluctuates with market conditions",
      pros: ["Lower initial rates", "Potential for rate decreases", "More flexibility"],
      cons: ["Payment uncertainty", "Risk of rate increases", "Harder to budget"],
      bestFor: "Buyers comfortable with risk and market fluctuations"
    },
    {
      title: "Hybrid Mortgage",
      description: "Combination of fixed and variable rate portions",
      pros: ["Balance of stability and flexibility", "Diversified risk", "Customizable split"],
      cons: ["More complex", "Requires market knowledge", "Higher administrative costs"],
      bestFor: "Experienced buyers wanting balanced approach"
    }
  ];

  const downPaymentPrograms = [
    {
      title: "First-Time Home Buyer Incentive",
      description: "Government shared equity program",
      amount: "5-10% of home price",
      eligibility: "First-time buyers, household income under $120K",
      repayment: "When you sell or after 25 years"
    },
    {
      title: "Home Buyers' Plan (HBP)",
      description: "Withdraw from RRSP for down payment",
      amount: "Up to $35,000 per person",
      eligibility: "First-time buyers or qualifying repeat buyers",
      repayment: "15 years to repay to RRSP"
    },
    {
      title: "Land Transfer Tax Rebates",
      description: "Rebates for first-time buyers",
      amount: "Up to $4,000 (Ontario) + $4,475 (Toronto)",
      eligibility: "First-time home buyers",
      repayment: "No repayment required"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Financing Options for Home Buyers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore various mortgage types, down payment programs, and financing solutions 
            available to help you purchase your dream home in the GTA.
          </p>
        </div>
      </section>

      {/* Mortgage Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Types of Mortgages
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding different mortgage options helps you choose the best financing solution for your situation.
            </p>
          </div>

          <div className="space-y-8">
            {mortgageTypes.map((mortgage, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">{mortgage.title}</CardTitle>
                  <CardDescription className="text-lg">{mortgage.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Pros
                      </h4>
                      <ul className="space-y-2">
                        {mortgage.pros.map((pro, idx) => (
                          <li key={idx} className="text-gray-600">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Cons
                      </h4>
                      <ul className="space-y-2">
                        {mortgage.cons.map((con, idx) => (
                          <li key={idx} className="text-gray-600">• {con}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3">Best For</h4>
                      <p className="text-gray-600">{mortgage.bestFor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Down Payment Programs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Down Payment Assistance Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take advantage of government programs and incentives designed to help you save on your down payment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {downPaymentPrograms.map((program, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Amount Available:</h4>
                    <p className="text-green-600 font-semibold">{program.amount}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Eligibility:</h4>
                    <p className="text-gray-600">{program.eligibility}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Repayment:</h4>
                    <p className="text-gray-600">{program.repayment}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Approval Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Get Pre-Approved for Your Mortgage
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Mortgage pre-approval gives you a clear understanding of your buying power 
                and shows sellers you're a serious buyer.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <span className="block w-6 h-6 bg-blue-600 rounded-full text-white text-sm flex items-center justify-center font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gather Documents</h3>
                    <p className="text-gray-600">Income statements, employment letter, bank statements, ID</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <span className="block w-6 h-6 bg-blue-600 rounded-full text-white text-sm flex items-center justify-center font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Meet with Lender</h3>
                    <p className="text-gray-600">Discuss your financial situation and mortgage options</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <span className="block w-6 h-6 bg-blue-600 rounded-full text-white text-sm flex items-center justify-center font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Pre-Approval</h3>
                    <p className="text-gray-600">Get approved amount and start house hunting with confidence</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                    Benefits of Pre-Approval
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Know your exact budget</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Stronger offers to sellers</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Faster closing process</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Rate protection (usually 90-120 days)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Identify potential issues early</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore Your Financing Options?
          </h2>
          <p className="text-xl mb-8">
            Let Jigar Patel connect you with trusted mortgage professionals and guide you 
            through the financing process to get the best rates and terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">
                Contact Jigar Patel
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              <Link to="/calculators/mortgage">
                Use Mortgage Calculator
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FinancingOptions;
