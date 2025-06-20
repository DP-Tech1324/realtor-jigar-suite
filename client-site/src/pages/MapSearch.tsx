import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { supabase } from "@/integrations/supabase/client";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 43.6532, lng: -79.3832 }; // Toronto

export default function MapSearch() {
  // ⬇️ USE ENV VARIABLE! (Vite format shown)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [filters, setFilters] = useState({ city: "", type: "" });
  const mapRef = useRef<any>(null);

  // Load all properties
  useEffect(() => {
    async function fetchProperties() {
      const { data } = await supabase
        .from("listings")
        .select("id,title,address,city,province,latitude,longitude,price,bedrooms,bathrooms,cover_image,property_type,mls_number,description");
      setProperties(data || []);
      setFiltered(data || []);
    }
    fetchProperties();
  }, []);

  // Filter properties
  useEffect(() => {
    let result = [...properties];
    if (filters.city)
      result = result.filter((p) =>
        p.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    if (filters.type)
      result = result.filter(
        (p) => (p.property_type || "").toLowerCase() === filters.type.toLowerCase()
      );
    setFiltered(result);
  }, [filters, properties]);

  // Scroll to and highlight card when marker clicked
  const handleMarkerClick = (prop: any) => {
    setSelected(prop);
    document.getElementById(`card-${prop.id}`)?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <div className="flex h-[calc(100vh-110px)] bg-white relative">
      {/* Left: Map */}
      <div className="flex-1 min-w-[350px] flex flex-col">
        <h2 className="text-xl font-bold mb-2 px-4 pt-4">Map Search</h2>
        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-2 mb-2 px-4">
          <input
            placeholder="City"
            className="border px-2 py-1 rounded"
            value={filters.city}
            onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          />
          <select
            className="border px-2 py-1 rounded"
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="condo">Condo</option>
            <option value="detached">Detached</option>
            <option value="industrial">Industrial</option>
            <option value="vacant land">Vacant Land</option>
            {/* Add more types as needed */}
          </select>
        </div>
        <div className="flex-1">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={map => { mapRef.current = map; }}
            >
              {filtered
                .filter(p => p.latitude && p.longitude)
                .map((prop) => (
                  <Marker
                    key={prop.id}
                    position={{ lat: prop.latitude, lng: prop.longitude }}
                    onClick={() => handleMarkerClick(prop)}
                    icon={selected && selected.id === prop.id
                      ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                      : undefined}
                  />
                ))}
            </GoogleMap>
          )}
        </div>
      </div>

      {/* Right: Property List */}
      <div className="w-[420px] min-w-[320px] max-w-[480px] border-l bg-white flex flex-col h-full">
        <h2 className="text-xl font-bold mb-2 p-4 border-b">Properties</h2>
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.map((prop) => (
            <div
              key={prop.id}
              id={`card-${prop.id}`}
              className={`flex border rounded shadow p-2 gap-3 mb-3 hover:bg-blue-50 cursor-pointer ${
                selected && selected.id === prop.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => {
                setSelected(prop);
                if (mapRef.current) {
                  mapRef.current.panTo({ lat: prop.latitude, lng: prop.longitude });
                  mapRef.current.setZoom(14);
                }
              }}
            >
              <img
                src={prop.cover_image || "https://via.placeholder.com/130x90.png?text=No+Image"}
                alt={prop.title}
                className="w-[130px] h-[90px] object-cover rounded"
              />
              <div>
                <div className="font-semibold">{prop.title}</div>
                <div className="text-blue-700 font-bold">
                  {prop.price ? `$${Number(prop.price).toLocaleString()}` : ""}
                </div>
                <div className="text-sm">{prop.address}, {prop.city}</div>
                <div className="text-xs mt-1">{prop.bedrooms} beds | {prop.bathrooms} baths</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-slate-400">No listings found.</div>
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col overflow-y-auto">
          <PropertyDetailsModal listing={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
