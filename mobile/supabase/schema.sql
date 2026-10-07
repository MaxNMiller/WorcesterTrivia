-- Worcester Trivia - Supabase schema
--
-- Run this once in Supabase Dashboard > SQL Editor on a fresh project.
-- Creates the two tables non-technical editors will maintain via
-- Supabase Studio's Table Editor (a spreadsheet-like grid), locks them
-- down with Row Level Security so the app's public anon key can only
-- ever read (never write), and seeds the 18 starter questions so the
-- database starts in sync with the app's bundled fallback data
-- (src/data/fallbackQuestions.ts).

create extension if not exists pgcrypto; -- for gen_random_uuid()

create table if not exists categories (
  key text primary key,
  name text not null,
  color_hex text not null,
  icon_name text not null,
  sort_order int not null default 0
);

create type answer_letter as enum ('A', 'B', 'C', 'D');

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  category_key text not null references categories(key),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option answer_letter not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: the app's anon key gets read-only access.
-- Non-technical editors get write access by logging into Supabase Studio
-- with their own invited project account (Editor role), NOT via the app.
alter table categories enable row level security;
alter table questions enable row level security;

create policy "Public read access" on categories
  for select using (true);

create policy "Public read access (active only)" on questions
  for select using (is_active = true);

-- Keep updated_at current on every edit, so editors (and the app, if it
-- ever needs it) can see when a question last changed.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger questions_set_updated_at
  before update on questions
  for each row
  execute function set_updated_at();

-- Seed data: the 6 categories and 18 starter questions, matching
-- src/data/fallbackQuestions.ts exactly.
insert into categories (key, name, color_hex, icon_name, sort_order) values
  ('culture', 'Culture, Recreation & Education', '#f472b6', 'Palette', 1),
  ('potpourri', 'Potpourri', '#8b4513', 'Sparkles', 2),
  ('history', 'History', '#facc15', 'Landmark', 3),
  ('famous', 'Famous People & Events', '#22c55e', 'Users', 4),
  ('geography', 'Geography', '#3b82f6', 'Globe', 5),
  ('business', 'Business & Industry', '#f97316', 'Briefcase', 6)
on conflict (key) do nothing;

insert into questions (category_key, question, option_a, option_b, option_c, option_d, correct_option) values
  ('culture', 'College of the Holy Cross, a Jesuit liberal arts college founded in 1843, sits atop which Worcester hill?', 'Mount St. James', 'Bancroft Hill', 'Chandler Hill', 'Green Hill', 'A'),
  ('culture', 'In 1909, Sigmund Freud delivered his only lectures in the United States at which Worcester university?', 'Clark University', 'Worcester State University', 'Assumption University', 'Anna Maria College', 'A'),
  ('culture', 'With land purchases beginning in 1854, which Worcester park is considered one of the first in the U.S. acquired with public funds?', 'Elm Park', 'Green Hill Park', 'Institute Park', 'Newton Hill', 'A'),
  ('potpourri', 'In 1963, Worcester graphic artist Harvey Ball designed which now-famous image for an insurance company?', 'The smiley face', 'The peace sign', 'The recycling symbol', 'The thumbs-up icon', 'A'),
  ('potpourri', 'Worcester native Esther Howland is known as the "Mother of the American" what, for pioneering mass-produced greeting cards in the 1840s?', 'Valentine', 'Christmas card', 'Postcard', 'Birthday card', 'A'),
  ('potpourri', 'Thanks to its central location within Massachusetts, Worcester is nicknamed the:', 'Heart of the Commonwealth', 'Hub of the Universe', 'Gateway City', 'City of Champions', 'A'),
  ('history', 'In what year was Worcester officially incorporated as a city?', '1848', '1776', '1900', '1620', 'A'),
  ('history', 'Worcester printer and Revolutionary War figure Isaiah Thomas founded which historical society still headquartered in the city?', 'American Antiquarian Society', 'Massachusetts Historical Society', 'Smithsonian Institution', 'National Archives', 'A'),
  ('history', 'What is the name of the catastrophic February 1978 snowstorm that paralyzed Worcester and New England?', 'The Blizzard of ''78', 'Hurricane Carol', 'The Great Ice Storm', 'Snowmageddon', 'A'),
  ('famous', 'Worcester-born Robert H. Goddard, the father of modern rocketry, launched the first liquid-fueled rocket in 1926 in which nearby town?', 'Auburn', 'Shrewsbury', 'Leicester', 'Holden', 'A'),
  ('famous', 'Worcester-born activist Abbie Hoffman co-founded which 1960s countercultural political group?', 'The Yippies (Youth International Party)', 'The Black Panthers', 'Students for a Democratic Society', 'The Weather Underground', 'A'),
  ('famous', 'In 1850, Worcester hosted the first national convention dedicated to which cause?', 'Women''s rights', 'Abolition of slavery', 'Labor unions', 'Temperance', 'A'),
  ('geography', 'As the crow flies, roughly how far is Worcester from Boston?', 'About 40 miles', 'About 90 miles', 'About 120 miles', 'About 15 miles', 'A'),
  ('geography', 'Which lake forms part of Worcester''s eastern border with Shrewsbury and hosts collegiate rowing regattas?', 'Lake Quinsigamond', 'Lake Winnipesaukee', 'Walden Pond', 'Indian Lake', 'A'),
  ('geography', 'Worcester''s hilly terrain has earned it a comparison to Rome for being built across how many hills?', 'Seven', 'Three', 'Twelve', 'Five', 'A'),
  ('business', 'Due to 19th-century wire manufacturers like Washburn & Moen, Worcester earned which industrial nickname?', 'The Wire City', 'The Steel City', 'Nail City', 'The Iron Capital', 'A'),
  ('business', 'Founded in Worcester in 1882 and still headquartered there, which company is famous for ginger ale and seltzer?', 'Polar Beverages', 'Moxie', 'Coca-Cola', 'Nantucket Nectars', 'A'),
  ('business', 'Table Talk Pies, famous for individually-wrapped snack pies, was founded in Worcester in what year?', '1924', '1899', '1950', '1975', 'A');
