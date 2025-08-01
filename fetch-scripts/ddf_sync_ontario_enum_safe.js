// ddf_sync_ontario_enum_safe.js
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// ---------------------------
//      SETTINGS AREA
// ---------------------------

// How many listings to fetch max? Change this to control limit.
const MAX_LISTINGS = 2000; // <--- SET YOUR MAX HERE

// Province to sync. Use 'Ontario', 'Quebec', etc. (as shown in DDF API, full name).
const PROVINCE = 'Ontario';

// DDF API batch size. 100 is safe for most APIs. Can raise/lower if needed.
const BATCH_SIZE = 100;

// ---------------------------

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const DDF_CLIENT_ID = process.env.DDF_CLIENT_ID;
const DDF_CLIENT_SECRET = process.env.DDF_CLIENT_SECRET;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SERVICE_ROLE_KEY:", process.env.SERVICE_ROLE_KEY);

// --- ENUM MAPPING HELPERS ---
// These make sure DDF values match your DB enums. Update if your DB changes!
const allowedPropertyTypes = [
  'residential', 'condo', 'townhouse', 'semi-detached', 'detached', 'commercial', 'land',
  'multi-family', 'new_construction', 'other', 'vacant_land'
];
function mapPropertyType(propertyType, subType) {
  const src = ((propertyType || '') + ' ' + (subType || '')).toLowerCase();
  if (src.includes('condo')) return 'condo';
  if (src.includes('townhouse')) return 'townhouse';
  if (src.includes('semi')) return 'semi-detached';
  if (src.includes('detached')) return 'detached';
  if (src.includes('land')) return src.includes('vacant') ? 'vacant_land' : 'land';
  if (src.includes('commercial')) return 'commercial';
  if (src.includes('multi')) return 'multi-family';
  if (src.includes('new')) return 'new_construction';
  if (src.includes('residential')) return 'residential';
  return allowedPropertyTypes.includes(src.trim()) ? src.trim() : 'other';
}

const allowedHomeTypes = [
  'bungalow','apartment','loft','penthouse','duplex','triplex','fourplex','other',
  'condo','detached','semi-detached','townhouse','estate'
];
function mapHomeType(subType) {
  if (!subType) return null;
  const type = subType.toLowerCase();
  for (const home of allowedHomeTypes) {
    if (type.includes(home)) return home;
  }
  return 'other';
}

const allowedStatuses = [
  'active', 'pending', 'sold', 'leased', 'for_rent', 'for_sale', 'archived', 'draft', 'off_market'
];
function mapStatus(status) {
  if (!status) return 'active';
  const s = status.toLowerCase().replace(/\s/g, '_');
  return allowedStatuses.includes(s) ? s : 'active';
}

// --- END ENUM HELPERS ---

// --- DDF AUTH TOKEN ---
async function getAccessToken() {
  const res = await fetch('https://identity.crea.ca/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: DDF_CLIENT_ID,
      client_secret: DDF_CLIENT_SECRET,
      scope: 'DDFApi_Read',
    }),
  });

  const data = await res.json();
  return data.access_token;
}

// --- FETCH ALL PROPERTIES (ONTARIO/PROVINCE, WITH PAGINATION AND LIMIT) ---
async function fetchAllProvinceListings() {
  const listings = [];
  let skip = 0;
  let keepFetching = true;

  const token = await getAccessToken();
  if (!token) throw new Error('Failed to retrieve token.');

  // Loop, fetching BATCH_SIZE listings per API call, until limit reached or no more data.
  while (keepFetching && listings.length < MAX_LISTINGS) {
    // Prepare DDF filter
    const filter = encodeURIComponent(`StateOrProvince eq '${PROVINCE}'`);
    const url = `https://ddfapi.realtor.ca/odata/v1/Property?$filter=${filter}&$top=${BATCH_SIZE}&$skip=${skip}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const json = await response.json();
    const batch = json.value ?? [];
    listings.push(...batch);

    console.log(`Fetched ${batch.length} ${PROVINCE} listings (so far: ${listings.length})`);

    // Stop if API returns less than a full batch, or we've hit our own max limit.
    if (batch.length < BATCH_SIZE || listings.length >= MAX_LISTINGS) {
      keepFetching = false;
    } else {
      skip += BATCH_SIZE;
    }
  }

  // Enforce exact limit in case last batch overflowed.
  return listings.slice(0, MAX_LISTINGS);
}

// --- MAIN SYNC FUNCTION ---
async function syncAllProvinceListings() {
  try {
    const listings = await fetchAllProvinceListings();

    if (!listings.length) {
      console.log(`ℹ️ No ${PROVINCE} listings found.`);
      return;
    }

    // Map to DB schema with safe enums
    const mapped = listings
      .map((item) => {
        // REQUIRE all not null fields
        const title = item.PropertySubType || 'Untitled';
        const address = item.UnparsedAddress || '';
        const city = item.City || '';
        const province = item.StateOrProvince || '';
        // Map to enums
        const property_type = mapPropertyType(item.PropertyType, item.PropertySubType);
        const home_type = mapHomeType(item.PropertySubType);
        const status = mapStatus(item.StandardStatus);

        // If missing required field, skip!
        if (!title || !address || !city || !province || !property_type) {
          return null;
        }
        return {
          title,
          description: item.PublicRemarks || '',
          price: item.ListPrice || null,
          address,
          city,
          province,
          postal_code: item.PostalCode || null,
          property_type,
          home_type,
          transaction_type: null,
          bedrooms: item.BedroomsTotal || null,
          bathrooms: item.BathroomsTotalInteger || null,
          square_feet: item.LivingArea || item.AboveGradeFinishedArea || null,
          lot_size: null,
          year_built: item.YearBuilt || null,
          status,
          is_featured: false,
          days_on_market: null,
          mls_number: item.MlsNumber || item.ListingId,
          features: {},
          images: item.Media?.map(m => m?.MediaURL).filter(Boolean) || [],
          brochure_url: null,
          latitude: item.Latitude || null,
          longitude: item.Longitude || null,
          cover_image: item.Media?.[0]?.MediaURL || null,
          meta_keywords: null,
          seo_title: null,
          seo_description: null,
          virtual_tour_url: null,
          agent_id: null,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          listing_key: item.ListingKey,
          listing_id: item.ListingId,
          street_number: item.StreetNumber || null,
          street_name: item.StreetName || null,
          country: item.Country || 'Canada',
          originating_system_name: item.OriginatingSystemName || null,
          standard_status: item.StandardStatus || null,
          listing_url: item.ListingURL || null,
          photos_count: item.PhotosCount || null,
          status_change_timestamp: item.StatusChangeTimestamp || null,
          modification_timestamp: item.ModificationTimestamp || null,
          above_grade_finished_area: item.AboveGradeFinishedArea || null,
          living_area: item.LivingArea || null,
          media: item.Media || [],
          cooling: item.Cooling || [],
          heating: item.Heating || [],
          water_source: item.WaterSource || [],
          source: 'ddf',
        };
      })
      .filter(Boolean); // Remove any skipped/invalid rows

    if (!mapped.length) {
      console.log(`No valid ${PROVINCE} listings after mapping.`);
      return;
    }

    // Insert in batches to avoid hitting Supabase limits
    let inserted = 0;
    for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
      const batch = mapped.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('ddf_listings').upsert(batch, { onConflict: ['listing_key'] });

      if (error) {
        console.error(`❌ Error inserting batch ${i / BATCH_SIZE + 1}:`, error.message, error.details || '');
        console.dir(batch[0], { depth: 2 });
        process.exit(1);
      } else {
        inserted += batch.length;
        console.log(`✅ Synced ${inserted}/${mapped.length} ${PROVINCE} listings`);
      }
    }
    // 1. Call the SQL function to sync to your main table
const { error: syncError } = await supabase.rpc('sync_ddf_to_listings');
if (syncError) {
  console.error('❌ Error syncing to main listings table:', syncError.message);
} else {
  console.log("✅ Main listings table synced via function!");
}
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// --- RUN THE SCRIPT ---
syncAllProvinceListings();

/*
--- USAGE NOTES ---
- To change the province, set the PROVINCE constant.
- To change how many listings you want, set MAX_LISTINGS.
- To adjust API batch size, change BATCH_SIZE (100 is safe).
- Script is idempotent: rerunning will not create duplicates due to upsert.
- For any mapping, update the mapping helpers at the top.
*/
