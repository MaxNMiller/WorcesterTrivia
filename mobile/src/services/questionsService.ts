/**
 * Loads categories/questions for the game, with an offline-first strategy
 * suited to a board-game session that may have zero connectivity:
 *
 *  1. If online: fetch fresh data from Supabase, cache it, return it.
 *  2. If offline (or the fetch fails): return the last successfully
 *     cached copy from AsyncStorage.
 *  3. If there is no cache yet either (first-ever launch, no network):
 *     fall back to the data bundled with the app (src/data/fallbackQuestions.ts)
 *     so the game is always playable out of the box.
 *
 * `forceRefresh()` is for a manual "Refresh Questions" action in the app
 * (recommended in the UI) so an organizer can sync right before a session
 * while they know they have Wi-Fi.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { supabase } from "./supabaseClient";
import { fallbackCategories, fallbackQuestions } from "../data/fallbackQuestions";
import type { CategoryRow, GameData, Question, QuestionRow } from "../types/trivia";

// Bumped from v1 when questions gained option_e/explanation, so devices
// that synced the old question set don't keep serving it offline.
const CACHE_KEY = "trivia_cache_v2";

interface CachedPayload {
  categories: CategoryRow[];
  questions: Question[];
  fetchedAt: number;
}

const ANSWER_INDEX: Record<QuestionRow["correct_option"], number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
};

export function normalizeQuestion(row: QuestionRow): Question {
  const columns = [row.option_a, row.option_b, row.option_c, row.option_d, row.option_e];
  // Resolve the answer before dropping blank columns, so the letter always
  // points at the column the editor picked.
  const correctAnswer = columns[ANSWER_INDEX[row.correct_option]] ?? "";
  const options = columns.filter((o): o is string => !!o && o.trim() !== "");
  return {
    id: row.id,
    category: row.category_key,
    question: row.question,
    options,
    correctAnswer,
    explanation: row.explanation?.trim() || null,
  };
}

async function readCache(): Promise<CachedPayload | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedPayload;
  } catch {
    return null;
  }
}

async function writeCache(payload: CachedPayload): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

async function fetchFromSupabase(): Promise<CachedPayload> {
  const [categoriesRes, questionsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("questions").select("*").eq("is_active", true),
  ]);

  if (categoriesRes.error) throw categoriesRes.error;
  if (questionsRes.error) throw questionsRes.error;

  const categories = (categoriesRes.data ?? []) as CategoryRow[];
  const questions = ((questionsRes.data ?? []) as QuestionRow[]).map(normalizeQuestion);

  return { categories, questions, fetchedAt: Date.now() };
}

export async function loadGameData(): Promise<GameData> {
  const netState = await NetInfo.fetch();

  if (netState.isConnected) {
    try {
      const payload = await fetchFromSupabase();
      await writeCache(payload);
      return { ...payload, source: "network" };
    } catch (err) {
      console.warn("Trivia sync failed, falling back to cached/bundled data:", err);
    }
  }

  const cached = await readCache();
  if (cached) {
    return { ...cached, source: "cache" };
  }

  return {
    categories: fallbackCategories,
    questions: fallbackQuestions.map(normalizeQuestion),
    source: "bundled",
    fetchedAt: null,
  };
}

export async function forceRefresh(): Promise<GameData> {
  await AsyncStorage.removeItem(CACHE_KEY);
  return loadGameData();
}
