/**
 * The game's state machine, ported from the existing web app
 * (TriviaGame.jsx: drawCard / selectAnswer / nextTurn / resetGame / the
 * streak counter) almost verbatim - this logic never touched the DOM or
 * Tailwind, so it's 100% reusable as-is. The one addition is loading
 * categories/questions from questionsService on mount instead of a
 * static import, since that data now comes from the CMS.
 */
import { useCallback, useEffect, useState } from "react";
import { loadGameData, forceRefresh } from "../services/questionsService";
import type { CategoryRow, GameData, Question } from "../types/trivia";

export type GameView = "home" | "question" | "result" | "win";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DRAW_ANIMATION_MS = 240;

export function useTriviaGame() {
  // --- CMS data ---
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dataSource, setDataSource] = useState<GameData["source"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Game state ---
  const [wedges, setWedges] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<GameView>("home");
  const [currentCategory, setCurrentCategory] = useState<CategoryRow | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lastAskedByCategory, setLastAskedByCategory] = useState<Record<string, string>>({});
  const [justWonKey, setJustWonKey] = useState<string | null>(null);
  const [drawingKey, setDrawingKey] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [streakTick, setStreakTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadGameData().then((data) => {
      if (cancelled) return;
      setCategories(data.categories);
      setQuestions(data.questions);
      setDataSource(data.source);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const wonCount = Object.values(wedges).filter(Boolean).length;
  const isCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion?.correctAnswer;

  const drawCard = useCallback(
    (category: CategoryRow) => {
      if (drawingKey) return;
      const pool = questions.filter((q) => q.category === category.key);
      if (pool.length === 0) return;

      const lastId = lastAskedByCategory[category.key];
      const filtered = pool.length > 1 ? pool.filter((q) => q.id !== lastId) : pool;
      const question = filtered[Math.floor(Math.random() * filtered.length)];

      setDrawingKey(category.key);
      setJustWonKey(null);

      setTimeout(() => {
        setLastAskedByCategory((prev) => ({ ...prev, [category.key]: question.id }));
        setCurrentCategory(category);
        setCurrentQuestion({ ...question, options: shuffle(question.options) });
        setSelectedAnswer(null);
        setDrawingKey(null);
        setView("question");
      }, DRAW_ANIMATION_MS);
    },
    [questions, lastAskedByCategory, drawingKey]
  );

  const selectAnswer = useCallback(
    (option: string) => {
      if (selectedAnswer || !currentQuestion || !currentCategory) return;
      setSelectedAnswer(option);

      if (option === currentQuestion.correctAnswer) {
        const key = currentCategory.key;
        setWedges((prev) => ({ ...prev, [key]: true }));
        setJustWonKey(key);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setStreak(0);
      }

      setStreakTick((t) => t + 1);
      setView("result");
    },
    [selectedAnswer, currentQuestion, currentCategory]
  );

  const nextTurn = useCallback(() => {
    const allCollected = categories.length > 0 && categories.every((c) => wedges[c.key]);
    setView(allCollected ? "win" : "home");
  }, [categories, wedges]);

  const resetGame = useCallback(() => {
    setWedges({});
    setLastAskedByCategory({});
    setCurrentCategory(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setJustWonKey(null);
    setDrawingKey(null);
    setStreak(0);
    setBestStreak(0);
    setStreakTick(0);
    setView("home");
  }, []);

  const refreshQuestions = useCallback(async () => {
    const data = await forceRefresh();
    setCategories(data.categories);
    setQuestions(data.questions);
    setDataSource(data.source);
  }, []);

  return {
    // CMS data / sync status
    isLoading,
    dataSource,
    categories,
    refreshQuestions,
    // Game state
    wedges,
    wonCount,
    totalCategories: categories.length,
    view,
    currentCategory,
    currentQuestion,
    selectedAnswer,
    isCorrect,
    justWonKey,
    drawingKey,
    streak,
    bestStreak,
    streakTick,
    // Actions
    drawCard,
    selectAnswer,
    nextTurn,
    resetGame,
  };
}
