-- What kind of request each website inquiry is, so the admin can tell a showing booking from
-- a general question, plus the showing date/time the visitor asked for.
--   inquiry_type: showing | info | vastu | pre-construction | buying | selling | renting |
--                 commercial | general   (set by the website form; free text so new forms
--                 don't need a migration)
--   preferred_date / preferred_time: Book a Showing only
--   page_url: the page the visitor sent it from

alter table public.inquiries
  add column if not exists inquiry_type text not null default 'general',
  add column if not exists preferred_date date,
  add column if not exists preferred_time text,
  add column if not exists page_url text;

-- Keep visitor input to sane sizes
alter table public.inquiries drop constraint if exists inquiries_inquiry_type_len;
alter table public.inquiries add constraint inquiries_inquiry_type_len check (char_length(inquiry_type) <= 40);
alter table public.inquiries drop constraint if exists inquiries_preferred_time_len;
alter table public.inquiries add constraint inquiries_preferred_time_len check (char_length(preferred_time) <= 20);
alter table public.inquiries drop constraint if exists inquiries_page_url_len;
alter table public.inquiries add constraint inquiries_page_url_len check (char_length(page_url) <= 500);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
