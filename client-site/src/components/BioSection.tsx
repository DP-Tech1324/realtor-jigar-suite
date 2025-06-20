
import { Button } from "@/components/ui/button";
import { Award, HomeIcon, Building2, Landmark, ArrowRight, Phone, Mail, MapPin, LineChart, Crown} from "lucide-react";
import { useNavigate } from "react-router-dom";


function BioSection() {
  const navigate = useNavigate();

  const achievements = [
    {
      icon: HomeIcon,
      number: "500+",
      label: "Property Sales",
      description: "Sell properties with confidence using our marketing expertise and strategic pricing.",
    },
    {
      icon: Building2,
      number: "350+",
      label: "Property Acquisition",
      description: "Strategic support to help you acquire the right property at the right time.",
    },
    {
      icon: Landmark,
      number: "120+",
      label: "Commercial Real Estate",
      description: "End-to-end solutions for retail, office, and industrial property needs.",
    },
    {
      icon: LineChart,
      number: "80+",
      label: "Investment Properties",
      description: "Guidance and analysis for investors seeking profitable real estate opportunities.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-yellow-500 rounded-full mr-4"></div>
                <span className="text-blue-600 font-semibold text-lg uppercase tracking-wide">About</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Meet Jigar Patel
              </h2>
              <p className="text-2xl text-blue-600 font-semibold mb-8">
                Your Trusted Real Estate Professional in the GTA
              </p>
            </div>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                With over 15 years of dedicated experience in the Greater Toronto Area real estate market,
                Jigar Patel has established himself as one of the region's most trusted and accomplished realtors.
                His unwavering commitment to excellence and personalized service has helped hundreds of families
                navigate their real estate journey successfully.
              </p>
              <p>
                Jigar's deep understanding of local market dynamics, combined with his exceptional negotiation
                skills and meticulous attention to detail, ensures that every client achieves the best possible
                outcome. Whether you're a first-time homebuyer, seasoned investor, or looking to sell your property,
                Jigar provides the expertise, guidance, and support you need at every step.
              </p>
              <p>
                Born and raised in the GTA, Jigar possesses an intimate knowledge of the neighborhoods, schools,
                and communities that make this area extraordinary. He takes immense pride in matching families
                with homes that truly align with their lifestyle, dreams, and aspirations.
              </p>
            </div>

            {/* Contact info */}
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-slate-900 text-lg mb-4">Get in Touch</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-slate-700">(416) 555-0123</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-slate-700">jigar@jigarpatel.com</span>
                </div>
                <div className="flex items-center sm:col-span-2">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-slate-700">Serving Greater Toronto Area</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Schedule Consultation
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/sellers/valuation')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Get Home Valuation
              </Button>
            </div>
         <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-white">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    {/* Left: Certifications List */}
    <div>
      <h4 className="font-bold text-2xl mb-6 flex items-center gap-3">
        <Award className="inline h-7 w-7 text-yellow-300" />
        Professional Certifications
      </h4>
      <ul className="space-y-4 text-lg">
        <li className="flex items-center gap-3">
          <Award className="h-6 w-6 text-yellow-200" />
          Licensed Real Estate Broker
        </li>
        <li className="flex items-center gap-3">
          <Award className="h-6 w-6 text-yellow-200" />
          RECO Certified Professional
        </li>
        <li className="flex items-center gap-3">
          <LineChart className="h-6 w-6 text-blue-200" />
          Investment Property Specialist
        </li>
        <li className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-amber-300" />
          Luxury Home Marketing Specialist
        </li>
      </ul>
    </div>
    {/* Right: Logos (vertically centered) */}
    <div className="flex flex-col items-center gap-6">
      <img
        src="/images/logos/relator.jpeg"
        alt="REALTOR"
        className="h-16 w-auto bg-white rounded p-2 shadow"
      />
      <img
        src="/images/logos/TERB.jpg"
        alt="Toronto Regional Real Estate Board"
        className="h-16 w-auto bg-white rounded p-2 shadow"
      />
    </div>
  </div>
</div>

          </div>

          <div className="space-y-8 animate-fade-in">
            {/* Professional Photo Placeholder */}
           {/* <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="text-center p-10">
                 <img
                 src="/images/agents/IMG_9799.JPG"
                 alt="Jigar Patel"
                  className="absolute-full object-cover shadow-2xl mx-auto mb-6 shadow-lg border-4 border-white"
                />
                  <h4 className="text-2xl font-bold text-slate-800 mb-2">Jigar Patel</h4>
                  <p className="text-slate-600 mb-4">Real Estate Professional</p>
                  
                </div>
              </div> */}

              {/* Floating achievement badge */}
              {/*<div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                <span className="text-sm">Top 1% Agent</span>
              </div>
            </div> */}

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <achievement.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mb-1">
                    {achievement.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BioSection;
