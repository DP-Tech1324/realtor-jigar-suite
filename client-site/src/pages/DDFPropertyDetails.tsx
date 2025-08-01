import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, Bed, Bath, Square, Calendar, X
} from "lucide-react";

const fallbackImg = "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80";

export default function DDFPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://realtor-jigar-suite-bdod.vercel.app/api/ddf-listings?id=${id}`)
      .then(res => res.json())
      .then(data => setListing(data))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <X className="h-10 w-10 text-red-600 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <Button onClick={() => navigate("/listings")}>Back to Listings</Button>
        <Footer />
      </div>
    );
  }

  // DDF fields
  const images = (listing.Media && listing.Media.length) ? [listing.Media[0].MediaURL] : [fallbackImg];
  const features = [
    { icon: Bed, label: "Bedrooms", value: listing.BedroomsTotal },
    { icon: Bath, label: "Bathrooms", value: listing.BathroomsTotalInteger },
    { icon: Square, label: "Sq Ft", value: listing.BuildingAreaTotal },
    { icon: Calendar, label: "Year Built", value: listing.YearBuilt }
  ].filter(f => f.value);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-blue-600">Listings</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Property Details</span>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <img src={images[0]} alt="Property" className="w-full h-80 object-cover rounded-xl mb-6" />
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-600 text-white">
            {listing.PropertySubType || "Property"}
          </Badge>
          <span className="text-lg font-bold text-slate-800">
            {listing.UnparsedAddress}, {listing.City}, {listing.StateOrProvince}
          </span>
        </div>
        <div className="text-slate-600 mt-2">{listing.PublicRemarks}</div>
        <div className="flex gap-8 mt-4">
          {features.map(f => (
            <div key={f.label} className="flex items-center space-x-2">
              <f.icon className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{f.value}</span>
              <span className="text-xs text-slate-500">{f.label}</span>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div>
          <a
            href={`https://${listing.ListingURL?.replace(/^https?:\/\//, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline text-sm"
          >
            View on REALTOR.ca
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
