
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const faqCategories = [
    {
      title: "Buying a Home",
      icon: "🏠",
      faqs: [
        {
          id: "buying-1",
          question: "How much should I budget for a down payment?",
          answer: "In Canada, the minimum down payment is 5% for homes under $500,000. For homes between $500,000 and $999,999, you need 5% on the first $500,000 and 10% on the remaining amount. For homes $1 million and over, you need at least 20%. However, a larger down payment can help you avoid mortgage insurance and get better rates."
        },
        {
          id: "buying-2",
          question: "What's the difference between pre-qualified and pre-approved?",
          answer: "Pre-qualification is a rough estimate based on information you provide, while pre-approval involves a thorough review of your finances by a lender. Pre-approval carries more weight with sellers and shows you're a serious buyer with confirmed financing capacity."
        },
        {
          id: "buying-3",
          question: "How long does the home buying process take?",
          answer: "Typically, the process takes 30-60 days from offer acceptance to closing. This includes home inspection (7-14 days), mortgage approval (2-3 weeks), and final preparations. However, cash purchases or motivated sellers can sometimes close faster."
        },
        {
          id: "buying-4",
          question: "What additional costs should I expect when buying?",
          answer: "Beyond the purchase price, budget for land transfer tax (0.5-2.5%), legal fees ($1,500-3,000), home inspection ($400-800), title insurance ($300-500), and moving costs. First-time buyers may be eligible for land transfer tax rebates."
        },
        {
          id: "buying-5",
          question: "Should I get a home inspection?",
          answer: "Absolutely! A professional home inspection ($400-800) can reveal potential issues that could cost thousands later. It's your opportunity to negotiate repairs or price adjustments before finalizing the purchase."
        }
      ]
    },
    {
      title: "Selling a Home",
      icon: "💰",
      faqs: [
        {
          id: "selling-1",
          question: "How do I determine my home's market value?",
          answer: "I provide a comprehensive market analysis using recent comparable sales, current market conditions, and your home's unique features. This involves analyzing similar properties that sold within the last 3-6 months in your area."
        },
        {
          id: "selling-2",
          question: "What should I do to prepare my home for sale?",
          answer: "Start with decluttering and deep cleaning. Consider minor repairs, fresh paint in neutral colors, and staging key rooms. Enhance curb appeal with landscaping and exterior touch-ups. I provide a detailed preparation checklist tailored to your property."
        },
        {
          id: "selling-3",
          question: "How long will it take to sell my home?",
          answer: "In the current GTA market, well-priced homes typically sell within 14-30 days. Factors affecting timing include price, condition, location, season, and market conditions. I'll provide realistic timelines based on your specific situation."
        },
        {
          id: "selling-4",
          question: "What are the costs associated with selling?",
          answer: "Typical selling costs include real estate commission (usually 5-6%), legal fees ($1,000-2,000), staging costs ($2,000-5,000), marketing expenses, and potential capital gains tax for investment properties."
        },
        {
          id: "selling-5",
          question: "Should I make renovations before selling?",
          answer: "Focus on high-impact, low-cost improvements like painting, decluttering, and minor repairs. Major renovations rarely provide full return on investment. I'll assess your property and recommend the most cost-effective improvements."
        }
      ]
    },
    {
      title: "Market & Investment",
      icon: "📈",
      faqs: [
        {
          id: "market-1",
          question: "Is now a good time to buy in the GTA?",
          answer: "Market timing depends on your personal situation and long-term goals. I provide current market analysis, interest rate trends, and inventory levels to help you make informed decisions. Real estate is typically a long-term investment."
        },
        {
          id: "market-2",
          question: "What areas in the GTA are best for investment?",
          answer: "Strong investment areas typically feature good transit access, employment growth, new infrastructure, and development plans. Areas like Mississauga, Brampton, and parts of Durham Region show promising growth potential."
        },
        {
          id: "market-3",
          question: "How do interest rates affect the market?",
          answer: "Interest rates directly impact affordability and buying power. Higher rates can slow market activity and moderate price growth, while lower rates typically increase demand and competition among buyers."
        },
        {
          id: "market-4",
          question: "What's the rental market like in the GTA?",
          answer: "The GTA rental market remains strong with good demand, especially for well-located properties near transit and employment centers. Rental yields typically range from 3-5% annually, depending on location and property type."
        }
      ]
    },
    {
      title: "Working with Jigar",
      icon: "🤝",
      faqs: [
        {
          id: "agent-1",
          question: "What services do you provide?",
          answer: "I offer comprehensive real estate services including buyer representation, seller representation, market analysis, property valuation, investment consulting, and post-transaction support. My goal is to guide you through every step of your real estate journey."
        },
        {
          id: "agent-2",
          question: "How do you communicate with clients?",
          answer: "I believe in transparent, frequent communication. I provide regular updates via phone, email, or text based on your preference. You'll always know what's happening with your transaction and next steps."
        },
        {
          id: "agent-3",
          question: "What makes you different from other agents?",
          answer: "With 15+ years in the GTA market, I offer deep local knowledge, proven negotiation skills, comprehensive marketing strategies, and personalized service. My track record includes 500+ successful transactions and a 5.0 client satisfaction rating."
        },
        {
          id: "agent-4",
          question: "Do you work with first-time buyers?",
          answer: "Absolutely! I specialize in guiding first-time buyers through the process. I provide education on each step, help you understand financing options, connect you with trusted mortgage professionals, and ensure you feel confident in your decisions."
        },
        {
          id: "agent-5",
          question: "What areas do you serve?",
          answer: "I serve the entire Greater Toronto Area including Toronto, Mississauga, Brampton, Markham, Richmond Hill, Vaughan, Oakville, Burlington, and surrounding communities. My extensive network covers all major GTA markets."
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap(category => 
    category.faqs.map(faq => ({ ...faq, category: category.title }))
  );

  const filteredFaqs = searchTerm 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allFaqs;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get answers to common questions about buying, selling, and investing in GTA real estate
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 rounded-xl focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          {searchTerm ? (
            /* Search Results */
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Search Results ({filteredFaqs.length})
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border border-slate-200 rounded-xl px-6">
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <div>
                        <div className="font-semibold text-slate-900">{faq.question}</div>
                        <div className="text-sm text-blue-600 mt-1">{faq.category}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-slate-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-600">Try different keywords or browse categories below</p>
                </div>
              )}
            </div>
          ) : (
            /* Category View */
            <div className="space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                  <div className="flex items-center mb-8">
                    <span className="text-3xl mr-4">{category.icon}</span>
                    <h2 className="text-3xl font-bold text-slate-900">{category.title}</h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border border-slate-200 rounded-xl px-6">
                        <AccordionTrigger className="text-left hover:no-underline py-6 font-semibold text-slate-900">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-slate-700 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Can't find the answer you're looking for? I'm here to help with personalized guidance for your specific situation.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Call Me</h3>
                <p className="text-slate-600 mb-6">Speak directly with Jigar for immediate answers</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  (416) 555-0123
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Email Me</h3>
                <p className="text-slate-600 mb-6">Send your questions for a detailed response</p>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Schedule Consultation</h3>
                <p className="text-slate-600 mb-6">Book a free consultation to discuss your needs</p>
                <Button 
                  onClick={() => navigate('/contact')}
                  variant="outline" 
                  className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
