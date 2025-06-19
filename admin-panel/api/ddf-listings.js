export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://realtor-jigar-suite.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const accessToken = process.env.DDF_ACCESS_TOKEN;

  // Build filter string from query params
  let filters = [];
  const { city, address, postal_code, mls, type, price, homeType, saleType, beds, baths, propertyType, sqft, daysOnMarket, showOnly, keywords } = req.query;

  if (city) filters.push(`City eq '${city}'`);
  if (address) filters.push(`Address eq '${address}'`);
  if (postal_code) filters.push(`PostalCode eq '${postal_code}'`);
  if (mls) filters.push(`MlsNumber eq '${mls}'`);
  if (type) filters.push(`PropertyType eq '${type.charAt(0).toUpperCase() + type.slice(1)}'`);
  if (beds) filters.push(`BedroomsTotal ge ${beds}`);
  if (baths) filters.push(`BathroomsTotalInteger ge ${baths}`);
  // Add more filters as needed (see DDF® API docs for exact field names)

  // Build OData $filter string
  let filterString = filters.length > 0 ? `?$filter=${filters.join(' and ')}` : '';
  let topString = filterString ? '&$top=12' : '?$top=12'; // Always limit results

  const DDF_URL = `https://ddfapi.realtor.ca/odata/v1/Property${filterString}${topString}`;

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
