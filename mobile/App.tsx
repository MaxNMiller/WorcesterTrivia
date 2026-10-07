import "./global.css";

import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PlayerToken } from "./src/components/PlayerToken";
import { CategoryTile } from "./src/components/CategoryTile";
import { useTriviaGame } from "./src/hooks/useTriviaGame";

/**
 * Entry point. The home screen (token + category grid) is fully wired up
 * as the reference implementation. The question/result/win screens below
 * are intentionally minimal placeholders - see docs/ARCHITECTURE.md for
 * the checklist of remaining components to port from the web app
 * (QuestionCard, StreakBadge, Confetti, WinScreen), following the exact
 * pattern CategoryTile.tsx demonstrates.
 */
export default function App() {
  const game = useTriviaGame();

  if (game.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-felt-2">
        <ActivityIndicator color="#c9973f" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-felt-2 px-4">
      <StatusBar style="light" />

      {game.view === "home" && (
        <View className="w-full max-w-md items-center gap-6 rounded-2xl border-4 border-brass bg-parchment px-5 py-8">
          <PlayerToken
            categories={game.categories}
            wedges={game.wedges}
            justWonKey={game.justWonKey}
          />
          <Text className="text-lg font-bold text-ink">
            {game.wonCount} / {game.totalCategories} wedges collected
          </Text>

          <View className="w-full flex-row flex-wrap justify-between gap-3">
            {game.categories.map((cat) => (
              <CategoryTile
                key={cat.key}
                category={cat}
                won={!!game.wedges[cat.key]}
                isPicking={game.drawingKey === cat.key}
                isDimmed={!!game.drawingKey && game.drawingKey !== cat.key}
                disabled={!!game.drawingKey}
                onPress={() => game.drawCard(cat)}
              />
            ))}
          </View>
        </View>
      )}

      {(game.view === "question" || game.view === "result") &&
        game.currentQuestion &&
        game.currentCategory && (
          <View className="w-full max-w-md gap-4 rounded-lg border-4 border-ink bg-parchment p-5">
            <Text
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: game.currentCategory.color_hex }}
            >
              {game.currentCategory.name}
            </Text>
            <Text className="text-xl text-ink">{game.currentQuestion.question}</Text>

            {game.currentQuestion.options.map((option) => {
              const isSelected = game.selectedAnswer === option;
              const isRight = option === game.currentQuestion?.correctAnswer;
              const showResult = game.view === "result";
              return (
                <Pressable
                  key={option}
                  disabled={showResult}
                  onPress={() => game.selectAnswer(option)}
                  className={`rounded-lg border-2 px-4 py-3 ${
                    showResult && isRight
                      ? "border-green-600 bg-green-100"
                      : showResult && isSelected && !isRight
                      ? "border-red-600 bg-red-100"
                      : "border-ink/20 bg-white"
                  }`}
                >
                  <Text className="font-medium text-ink">{option}</Text>
                </Pressable>
              );
            })}

            {game.view === "result" && (
              <Pressable
                onPress={game.nextTurn}
                className="items-center rounded-lg bg-ink px-6 py-3"
              >
                <Text className="font-bold uppercase text-parchment">Next Turn</Text>
              </Pressable>
            )}
          </View>
        )}

      {game.view === "win" && (
        <View className="w-full max-w-md items-center gap-4 rounded-2xl border-4 border-brass bg-parchment px-6 py-10">
          <Text className="text-2xl font-bold uppercase text-ink">You Win!</Text>
          <PlayerToken categories={game.categories} wedges={game.wedges} size={180} stagger />
          <Pressable onPress={game.resetGame} className="rounded-lg bg-brass px-6 py-3">
            <Text className="font-bold uppercase text-ink">Play Again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
