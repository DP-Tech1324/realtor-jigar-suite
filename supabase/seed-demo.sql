-- Optional demo listings for testing the site end to end (search, Vastu filter,
-- property page). Titles start with [DEMO]; delete them before going live:
--   delete from public.listings where title like '[DEMO]%';

insert into public.listings
  (title, description, address, city, province, postal_code, price, property_type, transaction_type,
   bedrooms, bathrooms, square_footage, year_built, images, status, is_featured,
   facing, vastu, vastu_score, seo_title, meta_keywords)
values
  ('[DEMO] East-facing detached home', 'Demo listing for testing. Replace with a real property.',
   '1 Demo Street', 'Brampton', 'ON', 'L6Y 0A1', 1249000, 'single_family', 'sale',
   4, 3.5, 2600, 2016,
   array['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80'],
   'active', true, 'E',
   '{"enabled": true, "zones": {"NE": "pooja", "N": "living", "E": "study", "SE": "kitchen", "SW": "master_bedroom", "S": "staircase", "W": "dining", "NW": "bathroom", "C": "open"}, "plot_shape": "rectangle", "notes": "Demo Vastu notes."}',
   10, '[DEMO] East-facing 4 bed home in Brampton', 'vastu compliant home Brampton, east facing house Brampton'),

  ('[DEMO] North-facing townhouse', 'Demo listing for testing. Replace with a real property.',
   '2 Demo Avenue', 'Mississauga', 'ON', 'L5M 0A1', 899000, 'townhouse', 'sale',
   3, 2.5, 1800, 2012,
   array['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'],
   'active', true, 'N',
   '{"enabled": true, "zones": {"NE": "living", "SE": "kitchen", "SW": "master_bedroom", "NW": "bathroom", "C": "living"}, "plot_shape": "rectangle"}',
   9, null, null),

  ('[DEMO] South-facing condo for rent', 'Demo listing for testing. Replace with a real property.',
   '3 Demo Road, Unit 1204', 'Toronto', 'ON', 'M5V 0A1', 2900, 'condo', 'rent',
   2, 2, 900, 2019,
   array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'],
   'active', false, 'S',
   '{"enabled": true, "zones": {"NE": "bathroom", "SE": "bedroom", "SW": "kitchen"}}',
   0, null, null);
