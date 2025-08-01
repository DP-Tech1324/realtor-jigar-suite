import {
  X, Share2, Heart, Printer, Maximize, Phone, Mail, MapPin
} from "lucide-react";

export default function PropertyDetailsModal({ listing, onClose }: { listing: any, onClose: () => void }) {
  // Example images (replace with listing.images if available)
  const images = listing.images?.length
    ? listing.images
    : [listing.cover_image || "https://via.placeholder.com/600x400?text=No+Image"];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-white">
      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Topbar */}
        <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between p-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            onClick={onClose}
          >
            ← Back to Map Search
          </button>
          <div className="flex gap-3 items-center">
            <button className="text-slate-700 hover:text-blue-700"><Share2 /></button>
            <button className="text-slate-700 hover:text-red-600"><Heart /></button>
            <button className="text-slate-700 hover:text-blue-700"><Printer /></button>
            <button className="text-slate-700 hover:text-blue-700"><Maximize /></button>
            <button className="ml-3 text-2xl font-bold hover:text-red-600" onClick={onClose}>×</button>
          </div>
        </div>
        {/* Gallery */}
        <div className="w-full h-[320px] md:h-[420px] bg-slate-200 flex items-center justify-center overflow-hidden">
          <img
            src={images[0]}
            alt={listing.title}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Main Info */}
        <div className="p-6">
          <div className="text-2xl font-bold text-blue-700 mb-2">{listing.price && `$${Number(listing.price).toLocaleString()}`}</div>
          <div className="text-lg font-semibold text-slate-800 mb-1">{listing.title}</div>
          <div className="text-slate-600 mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {listing.address}, {listing.city}, {listing.province}
          </div>
          <div className="flex gap-6 mb-4 text-slate-700 font-medium">
            <span>{listing.bedrooms} 🛏 beds</span>
            <span>{listing.bathrooms} 🛁 baths</span>
            <span>MLS#: {listing.mls_number}</span>
          </div>
          <div className="mb-4 text-slate-700">{listing.description || "No property description available."}</div>
          {/* Example table for features, add more as needed */}
          <div className="mb-4">
            <table className="w-full text-left text-sm border">
              <tbody>
                <tr><td className="font-semibold w-44">Property Type:</td><td>{listing.property_type || "N/A"}</td></tr>
                <tr><td className="font-semibold">Bedrooms:</td><td>{listing.bedrooms}</td></tr>
                <tr><td className="font-semibold">Bathrooms:</td><td>{listing.bathrooms}</td></tr>
                <tr><td className="font-semibold">MLS#:</td><td>{listing.mls_number}</td></tr>
                {/* Add more fields here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Sidebar: Agent & Contact */}
      <div className="w-full lg:w-[420px] max-w-[480px] border-l bg-white flex flex-col p-6">
        {/* Agent card */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6 text-center shadow">
          <div className="font-bold text-slate-900">Presented by</div>
          <img src="/images/agents/IMG_9799.JPG" alt="Agent" className="w-20 h-20 mx-auto rounded-full my-3 border-2 border-blue-600 shadow" />
          <div className="font-bold text-lg mb-1">Jigar Patel</div>
          <div className="text-blue-600 text-sm mb-1">Real Estate Agent</div>
          <div className="text-slate-600 text-sm mb-1">647-801-5448</div>
          <div className="text-slate-600 text-sm mb-2">jigar@jigarpatelrealestate.com</div>
          <div className="flex gap-2 justify-center mt-2">
            <a href="tel:6478015448" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"><Phone className="w-4 h-4" />Call</a>
            <a href="mailto:jigar@jigarpatelrealestate.com" className="bg-slate-100 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded flex items-center gap-2"><Mail className="w-4 h-4" />Email</a>
          </div>
        </div>
        {/* Lead form */}
        <div className="bg-white rounded-xl shadow p-6 sticky top-24">
          <div className="font-bold text-slate-900 mb-2">Request More Information</div>
          <form className="flex flex-col gap-3">
            <input type="text" className="border p-2 rounded" placeholder="Name*" />
            <input type="tel" className="border p-2 rounded" placeholder="Phone*" />
            <input type="email" className="border p-2 rounded" placeholder="Email*" />
            <textarea className="border p-2 rounded" placeholder={`I'm interested in ${listing.title}`} rows={3} />
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold mt-2" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
