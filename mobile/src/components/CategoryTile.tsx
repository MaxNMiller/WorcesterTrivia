/**
 * One home-screen category tile. This is the reference pattern for
 * porting the rest of the web app's UI (QuestionCard, StreakBadge,
 * Confetti, WinScreen): NativeWind className for everything static, a
 * plain inline `style` only for the one truly-dynamic value (the
 * category's CMS-supplied hex color - Tailwind classes can't take a
 * runtime variable), and Reanimated for what used to be a CSS
 * @keyframes animation (here: the web app's .tile-pick / .tile-dim).
 *
 * `category.icon_name` is a CMS-editable string (see supabase/schema.sql)
 * looked up against the lucide-react-native icon set at render time, with
 * a safe fallback if an editor ever typos an icon name. The label/icon
 * color is picked from the tile color (readableTextOn) for the same reason:
 * an editor can choose any color without making the label unreadable.
 */
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as LucideIcons from "lucide-react-native";
import { CheckCircle2, HelpCircle } from "lucide-react-native";
import type { CategoryRow } from "../types/trivia";
import { colors, readableTextOn } from "../theme/colors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryTileProps {
  category: CategoryRow;
  won: boolean;
  isPicking: boolean;
  isDimmed: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function CategoryTile({
  category,
  won,
  isPicking,
  isDimmed,
  disabled,
  onPress,
}: CategoryTileProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isPicking) {
      // Mirrors .tile-pick: a quick lift, then shrink-and-fade as the
      // "card" is drawn away toward the question screen.
      scale.value = withSequence(
        withTiming(1.06, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(0.94, { duration: 170, easing: Easing.in(Easing.quad) })
      );
      translateY.value = withSequence(
        withTiming(-4, { duration: 90 }),
        withTiming(-10, { duration: 170 })
      );
      opacity.value = withTiming(0, { duration: 260 });
    } else if (isDimmed) {
      scale.value = withTiming(0.96, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0.4, { duration: 200 });
    } else {
      scale.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isPicking, isDimmed, scale, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const iconComponents = LucideIcons as unknown as Record<string, typeof HelpCircle>;
  const Icon = iconComponents[category.icon_name] ?? HelpCircle;
  const textColor = readableTextOn(category.color_hex);

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Draw a ${category.name} question`}
      style={[{ backgroundColor: category.color_hex }, animatedStyle]}
      className="relative flex-1 basis-[47%] items-center justify-center gap-2 rounded-xl border-2 border-ink/25 px-3 py-5"
    >
      {won && (
        <View className="absolute right-1.5 top-1.5 rounded-full bg-bone p-0.5">
          <CheckCircle2 size={14} strokeWidth={3} color={colors.ink} />
        </View>
      )}
      <Icon size={26} strokeWidth={2.25} color={textColor} />
      <Text
        className="text-center text-xs font-bold uppercase tracking-wide"
        style={{ color: textColor }}
      >
        {category.name}
      </Text>
    </AnimatedPressable>
  );
}
