// src/components/Hero.tsx

import MasterPropertySearchForm from "@/components/MasterPropertySearchForm";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 via-transparent to-slate-900/60" />
        <img
          src="/images/hero/Hero.png"
          alt=""
          className="w-full h-full object-cover object-center opacity-30"
        />
      </div>

      {/* Centered Search Form */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-10">
        <MasterPropertySearchForm />
      </div>

      {/* Success numbers & hero branding below */}
      {/*<div className="relative z-10 w-full max-w-3xl mx-auto mt-12 mb-6">
        <div className="bg-white/90 rounded-2xl shadow-xl px-8 py-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Jigar Patel</h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-yellow-500 mb-4">Real Estate Excellence</h2>
          <p className="text-lg text-slate-700 mb-4">
            Your Trusted GTA Realtor & Investment Partner
          </p>
          <p className="text-base text-slate-600 mb-6">
            Discover exceptional properties and expert guidance in the Greater Toronto Area. 
            With proven expertise and personalized service, we turn your real estate dreams into reality.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-sm text-blue-700">Homes Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">15+</div>
              <div className="text-sm text-blue-700">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">5.0</div>
              <div className="text-sm text-blue-700">Client Rating</div>
            </div>
          </div>
        </div>
      </div> */}

      
    </section>
  );
}
