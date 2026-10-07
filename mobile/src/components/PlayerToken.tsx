/**
 * The 6-wedge SVG player token, ported from the web app's PlayerToken
 * (TriviaGame.jsx / worcester-pursuit.html). The `polarToCartesian` /
 * `wedgePath` math is pure geometry and carries over unchanged - only the
 * rendering primitives (react-native-svg instead of raw <svg>/<path>) and
 * the animation engine (Reanimated instead of CSS @keyframes) differ.
 *
 * Wedge count is driven by `categories.length` rather than a hardcoded 6,
 * so the token still renders correctly if a non-technical editor adds or
 * removes a category in the CMS.
 */
import React, { useEffect } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { CategoryRow } from "../types/trivia";

const AnimatedPath = Animated.createAnimatedComponent(Path);

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

type WedgeAnimation = "none" | "pop" | "stagger";

interface WedgeProps {
  d: string;
  color: string;
  won: boolean;
  centerX: number;
  centerY: number;
  animate: WedgeAnimation;
  staggerIndex: number;
}

function Wedge({ d, color, won, centerX, centerY, animate, staggerIndex }: WedgeProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(won ? 1 : 0.6);

  useEffect(() => {
    if (animate === "none") {
      opacity.value = withTiming(won ? 1 : 0.6, { duration: 150 });
      scale.value = withTiming(1, { duration: 150 });
      return;
    }
    const delay = animate === "stagger" ? staggerIndex * 90 : 0;
    scale.value = 0.4;
    opacity.value = 0;
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.1, { duration: 280, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 220, easing: Easing.inOut(Easing.cubic) })
      )
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 180 }));
    // `won` intentionally omitted: while animating, opacity is driven by
    // the sequence above, not the steady-state won/not-won value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, staggerIndex]);

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: centerX },
      { translateY: centerY },
      { scale: scale.value },
      { translateX: -centerX },
      { translateY: -centerY },
    ],
  }));

  return (
    <AnimatedPath
      d={d}
      fill={won ? color : "#2a3f36"}
      stroke="#c9973f"
      strokeWidth={2.5}
      animatedProps={animatedProps}
    />
  );
}

interface PlayerTokenProps {
  categories: CategoryRow[];
  wedges: Record<string, boolean>;
  size?: number;
  justWonKey?: string | null;
  stagger?: boolean;
}

export function PlayerToken({
  categories,
  wedges,
  size = 220,
  justWonKey = null,
  stagger = false,
}: PlayerTokenProps) {
  const cx = 100;
  const cy = 100;
  const r = 92;
  const slice = categories.length > 0 ? 360 / categories.length : 60;

  return (
    <Svg viewBox="0 0 200 200" width={size} height={size}>
      <Circle cx={cx} cy={cy} r={r + 5} fill="#c9973f" />
      {categories.map((cat, i) => {
        const start = i * slice;
        const end = start + slice;
        const won = !!wedges[cat.key];
        const centroid = polarToCartesian(cx, cy, r * 0.55, (start + end) / 2);

        let animate: WedgeAnimation = "none";
        if (won) {
          if (stagger) animate = "stagger";
          else if (justWonKey === cat.key) animate = "pop";
        }

        return (
          <Wedge
            key={cat.key}
            d={wedgePath(cx, cy, r, start, end)}
            color={cat.color_hex}
            won={won}
            centerX={centroid.x}
            centerY={centroid.y}
            animate={animate}
            staggerIndex={i}
          />
        );
      })}
      <Circle cx={cx} cy={cy} r={22} fill="#c9973f" stroke="#241a10" strokeWidth={2} />
      <Circle cx={cx} cy={cy} r={22} fill="none" stroke="#f3e9d2" strokeWidth={1} opacity={0.5} />
    </Svg>
  );
}
