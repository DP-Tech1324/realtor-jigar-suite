
import { Button } from "@/components/ui/button";
import { Award, HomeIcon, Building2, Languages, ArrowRight, Phone, Mail, MapPin, HeartHandshake, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SOCIAL_LINKS } from "@/lib/social";
import { CONTACT } from "@/lib/contact";


function BioSection() {
  const navigate = useNavigate();

  // From Jigar's Royal LePage profile (awards, designation, languages, areas of expertise)
  const achievements = [
    {
      icon: Trophy,
      number: "2023",
      label: "Master Sales Award",
      description: "Also received the Sales Achievement Award in 2022.",
    },
    {
      icon: HeartHandshake,
      number: "CNE®",
      label: "Certified Negotiation Expert",
      description: "Trained to negotiate the best terms on your offer, buying or selling.",
    },
    {
      icon: HomeIcon,
      number: "Residential",
      label: "Buyers, sellers & leasing",
      description: "First-time buyers, income properties, small investments and leases.",
    },
    {
      icon: Building2,
      number: "Commercial",
      label: "Retail & small business",
      description: "Small commercial, retail space and restaurant businesses.",
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
                A resident of the GTA since 1998, Jigar has watched its friends, families and communities grow. He
                knows which areas offer the best environment for families, singles or seniors, and he is committed to
                giving every client the professional service they need, expect and deserve in today's market.
              </p>
              <p>
                Selling? Jigar creates a marketing plan for your home and talks you through the strategies that help
                you make a good decision, while giving your home excellent exposure to the market. Buying your first
                home or investing? He is with you from your first meeting right through to closing.
              </p>
              <p>
                A CNE® Certified Negotiation Expert, Jigar received the Master Sales Award in 2023 and the Sales
                Achievement Award in 2022. He works with clients in English, Hindi and Gujarati.
              </p>
            </div>

            {/* Contact info */}
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-slate-900 text-lg mb-4">Get in Touch</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <a href={CONTACT.mobileTel} className="text-slate-700 hover:text-blue-600">{CONTACT.mobile}</a>
                  <span className="text-slate-400 text-sm ml-2">mobile</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <a href={CONTACT.directTel} className="text-slate-700 hover:text-blue-600">{CONTACT.direct}</a>
                  <span className="text-slate-400 text-sm ml-2">direct</span>
                </div>
                <div className="flex items-center sm:col-span-2">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <a href={`mailto:${CONTACT.email}`} className="text-slate-700 hover:text-blue-600">{CONTACT.email}</a>
                </div>
                <div className="flex items-start sm:col-span-2">
                  <Building2 className="h-5 w-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                  <span className="text-slate-700">{CONTACT.brokerage}, {CONTACT.officeLines.join(", ")}</span>
                </div>
                <div className="flex items-start sm:col-span-2">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                  <span className="text-slate-700">
                    Mississauga, Brampton, Burlington, Georgetown & Halton, Hamilton, Kitchener-Waterloo, Brantford and Niagara
                  </span>
                </div>
                <div className="flex items-center sm:col-span-2">
                  <Languages className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-slate-700">English · Hindi · Gujarati</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    <social.icon className="h-4 w-4" />
                    {social.label}
                  </a>
                ))}
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
        Awards & Designations
      </h4>
      <ul className="space-y-4 text-lg">
        <li className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-200" />
          Master Sales Award, 2023
        </li>
        <li className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-200" />
          Sales Achievement Award, 2022
        </li>
        <li className="flex items-center gap-3">
          <HeartHandshake className="h-6 w-6 text-blue-200" />
          CNE® Certified Negotiation Expert
        </li>
        <li className="flex items-center gap-3">
          <Award className="h-6 w-6 text-amber-300" />
          REALTOR®, Royal LePage Terra Realty
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

          {/* Right: Professional Photo and Achievements */}

          <div className="space-y-8 animate-fade-in">
            {/* Professional Photo Placeholder */}
            <div className="relative">
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
              </div>

              {/* Floating achievement badge */}
              {/*<div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                <span className="text-sm">Top 1% Agent</span>
              </div>*/}
            </div> 

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-8">
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
