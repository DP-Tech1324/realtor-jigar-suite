
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, TrendingUp, MapPin, Bed, Bath, Square } from "lucide-react";
import { useState } from "react";

const HomeValuation = () => {
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for valuation logic
    console.log("Valuation request submitted", { address, bedrooms, bathrooms, squareFootage, propertyType });
  };

  return (
    <div className="min-h-screen bg-white">

      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <Home className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free Home Valuation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get an accurate, professional assessment of your home's current market value. 
            Jigar Patel provides comprehensive market analysis to help you make informed decisions.
          </p>
        </div>
      </section>

      {/* Valuation Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Your Home's Value</CardTitle>
              <CardDescription>
                Fill out the form below to receive a comprehensive market analysis of your property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, Toronto, ON"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detached">Detached House</SelectItem>
                        <SelectItem value="semi-detached">Semi-Detached</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Number of bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4 Bedrooms</SelectItem>
                        <SelectItem value="5+">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select value={bathrooms} onValueChange={setBathrooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Number of bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bathroom</SelectItem>
                        <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                        <SelectItem value="2">2 Bathrooms</SelectItem>
                        <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                        <SelectItem value="3">3 Bathrooms</SelectItem>
                        <SelectItem value="3.5+">3.5+ Bathrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      placeholder="e.g., 2000"
                      value={squareFootage}
                      onChange={(e) => setSquareFootage(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Get Free Home Valuation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Valuation Process Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jigar uses advanced market analysis and local expertise to provide accurate home valuations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Location Analysis</h3>
              <p className="text-gray-600">
                Comprehensive analysis of your neighborhood, local amenities, and market trends
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Market Comparison</h3>
              <p className="text-gray-600">
                Compare your property with recent sales of similar homes in your area
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Property Assessment</h3>
              <p className="text-gray-600">
                Detailed evaluation of your home's features, condition, and unique selling points
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Learn Your Home's Value?
          </h2>
          <p className="text-xl mb-8">
            Contact Jigar Patel today for a comprehensive, professional home valuation and market analysis.
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href="/contact">
              Contact Jigar Patel
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeValuation;
