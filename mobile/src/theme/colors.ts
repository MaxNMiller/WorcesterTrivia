/**
 * Brand palette, shared by components that need raw hex values (SVG fills,
 * icon colors, ActivityIndicator) rather than NativeWind classes. Keep in
 * sync with tailwind.config.js and the web app's index.css @theme block.
 */
export const colors = {
  worcesterRed: "#E3202C",
  brick: "#B5121D",
  ink: "#1D1B1A",
  bone: "#FAF9F7",
  charcoal: "#2A2726",
  slate: "#3A3634",
  stone: "#A39D98",
  correct: "#3FA66B",
  incorrect: "#B5121D",
  gold: "#E8B04B",
  white: "#FFFFFF",
} as const;

function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(full.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Picks Ink or white text for a CMS-supplied background color, whichever
 * has the higher contrast ratio - so an editor can choose any category
 * color without making its tile label unreadable.
 */
export function readableTextOn(backgroundHex: string): string {
  const bg = relativeLuminance(backgroundHex);
  if (Number.isNaN(bg)) return colors.white;
  const contrastWithWhite = 1.05 / (bg + 0.05);
  const contrastWithInk = (bg + 0.05) / (relativeLuminance(colors.ink) + 0.05);
  return contrastWithInk > contrastWithWhite ? colors.ink : colors.white;
}
