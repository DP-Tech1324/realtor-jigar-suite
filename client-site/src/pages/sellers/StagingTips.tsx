
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Lightbulb, Palette, CheckCircle, Camera, DollarSign } from "lucide-react";

const StagingTips = () => {
  const stagingBenefits = [
    { benefit: "Sell 73% faster than non-staged homes", icon: CheckCircle },
    { benefit: "Receive 1-5% higher offers", icon: DollarSign },
    { benefit: "Appeal to 95% more buyers", icon: Home },
    { benefit: "Better online photos and showings", icon: Camera }
  ];

  const roomTips = {
    living: [
      "Remove personal photos and family items",
      "Arrange furniture to create conversation areas",
      "Add fresh flowers or plants for color",
      "Ensure adequate lighting with lamps",
      "Keep only essential, stylish furniture",
      "Use neutral throw pillows and blankets"
    ],
    kitchen: [
      "Clear all countertops except for 2-3 decorative items",
      "Remove magnets and papers from refrigerator",
      "Clean and organize all visible storage areas",
      "Add a bowl of fresh fruit for color",
      "Ensure all appliances are spotless",
      "Replace any burnt-out light bulbs"
    ],
    bedroom: [
      "Make beds with crisp, neutral bedding",
      "Remove excess furniture to create space",
      "Clear nightstands of personal items",
      "Add soft lighting with bedside lamps",
      "Organize closets and remove 1/3 of clothing",
      "Use matching hangers for a clean look"
    ],
    bathroom: [
      "Remove all personal toiletries from view",
      "Add fresh, fluffy towels in neutral colors",
      "Clean grout and remove any mildew",
      "Add a small plant or fresh flowers",
      "Ensure all fixtures are spotless",
      "Keep only luxury soap and lotion visible"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full">
              <Home className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Home Staging Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your home into a buyer's dream with proven staging techniques that 
            help homes sell faster and for higher prices in the competitive GTA market.
          </p>
        </div>
      </section>

      {/* Staging Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Home Staging Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional staging statistics show significant benefits for sellers in today's market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stagingBenefits.map((item, index) => (
              <Card key={index} className="text-center border-2 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <item.icon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-700 font-medium">
                    {item.benefit}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Room-by-Room Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Room-by-Room Staging Guide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional staging tips for every room in your home to maximize buyer appeal
            </p>
          </div>

          <Tabs defaultValue="living" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="living">Living Room</TabsTrigger>
              <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
              <TabsTrigger value="bedroom">Bedroom</TabsTrigger>
              <TabsTrigger value="bathroom">Bathroom</TabsTrigger>
            </TabsList>

            {Object.entries(roomTips).map(([room, tips]) => (
              <TabsContent key={room} value={room} className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl capitalize">{room} Staging Tips</CardTitle>
                    <CardDescription>
                      Essential staging guidelines to make your {room} irresistible to buyers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tips.map((tip, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* General Staging Principles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Essential Staging Principles
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Follow these fundamental staging principles to create a welcoming, 
                move-in ready atmosphere that appeals to the widest range of buyers.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Maximize Natural Light</h3>
                    <p className="text-gray-600">Open curtains, clean windows, and add mirrors to reflect light throughout your home.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <Palette className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Use Neutral Colors</h3>
                    <p className="text-gray-600">Stick to whites, beiges, and soft grays to create a clean, fresh canvas for buyers.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <Home className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Depersonalize Spaces</h3>
                    <p className="text-gray-600">Remove family photos and personal items so buyers can envision themselves living there.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-purple-600" />
                    Quick Staging Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Declutter every room and storage area",
                      "Deep clean the entire house",
                      "Repair any visible damage or wear",
                      "Add fresh flowers or plants",
                      "Ensure all light bulbs work",
                      "Create clear pathways through rooms",
                      "Set dining table for an elegant meal",
                      "Add cozy throws and pillows"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Staging Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Staging Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sometimes it's worth investing in professional staging services for maximum impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Consultation Only</CardTitle>
                <CardDescription>Professional advice and staging plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">$300-500</div>
                <p className="text-gray-600 mb-4">Perfect for DIY staging with expert guidance</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 2-3 hour consultation</li>
                  <li>• Written staging plan</li>
                  <li>• Shopping list</li>
                  <li>• Before/after photos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-300">
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Partial Staging</CardTitle>
                <CardDescription>Key rooms professionally staged</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">$1,500-3,000</div>
                <p className="text-gray-600 mb-4">Most popular option for maximum ROI</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Living room, kitchen, master bedroom</li>
                  <li>• Professional furniture rental</li>
                  <li>• Accessories and artwork</li>
                  <li>• 30-60 day rental period</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Full Home Staging</CardTitle>
                <CardDescription>Complete professional transformation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">$3,000-6,000</div>
                <p className="text-gray-600 mb-4">Premium service for luxury homes</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All main living areas</li>
                  <li>• Premium furniture and decor</li>
                  <li>• Professional installation</li>
                  <li>• Flexible rental terms</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Stage Your Home?
          </h2>
          <p className="text-xl mb-8">
            Get personalized staging advice from Jigar Patel and his network of professional stagers to maximize your home's appeal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">
                Get Staging Consultation
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              <a href="/contact">
                Contact Jigar Patel
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StagingTips;
