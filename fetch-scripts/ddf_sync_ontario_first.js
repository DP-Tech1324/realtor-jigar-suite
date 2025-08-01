// ddf_sync_ontario_first.js

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const DDF_CLIENT_ID = process.env.DDF_CLIENT_ID;
const DDF_CLIENT_SECRET = process.env.DDF_CLIENT_SECRET;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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

async function syncDDF() {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error('Failed to retrieve token.');

    const response = await fetch('https://ddfapi.realtor.ca/odata/v1/Property?$top=50', { // Adjust $top as needed
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const json = await response.json();
    const listings = json.value ?? [];

    const validStatuses = [
      'active', 'pending', 'sold', 'leased',
      'for_rent', 'for_sale', 'archived', 'draft', 'off_market'
    ];

    // Map listings and add source: 'ddf'
    const mapped = listings.map((item) => {
      const normalizedStatus = (item.StandardStatus || 'active').toLowerCase().replace(/\s+/g, '_');
      return {
        listing_key: item.ListingKey,
        listing_id: item.ListingId,
        title: item.PropertySubType || 'Untitled',
        description: item.PublicRemarks || '',
        address: item.UnparsedAddress || '',
        city: item.City || '',
        province: item.StateOrProvince || '',
        postal_code: item.PostalCode || '',
        property_type: 'residential',
        home_type: null,
        transaction_type: null,
        bedrooms: item.BedroomsTotal || null,
        bathrooms: item.BathroomsTotalInteger || null,
        square_feet: item.LivingArea || item.AboveGradeFinishedArea || null,
        lot_size: null,
        year_built: item.YearBuilt || null,
        status: validStatuses.includes(normalizedStatus) ? normalizedStatus : 'active',
        is_featured: false,
        days_on_market: null,
        mls_number: item.MlsNumber || item.ListingId,
        features: {},
        images: item.Media?.map(m => m?.MediaURL).filter(Boolean) || [],
        cover_image: item.Media?.[0]?.MediaURL || null,
        latitude: item.Latitude || null,
        longitude: item.Longitude || null,
        listing_url: item.ListingURL || null,
        street_number: item.StreetNumber || null,
        street_name: item.StreetName || null,
        country: item.Country || 'Canada',
        originating_system_name: item.OriginatingSystemName || null,
        standard_status: item.StandardStatus || null,
        photos_count: item.PhotosCount || null,
        status_change_timestamp: item.StatusChangeTimestamp || null,
        modification_timestamp: item.ModificationTimestamp || null,
        above_grade_finished_area: item.AboveGradeFinishedArea || null,
        living_area: item.LivingArea || null,
        media: item.Media || [],
        cooling: item.Cooling || [],
        heating: item.Heating || [],
        water_source: item.WaterSource || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source: 'ddf',
      };
    });

    // Split Ontario and other provinces
    const ontarioListings = mapped.filter(item =>
      (item.province || '').trim().toUpperCase() === 'ON'
    );
    const otherListings = mapped.filter(item =>
      (item.province || '').trim().toUpperCase() !== 'ON'
    );

    // Insert Ontario listings first
    if (ontarioListings.length) {
      const { error: errorON } = await supabase
        .from('listings')
        .upsert(ontarioListings, { onConflict: ['listing_key'] });
      if (errorON) {
        console.error('❌ Error inserting Ontario listings:', errorON.message);
      } else {
        console.log(`✅ Synced ${ontarioListings.length} Ontario listings`);
      }
    } else {
      console.log('ℹ️ No Ontario listings found to sync.');
    }

    // Insert other provinces listings next
    if (otherListings.length) {
      const { error: errorOther } = await supabase
        .from('listings')
        .upsert(otherListings, { onConflict: ['listing_key'] });
      if (errorOther) {
        console.error('❌ Error inserting non-Ontario listings:', errorOther.message);
      } else {
        console.log(`✅ Synced ${otherListings.length} listings from other provinces`);
      }
    } else {
      console.log('ℹ️ No non-Ontario listings found to sync.');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

syncDDF();
