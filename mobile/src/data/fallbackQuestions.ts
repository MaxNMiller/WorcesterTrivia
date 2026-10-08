/**
 * Bundled fallback data, in the exact same shape as the Supabase
 * `categories` / `questions` tables (see supabase/schema.sql - this is
 * also the file's seed `insert` data, so a fresh Supabase project starts
 * in sync with what ships inside the app).
 *
 * Used by questionsService.loadGameData() when there's no network AND no
 * previously-cached sync yet (e.g. a brand new install with no Wi-Fi) -
 * so the game is always playable, even before the first successful sync.
 */
import type { CategoryRow, QuestionRow } from "../types/trivia";

export const fallbackCategories: CategoryRow[] = [
  { key: "culture", name: "Culture, Recreation & Education", color_hex: "#C73A80", icon_name: "Palette", sort_order: 1 },
  { key: "potpourri", name: "Potpourri", color_hex: "#7349B8", icon_name: "Sparkles", sort_order: 2 },
  { key: "history", name: "History", color_hex: "#F4CF3A", icon_name: "Landmark", sort_order: 3 },
  { key: "famous", name: "Famous People & Events", color_hex: "#7DB33F", icon_name: "Users", sort_order: 4 },
  { key: "geography", name: "Geography", color_hex: "#2A6FBA", icon_name: "Globe", sort_order: 5 },
  { key: "business", name: "Business & Industry", color_hex: "#EE7A2E", icon_name: "Briefcase", sort_order: 6 },
];

export const fallbackQuestions: QuestionRow[] = [
  // Culture, Recreation & Education
  {
    id: "culture-1",
    category_key: "culture",
    question: "What Worcester-born, well-known, multi-instrumental musician, arranger, and composer was the subject of the short documentary film Anything for Jazz?",
    option_a: "Duke Ellington",
    option_b: "John Coltrane",
    option_c: "Jaki Byard",
    option_d: "Charlie Parker",
    option_e: "Ornette Coleman",
    correct_option: "C",
    explanation: "Jaki Byard was born in Worcester in 1922 and could play piano, saxophone, trumpet, and more. He recorded with Charles Mingus, Eric Dolphy, and Roland Kirk, and taught for years at the New England Conservatory. The 1980 short documentary Anything for Jazz is a portrait of him.",
    is_active: true,
  },
  // Potpourri
  {
    id: "potpourri-1",
    category_key: "potpourri",
    question: "Which Worcester restaurant was visited by celebrities including Al Pacino, Rodney Dangerfield, Frank Sinatra, and Bette Midler?",
    option_a: "Pilgrim Oyster House",
    option_b: "Aku-Aku",
    option_c: "The Odyssey",
    option_d: "Rovezzi's",
    option_e: "El Morocco",
    correct_option: "E",
    explanation: "El Morocco, a Lebanese-American restaurant on a hill off Wall Street, was a Worcester institution for decades. Stars performing in central Massachusetts made a point of stopping in for dinner.",
    is_active: true,
  },
  // History
  {
    id: "history-1",
    category_key: "history",
    question: "In what year was Worcester officially incorporated as a city?",
    option_a: "1848",
    option_b: "1776",
    option_c: "1900",
    option_d: "1620",
    option_e: null,
    correct_option: "A",
    explanation: "Worcester was incorporated as a town in 1722. By the 1840s, the canal, the railroads, and new factories had grown its population so quickly that it received a city charter in 1848.",
    is_active: true,
  },
  {
    id: "history-2",
    category_key: "history",
    question: "Worcester printer and Revolutionary War figure Isaiah Thomas founded which historical society still headquartered in the city?",
    option_a: "American Antiquarian Society",
    option_b: "Massachusetts Historical Society",
    option_c: "Smithsonian Institution",
    option_d: "National Archives",
    option_e: null,
    correct_option: "A",
    explanation: "Isaiah Thomas founded the American Antiquarian Society in 1812, starting with his own collection of books and newspapers. Today its library on Salisbury Street holds one of the largest collections of early American printed material in the world.",
    is_active: true,
  },
  {
    id: "history-3",
    category_key: "history",
    question: "What is the name of the catastrophic February 1978 snowstorm that paralyzed Worcester and New England?",
    option_a: "The Blizzard of '78",
    option_b: "Hurricane Carol",
    option_c: "The Great Ice Storm",
    option_d: "Snowmageddon",
    option_e: null,
    correct_option: "A",
    explanation: "The Blizzard of '78 dropped more than two feet of snow on much of southern New England. Thousands of drivers were stranded on the highways, and Governor Michael Dukakis banned non-emergency travel for days while crews dug out.",
    is_active: true,
  },
  // Famous People & Events
  {
    id: "famous-1",
    category_key: "famous",
    question: "What U.S. President delivered commencement addresses at both Clark University and the College of the Holy Cross?",
    option_a: "Teddy Roosevelt",
    option_b: "Bill Clinton",
    option_c: "Dwight D. Eisenhower",
    option_d: "Woodrow Wilson",
    option_e: "Harry S. Truman",
    correct_option: "A",
    explanation: "Theodore Roosevelt gave both commencement addresses in June 1905, on a single visit to Worcester while he was serving as president.",
    is_active: true,
  },
  // Geography
  {
    id: "geography-1",
    category_key: "geography",
    question: "In 1929, the Salisbury Mansion was moved from which Worcester location to its current home on Highland Street in Worcester?",
    option_a: "Tatnuck Square",
    option_b: "Lincoln Square",
    option_c: "Newton Square",
    option_d: "Federal Square",
    option_e: "Kelley Square",
    correct_option: "B",
    explanation: "Merchant Stephen Salisbury built the mansion in 1772 next to his store in Lincoln Square. It was moved to Highland Street in 1929, and today it is a historic house museum run by the Museum of Worcester.",
    is_active: true,
  },
  // Business & Industry
  {
    id: "business-1",
    category_key: "business",
    question: "On April 16, 1841, Loring Coes was granted a patent for what Worcester invention that is now found in nearly everyone's toolbox?",
    option_a: "Phillips head screwdriver",
    option_b: "Flat nose pliers",
    option_c: "Claw hammer",
    option_d: "Monkey wrench",
    option_e: "Coping saw",
    correct_option: "D",
    explanation: "Loring Coes patented an adjustable screw wrench that could be fitted to nuts of many sizes. He and his brother Aury built the Coes Wrench Company around it, and Coes wrenches were made in Worcester for generations.",
    is_active: true,
  },
];
