import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

serve(async () => {
  const auth = btoa(`${Deno.env.get("DDF_USERNAME")}:${Deno.env.get("DDF_PASSWORD")}`);
  const res = await fetch("https://api.ddfapi.realtor.ca/odata/v1/Property", {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });

  const json = await res.json();
  const listings = json?.value ?? [];

  const mapped = listings.map((item: any) => ({
    id: item.ListingKey.toString(),
    title: item.Building?.Type || "Untitled",
    description: item.PublicRemarks || "",
    address: item.Address?.AddressText || "",
    city: item.Address?.City || "",
    province: item.Address?.Province || "",
    postal_code: item.Address?.PostalCode,
    price: item.Price || 0,
    property_type: item.PropertyType?.replace(/\s/g, "_").toLowerCase() || "residential",
    bedrooms: item.Building?.BedroomsTotal || 0,
    bathrooms: item.Building?.BathroomsTotal || 0,
    square_footage: item.Building?.SizeInterior || 0,
    images: (item.PropertyPhoto ?? []).map((p: any) => p?.LargePhotoURL).filter(Boolean),
    status: item.Status || "active",
    mls_number: item.MlsNumber,
    year_built: item.Building?.YearBuilt,
    lot_size: parseFloat(item.Land?.SizeTotal) || undefined,
    latitude: item.Latitude,
    longitude: item.Longitude,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
console.log("Fetched listings count:", listings.length);
console.log("Mapped listings example:", mapped[0])
  const { error } = await supabase
  .from("listings")
  .upsert(mapped, { onConflict: ["id"] });

if (error) {
  console.error("Supabase insert error:", error);
  return new Response(JSON.stringify({ message: "Insert failed", details: error.message }), {
    status: 500,
  });
}
});
