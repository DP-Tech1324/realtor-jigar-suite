import { Phone } from "lucide-react";

// Config — adjust to your actual details or props as you wish
const AGENT = {
  name: "JIGAR PATEL",
  title: "Real Estate Agent",
  phone: "647-801-5448",
   email: "jigar@jigarpatelrealestate.com",
  photo: "/images/agents/IMG_9799.JPG",            // Place agent photo in public/images/
  brokerageLogo: "/images/logos/Rpl-Logo.png" // Place logo in public/images/ or remove if not needed
};

export default function AgentBar() {
  return (
    <div className="w-full  flex justify-center">
      <div
        className="
          bg-white
          rounded-2xl
          shadow-xl
          border
          flex flex-col md:flex-row items-center
          px-8 py-4
          mt-12 mb-2
          max-w-xl
        "
        style={{ zIndex: 30 }}
      >
        {/* Photo */}
        <img
          src={AGENT.photo}
          alt="Agent"
          className="w-24 h-25  object-cover rounded-xl border border-slate-200 shadow-sm mr-0 md:mr-6 mb-2 md:mb-0"
        />

        {/* Info */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl font-bold text-slate-900">{AGENT.name}</span>
            {AGENT.brokerageLogo && (
              <img
                src={AGENT.brokerageLogo}
                alt="Brokerage"
                className="w-16 h-8 object-contain"
              />
            )}
          </div>
          <div className="text-base text-slate-600">{AGENT.title}</div>
          <div className="flex items-center text-blue-700 text-sm mt-2">
            <Phone className="w-4 h-4 mr-1" />
            <span>{AGENT.phone}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">{AGENT.email}</div>
        </div>
      </div>
    </div>
  );
}