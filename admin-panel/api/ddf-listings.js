// realtor-jigar-suite-bdod.vercel.app/api/ddf-listings.js

export default async function handler(req, res) {
  const accessToken = process.env.DDF_ACCESS_TOKEN; // Set this in Vercel → Project Settings → Environment Variables
  const DDF_URL = "https://ddfapi.realtor.ca/odata/v1/Property?$top=10";

  try {
    const apiRes = await fetch(DDF_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: "Failed to fetch DDF listings", detail: await apiRes.text() });
    }

    const data = await apiRes.json();
    return res.status(200).json(data.value);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
