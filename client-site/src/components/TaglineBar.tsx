// In your TaglineBar.tsx
const TAGLINES = [
  "Negotiating Your Best Move.",
  "Your Real Estate, Expertly Negotiated.",
  "Making Your Next Move, Your Best Move."
];

export default function TaglineBar() {
  const tagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  return (
    <div className="w-full fixed top-0 left-0 z-[99] bg-slate-900 py-[10px] px-2 shadow" style={{fontFamily: "'Open Sans', Arial, sans-serif"}}>
      <div className="text-center text-white text-base font-bold uppercase tracking-widest" style={{letterSpacing: "1px"}}>
        <span className="shimmer-text">{tagline}</span>
      </div>
      <style>{`
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #FFD700 10%,
            #FFF7C0 40%,
            #FFC72C 60%,
            #FFD700 90%
          );
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          animation: shimmer 2.5s linear infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </div>
  );
}
