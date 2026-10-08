-- Migration 003: option_e + "Did you know?" explanations, the new brand
-- category colors, and the new question set.
--
-- Run once in Supabase Dashboard > SQL Editor, AFTER 002 has run.

alter table questions add column if not exists option_e text;
alter table questions add column if not exists explanation text;

-- New brand palette for the category tiles and wedges.
update categories set color_hex = '#C73A80' where key = 'culture';
update categories set color_hex = '#7349B8' where key = 'potpourri';
update categories set color_hex = '#F4CF3A' where key = 'history';
update categories set color_hex = '#7DB33F' where key = 'famous';
update categories set color_hex = '#2A6FBA' where key = 'geography';
update categories set color_hex = '#EE7A2E' where key = 'business';

-- Retire the original starter questions (hidden from the app, not deleted)
-- except History, which keeps its three questions and gains explanations.
update questions set is_active = false
where category_key <> 'history'
  and question in (
    'College of the Holy Cross, a Jesuit liberal arts college founded in 1843, sits atop which Worcester hill?',
    'In 1909, Sigmund Freud delivered his only lectures in the United States at which Worcester university?',
    'With land purchases beginning in 1854, which Worcester park is considered one of the first in the U.S. acquired with public funds?',
    'In 1963, Worcester graphic artist Harvey Ball designed which now-famous image for an insurance company?',
    'Worcester native Esther Howland is known as the "Mother of the American" what, for pioneering mass-produced greeting cards in the 1840s?',
    'Thanks to its central location within Massachusetts, Worcester is nicknamed the:',
    'Worcester-born Robert H. Goddard, the father of modern rocketry, launched the first liquid-fueled rocket in 1926 in which nearby town?',
    'Worcester-born activist Abbie Hoffman co-founded which 1960s countercultural political group?',
    'In 1850, Worcester hosted the first national convention dedicated to which cause?',
    'As the crow flies, roughly how far is Worcester from Boston?',
    'Which lake forms part of Worcester''s eastern border with Shrewsbury and hosts collegiate rowing regattas?',
    'Worcester''s hilly terrain has earned it a comparison to Rome for being built across how many hills?',
    'Due to 19th-century wire manufacturers like Washburn & Moen, Worcester earned which industrial nickname?',
    'Founded in Worcester in 1882 and still headquartered there, which company is famous for ginger ale and seltzer?',
    'Table Talk Pies, famous for individually-wrapped snack pies, was founded in Worcester in what year?'
  );

update questions set explanation = 'Worcester was incorporated as a town in 1722. By the 1840s, the canal, the railroads, and new factories had grown its population so quickly that it received a city charter in 1848.'
where category_key = 'history' and question = 'In what year was Worcester officially incorporated as a city?';

update questions set explanation = 'Isaiah Thomas founded the American Antiquarian Society in 1812, starting with his own collection of books and newspapers. Today its library on Salisbury Street holds one of the largest collections of early American printed material in the world.'
where category_key = 'history' and question = 'Worcester printer and Revolutionary War figure Isaiah Thomas founded which historical society still headquartered in the city?';

update questions set explanation = 'The Blizzard of ''78 dropped more than two feet of snow on much of southern New England. Thousands of drivers were stranded on the highways, and Governor Michael Dukakis banned non-emergency travel for days while crews dug out.'
where category_key = 'history' and question = 'What is the name of the catastrophic February 1978 snowstorm that paralyzed Worcester and New England?';

insert into questions (category_key, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation) values
  ('culture', 'What Worcester-born, well-known, multi-instrumental musician, arranger, and composer was the subject of the short documentary film Anything for Jazz?', 'Duke Ellington', 'John Coltrane', 'Jaki Byard', 'Charlie Parker', 'Ornette Coleman', 'C', 'Jaki Byard was born in Worcester in 1922 and could play piano, saxophone, trumpet, and more. He recorded with Charles Mingus, Eric Dolphy, and Roland Kirk, and taught for years at the New England Conservatory. The 1980 short documentary Anything for Jazz is a portrait of him.'),
  ('potpourri', 'Which Worcester restaurant was visited by celebrities including Al Pacino, Rodney Dangerfield, Frank Sinatra, and Bette Midler?', 'Pilgrim Oyster House', 'Aku-Aku', 'The Odyssey', 'Rovezzi''s', 'El Morocco', 'E', 'El Morocco, a Lebanese-American restaurant on a hill off Wall Street, was a Worcester institution for decades. Stars performing in central Massachusetts made a point of stopping in for dinner.'),
  ('famous', 'What U.S. President delivered commencement addresses at both Clark University and the College of the Holy Cross?', 'Teddy Roosevelt', 'Bill Clinton', 'Dwight D. Eisenhower', 'Woodrow Wilson', 'Harry S. Truman', 'A', 'Theodore Roosevelt gave both commencement addresses in June 1905, on a single visit to Worcester while he was serving as president.'),
  ('geography', 'In 1929, the Salisbury Mansion was moved from which Worcester location to its current home on Highland Street in Worcester?', 'Tatnuck Square', 'Lincoln Square', 'Newton Square', 'Federal Square', 'Kelley Square', 'B', 'Merchant Stephen Salisbury built the mansion in 1772 next to his store in Lincoln Square. It was moved to Highland Street in 1929, and today it is a historic house museum run by the Museum of Worcester.'),
  ('business', 'On April 16, 1841, Loring Coes was granted a patent for what Worcester invention that is now found in nearly everyone''s toolbox?', 'Phillips head screwdriver', 'Flat nose pliers', 'Claw hammer', 'Monkey wrench', 'Coping saw', 'D', 'Loring Coes patented an adjustable screw wrench that could be fitted to nuts of many sizes. He and his brother Aury built the Coes Wrench Company around it, and Coes wrenches were made in Worcester for generations.');
