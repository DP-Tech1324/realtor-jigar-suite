import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, Calculator } from "lucide-react";

const AffordabilityCalculator = () => {
  const [grossIncome, setGrossIncome] = useState(100000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(100000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [amortization, setAmortization] = useState(25);
  const [result, setResult] = useState<{
    maxMortgage: number;
    maxHomePrice: number;
    monthlyPayment: number;
    gdsRatio: number;
    tdsRatio: number;
  } | null>(null);

  const calculateAffordability = () => {
    const monthlyIncome = grossIncome / 12;
    
    // GDS ratio calculation (max 32% of gross monthly income)
    const maxGDSPayment = monthlyIncome * 0.32;
    
    // TDS ratio calculation (max 40% of gross monthly income)
    const maxTDSPayment = monthlyIncome * 0.40;
    const maxMortgagePayment = maxTDSPayment - monthlyDebts;
    
    // Use the lower of GDS and TDS limits
    const maxPayment = Math.min(maxGDSPayment, maxMortgagePayment);
    
    // Calculate maximum mortgage based on payment capacity
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = amortization * 12;
    
    const maxMortgage = (maxPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) / 
                       (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    
    const maxHomePrice = maxMortgage + downPayment;
    
    // Calculate actual ratios
    const gdsRatio = (maxPayment / monthlyIncome) * 100;
    const tdsRatio = ((maxPayment + monthlyDebts) / monthlyIncome) * 100;
    
    setResult({
      maxMortgage,
      maxHomePrice,
      monthlyPayment: maxPayment,
      gdsRatio,
      tdsRatio
    });
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-violet-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full">
              <PiggyBank className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Affordability Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Determine how much home you can afford based on your income, debts, and down payment.
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
                  <Calculator className="h-6 w-6 mr-2 text-purple-600" />
                  Financial Information
                </CardTitle>
                <CardDescription>
                  Enter your financial details to calculate affordability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="grossIncome">Annual Gross Income</Label>
                  <Input
                    id="grossIncome"
                    type="number"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthlyDebts">Monthly Debt Payments</Label>
                  <Input
                    id="monthlyDebts"
                    type="number"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Include credit cards, loans, car payments, etc.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="downPayment">Available Down Payment</Label>
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
                
                <Button onClick={calculateAffordability} className="w-full" size="lg">
                  Calculate Affordability
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-600">Affordability Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Maximum Home Price</p>
                        <p className="text-3xl font-bold text-purple-600">
                          ${result.maxHomePrice.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">Maximum Mortgage:</span>
                        <span className="text-lg font-semibold">
                          ${result.maxMortgage.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">Monthly Payment:</span>
                        <span className="text-lg font-semibold">
                          ${result.monthlyPayment.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">GDS Ratio:</span>
                        <span className="text-lg font-semibold">
                          {result.gdsRatio.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">TDS Ratio:</span>
                        <span className="text-lg font-semibold">
                          {result.tdsRatio.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Debt Service Ratios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">GDS (Gross Debt Service):</h4>
                      <p className="text-sm">
                        Maximum 32% of gross monthly income. Includes mortgage payments, 
                        property taxes, heating costs, and 50% of condo fees (if applicable).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">TDS (Total Debt Service):</h4>
                      <p className="text-sm">
                        Maximum 40% of gross monthly income. Includes GDS plus all other 
                        monthly debt payments (credit cards, loans, etc.).
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This calculator provides estimates only. 
                        Actual approval depends on credit score, employment history, 
                        and lender requirements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Home Search?
          </h2>
          <p className="text-xl mb-8">
            Now that you know your budget, let Jigar Patel help you find the perfect home within your price range.
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

export default AffordabilityCalculator;
