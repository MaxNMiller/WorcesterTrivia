import "./global.css";

import React from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { CheckCircle2, Lightbulb, XCircle } from "lucide-react-native";
import { PlayerToken } from "./src/components/PlayerToken";
import { CategoryTile } from "./src/components/CategoryTile";
import { useTriviaGame } from "./src/hooks/useTriviaGame";
import { colors, readableTextOn } from "./src/theme/colors";

// Trimmed brand logo (light text on transparent) - only readable on Ink.
const LOGO = require("./assets/logo.png");
const LOGO_WIDTH = 300;
const LOGO_HEIGHT = LOGO_WIDTH * (477 / 1200);

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
      <View className="flex-1 items-center justify-center bg-ink">
        <ActivityIndicator color={colors.worcesterRed} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-ink"
      contentContainerClassName="grow items-center justify-center px-4 py-16"
    >
      <StatusBar style="light" />

      {game.view === "home" && (
        <Image
          source={LOGO}
          accessibilityLabel="Worcester Trivia, presented by the Museum of Worcester"
          resizeMode="contain"
          className="mb-6"
          style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
        />
      )}

      {game.view === "home" && (
        <View className="w-full max-w-md items-center gap-6 rounded-2xl border-4 border-worcester-red bg-bone px-5 py-8">
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
          <View className="w-full max-w-md overflow-hidden rounded-lg border-4 border-ink bg-bone">
            <View
              className="px-5 py-4"
              style={{ backgroundColor: game.currentCategory.color_hex }}
            >
              <Text
                className="text-base font-bold uppercase tracking-wider"
                style={{ color: readableTextOn(game.currentCategory.color_hex) }}
              >
                {game.currentCategory.name}
              </Text>
            </View>
            <View className="gap-3 p-5">
              <Text className="mb-2 text-xl text-ink">{game.currentQuestion.question}</Text>

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
                        ? "border-correct bg-correct/15"
                        : showResult && isSelected && !isRight
                        ? "border-incorrect bg-incorrect/10"
                        : "border-ink/20 bg-white"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        showResult && !isRight && !isSelected ? "text-stone" : "text-ink"
                      }`}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}

              {game.view === "result" && (
                <View className="mt-3 gap-4">
                  <View className="flex-row items-center gap-2">
                    {game.isCorrect ? (
                      <CheckCircle2 size={22} strokeWidth={2.75} color={colors.correct} />
                    ) : (
                      <XCircle size={22} strokeWidth={2.75} color={colors.incorrect} />
                    )}
                    <Text className="text-lg font-bold text-ink">
                      {game.isCorrect ? "Correct! Wedge earned." : "Not quite."}
                    </Text>
                  </View>

                  {!game.isCorrect && (
                    <Text className="text-slate">
                      The correct answer was{" "}
                      <Text className="font-bold text-ink">{game.currentQuestion.correctAnswer}</Text>.
                    </Text>
                  )}

                  {game.currentQuestion.explanation && (
                    <View className="rounded-r-lg border-l-4 border-gold bg-gold/15 px-4 py-3">
                      <View className="mb-1.5 flex-row items-center gap-1.5">
                        <Lightbulb size={14} strokeWidth={2.5} color={colors.ink} />
                        <Text className="text-xs font-bold uppercase tracking-widest text-ink">
                          Did you know?
                        </Text>
                      </View>
                      <Text className="leading-relaxed text-ink/85">
                        {game.currentQuestion.explanation}
                      </Text>
                    </View>
                  )}

                  <Pressable
                    onPress={game.nextTurn}
                    className="items-center rounded-lg bg-worcester-red px-6 py-3 active:bg-brick"
                  >
                    <Text className="font-bold uppercase text-bone">Next Turn</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        )}

      {game.view === "win" && (
        <View className="w-full max-w-md items-center gap-4 rounded-2xl border-4 border-worcester-red bg-bone px-6 py-10">
          <Text className="text-2xl font-bold uppercase text-ink">You Win!</Text>
          <PlayerToken categories={game.categories} wedges={game.wedges} size={180} stagger />
          <Pressable
            onPress={game.resetGame}
            className="rounded-lg bg-worcester-red px-6 py-3 active:bg-brick"
          >
            <Text className="font-bold uppercase text-bone">Play Again</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
