// src/components/PropertyDetailsContent.tsx
export default function PropertyDetailsContent({ listing }) {
  if (!listing) return null;

  // formatPrice helper:
  const formatPrice = (price) =>
    price ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(price) : 'Price on request';

  // features array if you want:
  const features = [
    { label: "Bedrooms", value: listing.bedrooms },
    { label: "Bathrooms", value: listing.bathrooms },
    { label: "Type", value: listing.property_type },
    { label: "MLS#", value: listing.mls_number },
  ].filter(f => f.value);

  return (
    <div>
      {/* Main Image */}
      <img
        src={listing.cover_image || "https://via.placeholder.com/700x400"}
        alt={listing.title}
        className="w-full max-h-[360px] object-cover rounded-2xl mb-6"
      />
      {/* Title and Price */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <div className="text-2xl text-blue-700 font-bold">{formatPrice(listing.price)}</div>
      </div>
      <div className="mb-2 text-slate-700">{listing.address}, {listing.city}, {listing.province}</div>
      <div className="flex gap-6 mb-6">
        {features.map((f, i) => (
          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{f.label}: {f.value}</span>
        ))}
      </div>
      {/* Description */}
      <div className="mb-6 text-lg text-slate-800">{listing.description || "No description available."}</div>
      {/* Agent section (simple example) */}
      <div className="bg-slate-100 p-6 rounded-2xl mt-6">
        <div className="font-semibold mb-2">Presented by:</div>
        <div className="flex items-center gap-3">
          <img src="/images/agents/IMG_9799.JPG" alt="Jigar Patel" className="h-12 w-12 rounded-full border border-blue-500 object-cover" />
          <div>
            <div className="font-bold text-blue-700">Jigar Patel</div>
            <div className="text-sm text-slate-500">Real Estate Agent</div>
            <div className="text-sm text-slate-700">📞 (647) 801-5448</div>
            <div className="text-sm text-slate-700">✉️ jigar@jigarpatelrealestate.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
