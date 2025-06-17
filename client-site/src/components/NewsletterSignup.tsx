
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, TrendingUp, Home, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our weekly market updates and exclusive listings.",
      });
      setEmail("");
    }, 1000);
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Weekly GTA market trends and analysis"
    },
    {
      icon: Home,
      title: "Exclusive Listings",
      description: "Early access to new properties"
    },
    {
      icon: Users,
      title: "Expert Tips",
      description: "Professional real estate advice"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full mr-4"></div>
                <span className="text-yellow-400 font-semibold text-lg uppercase tracking-wide">Newsletter</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Stay Ahead of the
                <span className="block text-yellow-400">GTA Market</span>
              </h2>
              <p className="text-xl text-blue-200 leading-relaxed">
                Get exclusive market insights, new property alerts, and expert real estate tips 
                delivered straight to your inbox every week.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{benefit.title}</h4>
                    <p className="text-blue-200">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">5K+</div>
                <div className="text-sm text-blue-200">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">98%</div>
                <div className="text-sm text-blue-200">Open Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">Weekly</div>
                <div className="text-sm text-blue-200">Updates</div>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div className="animate-fade-in">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
                    <p className="text-blue-200">
                      Get the latest market updates and exclusive property listings
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-3 text-blue-100">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/30 transition-all duration-300"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Subscribe Now
                    </Button>

                    <p className="text-xs text-blue-300 text-center">
                      By subscribing, you agree to receive marketing emails. 
                      You can unsubscribe at any time.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Welcome Aboard!</h3>
                  <p className="text-blue-200 text-lg mb-6">
                    You've successfully subscribed to our newsletter. 
                    Check your inbox for a welcome message.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-slate-900"
                  >
                    Subscribe Another Email
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
