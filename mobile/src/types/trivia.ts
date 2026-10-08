/**
 * Shared types for the CMS-backed trivia data.
 *
 * `CategoryRow` / `QuestionRow` mirror the Supabase table columns exactly
 * (see supabase/schema.sql) - this is the shape non-technical editors
 * produce by editing rows in Supabase Studio's Table Editor.
 *
 * `Question` is the normalized in-app shape the game logic consumes,
 * matching what the existing web app (TriviaGame.jsx) already expects:
 * `{ options: string[], correctAnswer: string }`, plus the optional
 * `explanation` blurb shown after every answer.
 */

export type AnswerLetter = "A" | "B" | "C" | "D" | "E";

export interface CategoryRow {
  key: string;
  name: string;
  color_hex: string;
  icon_name: string;
  sort_order: number;
}

export interface QuestionRow {
  id: string;
  category_key: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  /** Optional fifth choice - leave empty for a 4-option question. */
  option_e: string | null;
  correct_option: AnswerLetter;
  /** "Did you know?" blurb shown after the player answers. */
  explanation: string | null;
  is_active: boolean;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

export interface GameData {
  categories: CategoryRow[];
  questions: Question[];
  source: "network" | "cache" | "bundled";
  fetchedAt: number | null;
}
