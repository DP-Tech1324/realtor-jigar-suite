import React, { useEffect, useState } from "react";

interface DDFProperty {
  ListingKey: string;
  PropertySubType: string;
  PublicRemarks: string;
  City: string;
  Media?: { MediaURL: string }[];
  ListingURL?: string;
}

const DDFListings: React.FC = () => {
  const [properties, setProperties] = useState<DDFProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://realtor-jigar-suite-bdod.vercel.app/api/ddf-listings");
        const data = await res.json();
        setProperties(data || []);
      } catch (e) {
        alert("Failed to fetch listings: " + (e as Error).message);
      }
      setLoading(false);
    };
    fetchListings();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Live DDF® Listings</h2>
      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((p) => (
          <div key={p.ListingKey} className="border rounded-lg shadow-md p-4 bg-white">
            {p.Media && p.Media[0]?.MediaURL && (
              <img src={p.Media[0].MediaURL} alt="Property" className="w-full h-48 object-cover rounded mb-2" />
            )}
            <div className="mb-1 text-sm text-gray-600">
              {p.City}
            </div>
            <div className="font-bold">
              {p.PropertySubType || "Property"}
            </div>
            <div className="text-xs mb-2 text-gray-500">
              {p.PublicRemarks?.slice(0, 100)}...
            </div>
            {p.ListingURL && (
              <a
                className="text-blue-700 underline text-xs"
                href={`https://${p.ListingURL.replace(/^https?:\/\//, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on REALTOR.ca
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <a href="https://www.realtor.ca/en" target="_blank" rel="noopener noreferrer">
          <img width="125" src="https://www.realtor.ca/images/en-ca/powered_by_realtor.svg" alt="Powered by REALTOR.ca" />
        </a>
      </div>
    </div>
  );
};

export default DDFListings;
