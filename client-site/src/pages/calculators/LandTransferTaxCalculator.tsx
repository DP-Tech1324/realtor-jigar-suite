
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Calculator } from "lucide-react";

const LandTransferTaxCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState(800000);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [isTorontoBuyer, setIsTorontoBuyer] = useState(false);
  const [result, setResult] = useState<{
    provincialTax: number;
    municipalTax: number;
    totalTax: number;
    rebates: number;
    netTax: number;
  } | null>(null);

  const calculateLandTransferTax = () => {
    let provincialTax = 0;
    let municipalTax = 0;
    let rebates = 0;

    // Ontario Provincial Land Transfer Tax
    if (purchasePrice <= 55000) {
      provincialTax = purchasePrice * 0.005;
    } else if (purchasePrice <= 250000) {
      provincialTax = 275 + (purchasePrice - 55000) * 0.01;
    } else if (purchasePrice <= 400000) {
      provincialTax = 2225 + (purchasePrice - 250000) * 0.015;
    } else if (purchasePrice <= 2000000) {
      provincialTax = 4475 + (purchasePrice - 400000) * 0.02;
    } else {
      provincialTax = 36475 + (purchasePrice - 2000000) * 0.025;
    }

    // Toronto Municipal Land Transfer Tax (if applicable)
    if (isTorontoBuyer) {
      if (purchasePrice <= 55000) {
        municipalTax = purchasePrice * 0.005;
      } else if (purchasePrice <= 400000) {
        municipalTax = 275 + (purchasePrice - 55000) * 0.01;
      } else if (purchasePrice <= 2000000) {
        municipalTax = 3725 + (purchasePrice - 400000) * 0.02;
      } else {
        municipalTax = 35725 + (purchasePrice - 2000000) * 0.025;
      }
    }

    // First-time buyer rebates
    if (isFirstTimeBuyer) {
      // Ontario rebate (up to $4,000)
      const ontarioRebate = Math.min(4000, provincialTax);
      rebates += ontarioRebate;

      // Toronto rebate (up to $4,475 if in Toronto)
      if (isTorontoBuyer) {
        const torontoRebate = Math.min(4475, municipalTax);
        rebates += torontoRebate;
      }
    }

    const totalTax = provincialTax + municipalTax;
    const netTax = totalTax - rebates;

    setResult({
      provincialTax,
      municipalTax,
      totalTax,
      rebates,
      netTax
    });
  };

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
            Land Transfer Tax Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate the land transfer tax you'll pay when purchasing property in Ontario and Toronto.
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
                  <Calculator className="h-6 w-6 mr-2 text-green-600" />
                  Property Details
                </CardTitle>
                <CardDescription>
                  Enter your property information to calculate land transfer tax
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="firstTimeBuyer"
                      checked={isFirstTimeBuyer}
                      onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="firstTimeBuyer">First-time home buyer</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="torontoBuyer"
                      checked={isTorontoBuyer}
                      onChange={(e) => setIsTorontoBuyer(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="torontoBuyer">Property is in Toronto</Label>
                  </div>
                </div>
                
                <Button onClick={calculateLandTransferTax} className="w-full" size="lg">
                  Calculate Land Transfer Tax
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Tax Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium">Ontario Provincial Tax:</span>
                      <span className="text-lg font-semibold">
                        ${result.provincialTax.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    {result.municipalTax > 0 && (
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="font-medium">Toronto Municipal Tax:</span>
                        <span className="text-lg font-semibold">
                          ${result.municipalTax.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium">Total Tax:</span>
                      <span className="text-lg font-semibold">
                        ${result.totalTax.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    {result.rebates > 0 && (
                      <div className="flex justify-between items-center py-3 border-b text-green-600">
                        <span className="font-medium">First-Time Buyer Rebate:</span>
                        <span className="text-lg font-semibold">
                          -${result.rebates.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg">
                      <span className="font-bold text-lg">Net Tax Payable:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${result.netTax.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Land Transfer Tax Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ontario Provincial Rates:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• 0.5% on first $55,000</li>
                        <li>• 1.0% on $55,001 to $250,000</li>
                        <li>• 1.5% on $250,001 to $400,000</li>
                        <li>• 2.0% on $400,001 to $2,000,000</li>
                        <li>• 2.5% on amounts over $2,000,000</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">First-Time Buyer Rebates:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Ontario: Up to $4,000</li>
                        <li>• Toronto: Up to $4,475 (additional)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Help with Your Purchase?
          </h2>
          <p className="text-xl mb-8">
            Let Jigar Patel guide you through the entire home buying process and help you understand all costs involved.
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

export default LandTransferTaxCalculator;
