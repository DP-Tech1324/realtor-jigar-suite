
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah & Michael Chen",
      location: "Markham, ON",
      rating: 5,
      text: "Jigar helped us find our dream home in Markham. His knowledge of the local market was incredible, and he guided us through every step of the process. We couldn't be happier with our new home!",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      type: "First-Time Buyers"
    },
    {
      id: 2,
      name: "David Thompson",
      location: "Toronto, ON",
      rating: 5,
      text: "Professional, knowledgeable, and always available when we needed him. Jigar sold our condo in just 2 weeks for above asking price. His marketing strategy was outstanding!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      type: "Property Seller"
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      location: "Mississauga, ON",
      rating: 5,
      text: "As a single mother, buying a home felt overwhelming. Jigar was patient, understanding, and helped me find the perfect home within my budget. I'm so grateful for his support!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
      type: "Single Parent Buyer"
    },
    {
      id: 4,
      name: "Robert & Jennifer Kim",
      location: "Richmond Hill, ON",
      rating: 5,
      text: "We've worked with several realtors over the years, but Jigar stands out. His attention to detail and negotiation skills helped us get our investment property at a great price.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=150&q=80",
      type: "Investment Property"
    },
    {
      id: 5,
      name: "Ahmed Hassan",
      location: "Scarborough, ON",
      rating: 5,
      text: "Jigar made the home buying process seamless. His expertise in the GTA market and his honest advice helped us make the best decision. Highly recommend!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      type: "Family Home Purchase"
    },
    {
      id: 6,
      name: "Emily Watson",
      location: "Etobicoke, ON",
      rating: 5,
      text: "Selling our family home was emotional, but Jigar handled everything with care and professionalism. He got us the price we wanted and made the process stress-free.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      type: "Family Home Sale"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-yellow-500 rounded-full mr-4"></div>
            <span className="text-blue-600 font-semibold text-lg uppercase tracking-wide">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from the families and investors 
            who have successfully achieved their real estate goals with our help.
          </p>
        </div>

        {/* Overall Rating */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white rounded-2xl px-8 py-6 shadow-lg">
            <div className="flex items-center mr-6">
              {renderStars(5)}
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold text-slate-900">5.0</div>
              <div className="text-slate-600">Average Rating</div>
            </div>
            <div className="ml-6 text-left">
              <div className="text-3xl font-bold text-slate-900">400+</div>
              <div className="text-slate-600">Happy Clients</div>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-fade-in">
            {testimonials.slice(currentSlide * 2, currentSlide * 2 + 2).map((testimonial) => (
              <Card key={testimonial.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{testimonial.name}</h4>
                        <p className="text-slate-600">{testimonial.location}</p>
                        <div className="flex items-center mt-2">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <Quote className="h-8 w-8 text-blue-200 group-hover:text-blue-300 transition-colors" />
                  </div>
                  
                  <div className="mb-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {testimonial.type}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 text-lg leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 2 && (
            <div className="flex justify-center items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(testimonials.length / 2) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-blue-600 w-8' 
                        : 'bg-blue-200 hover:bg-blue-400'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Success Stories?
          </h3>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Experience the same level of professional service and exceptional results. 
            Let's make your real estate dreams come true.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              Read More Reviews
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
