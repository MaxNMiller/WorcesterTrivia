-- Worcester Trivia - Supabase schema
--
-- Run this once in Supabase Dashboard > SQL Editor on a fresh project.
-- Creates the two tables non-technical editors will maintain via
-- Supabase Studio's Table Editor (a spreadsheet-like grid), locks them
-- down with Row Level Security so the app's public anon key can only
-- ever read (never write), and seeds the 8 starter questions so the
-- database starts in sync with the app's bundled fallback data
-- (src/data/fallbackQuestions.ts).
--
-- Already ran an earlier version of this file? Don't re-run it - apply
-- supabase/migrations/002_*.sql and then 003_*.sql instead.

create extension if not exists pgcrypto; -- for gen_random_uuid()

create table if not exists categories (
  key text primary key,
  name text not null,
  color_hex text not null,
  icon_name text not null,
  sort_order int not null default 0
);

create type answer_letter as enum ('A', 'B', 'C', 'D', 'E');

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  category_key text not null references categories(key),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  option_e text,          -- optional fifth choice; leave empty for 4-option questions
  correct_option answer_letter not null,
  explanation text,       -- "Did you know?" blurb shown after answering
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

-- Seed data: the 6 categories and 8 starter questions, matching
-- src/data/fallbackQuestions.ts exactly.
insert into categories (key, name, color_hex, icon_name, sort_order) values
  ('culture', 'Culture, Recreation & Education', '#C73A80', 'Palette', 1),
  ('potpourri', 'Potpourri', '#7349B8', 'Sparkles', 2),
  ('history', 'History', '#F4CF3A', 'Landmark', 3),
  ('famous', 'Famous People & Events', '#7DB33F', 'Users', 4),
  ('geography', 'Geography', '#2A6FBA', 'Globe', 5),
  ('business', 'Business & Industry', '#EE7A2E', 'Briefcase', 6)
on conflict (key) do nothing;

insert into questions (category_key, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation) values
  ('culture', 'What Worcester-born, well-known, multi-instrumental musician, arranger, and composer was the subject of the short documentary film Anything for Jazz?', 'Duke Ellington', 'John Coltrane', 'Jaki Byard', 'Charlie Parker', 'Ornette Coleman', 'C', 'Jaki Byard was born in Worcester in 1922 and could play piano, saxophone, trumpet, and more. He recorded with Charles Mingus, Eric Dolphy, and Roland Kirk, and taught for years at the New England Conservatory. The 1980 short documentary Anything for Jazz is a portrait of him.'),
  ('potpourri', 'Which Worcester restaurant was visited by celebrities including Al Pacino, Rodney Dangerfield, Frank Sinatra, and Bette Midler?', 'Pilgrim Oyster House', 'Aku-Aku', 'The Odyssey', 'Rovezzi''s', 'El Morocco', 'E', 'El Morocco, a Lebanese-American restaurant on a hill off Wall Street, was a Worcester institution for decades. Stars performing in central Massachusetts made a point of stopping in for dinner.'),
  ('history', 'In what year was Worcester officially incorporated as a city?', '1848', '1776', '1900', '1620', null, 'A', 'Worcester was incorporated as a town in 1722. By the 1840s, the canal, the railroads, and new factories had grown its population so quickly that it received a city charter in 1848.'),
  ('history', 'Worcester printer and Revolutionary War figure Isaiah Thomas founded which historical society still headquartered in the city?', 'American Antiquarian Society', 'Massachusetts Historical Society', 'Smithsonian Institution', 'National Archives', null, 'A', 'Isaiah Thomas founded the American Antiquarian Society in 1812, starting with his own collection of books and newspapers. Today its library on Salisbury Street holds one of the largest collections of early American printed material in the world.'),
  ('history', 'What is the name of the catastrophic February 1978 snowstorm that paralyzed Worcester and New England?', 'The Blizzard of ''78', 'Hurricane Carol', 'The Great Ice Storm', 'Snowmageddon', null, 'A', 'The Blizzard of ''78 dropped more than two feet of snow on much of southern New England. Thousands of drivers were stranded on the highways, and Governor Michael Dukakis banned non-emergency travel for days while crews dug out.'),
  ('famous', 'What U.S. President delivered commencement addresses at both Clark University and the College of the Holy Cross?', 'Teddy Roosevelt', 'Bill Clinton', 'Dwight D. Eisenhower', 'Woodrow Wilson', 'Harry S. Truman', 'A', 'Theodore Roosevelt gave both commencement addresses in June 1905, on a single visit to Worcester while he was serving as president.'),
  ('geography', 'In 1929, the Salisbury Mansion was moved from which Worcester location to its current home on Highland Street in Worcester?', 'Tatnuck Square', 'Lincoln Square', 'Newton Square', 'Federal Square', 'Kelley Square', 'B', 'Merchant Stephen Salisbury built the mansion in 1772 next to his store in Lincoln Square. It was moved to Highland Street in 1929, and today it is a historic house museum run by the Museum of Worcester.'),
  ('business', 'On April 16, 1841, Loring Coes was granted a patent for what Worcester invention that is now found in nearly everyone''s toolbox?', 'Phillips head screwdriver', 'Flat nose pliers', 'Claw hammer', 'Monkey wrench', 'Coping saw', 'D', 'Loring Coes patented an adjustable screw wrench that could be fitted to nuts of many sizes. He and his brother Aury built the Coes Wrench Company around it, and Coes wrenches were made in Worcester for generations.');
