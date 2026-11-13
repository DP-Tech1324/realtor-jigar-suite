import { Building2, CalendarCheck, KeyRound, Compass } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import Footer from "@/components/Footer";
import AiChatBubble from "@/components/AiChatBubble";

// Pre-construction projects aren't in the MLS® feed, so this page captures the lead and
// Jigar follows up with current projects, floor plans and VIP pricing.
const steps = [
  { icon: Building2, title: "Tell me what you want", text: "Area, budget, size and move-in timeline." },
  { icon: Compass, title: "Shortlist & floor plans", text: "Current GTA projects that fit, including Vastu-friendly layouts on request." },
  { icon: CalendarCheck, title: "Early access", text: "Platinum / VIP launches before public release, where available." },
  { icon: KeyRound, title: "Through to closing", text: "Deposit structure, assignment options and builder agreements reviewed with you." },
];

export default function PreConstruction() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Pre-Construction Condos</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            New condo and townhome projects across the GTA. Builders release these before they appear on the MLS®,
            so tell me what you're looking for and I'll send matching projects, floor plans and pricing.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How it works</h2>
          <ol className="space-y-5">
            {steps.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">{title}</span>
                  <span className="text-slate-600">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <InquiryForm initialMessage="I'm interested in pre-construction condos. Area: … Budget: … Bedrooms: … Move-in: …" />
      </section>

      <Footer />
      <AiChatBubble />
    </div>
  );
}
