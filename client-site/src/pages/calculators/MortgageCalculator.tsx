import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Calculator } from "lucide-react";

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(800000);
  const [downPayment, setDownPayment] = useState(160000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [amortization, setAmortization] = useState(25);
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
  } | null>(null);

  const calculateMortgage = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = amortization * 12;
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalCost = monthlyPayment * numberOfPayments;
    const totalInterest = totalCost - principal;
    
    setResult({
      monthlyPayment,
      totalInterest,
      totalCost
    });
  };

  const downPaymentPercentage = ((downPayment / homePrice) * 100).toFixed(1);

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
            Mortgage Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your monthly mortgage payments and see how different variables affect your costs.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-6 w-6 mr-2 text-blue-600" />
                  Mortgage Details
                </CardTitle>
                <CardDescription>
                  Enter your mortgage information to calculate payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="homePrice">Home Price</Label>
                  <Input
                    id="homePrice"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="downPayment">
                    Down Payment ({downPaymentPercentage}%)
                  </Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="amortization">Amortization Period (years)</Label>
                  <Input
                    id="amortization"
                    type="number"
                    value={amortization}
                    onChange={(e) => setAmortization(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                
                <Button onClick={calculateMortgage} className="w-full" size="lg">
                  Calculate Mortgage
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Mortgage Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium">Monthly Payment:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${result.monthlyPayment.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium">Total Interest:</span>
                      <span className="text-lg font-semibold">
                        ${result.totalInterest.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-medium">Total Cost:</span>
                      <span className="text-lg font-semibold">
                        ${result.totalCost.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Important Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Minimum down payment is 5% for homes under $500,000</li>
                    <li>• Minimum 10% for the portion above $500,000</li>
                    <li>• 20% minimum for homes over $1,000,000</li>
                    <li>• CMHC insurance required if down payment is less than 20%</li>
                    <li>• Property taxes and insurance not included</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Pre-Approved?
          </h2>
          <p className="text-xl mb-8">
            Get personalized mortgage advice and pre-approval assistance from Jigar Patel.
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

export default MortgageCalculator;
