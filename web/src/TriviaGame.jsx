import { useState } from "react";
import {
  Globe,
  Palette,
  Landmark,
  Users,
  Sparkles,
  Briefcase,
  CheckCircle2,
  XCircle,
  RotateCcw,
  PartyPopper,
  Flame,
} from "lucide-react";

const CATEGORIES = [
  { key: "culture", name: "Culture, Recreation & Education", hex: "#f472b6", bg: "bg-pink-400", text: "text-white", icon: Palette },
  { key: "potpourri", name: "Potpourri", hex: "#8b4513", bg: "bg-[#8b4513]", text: "text-white", icon: Sparkles },
  { key: "history", name: "History", hex: "#facc15", bg: "bg-yellow-400", text: "text-[#241a10]", icon: Landmark },
  { key: "famous", name: "Famous People & Events", hex: "#22c55e", bg: "bg-green-500", text: "text-white", icon: Users },
  { key: "geography", name: "Geography", hex: "#3b82f6", bg: "bg-blue-500", text: "text-white", icon: Globe },
  { key: "business", name: "Business & Industry", hex: "#f97316", bg: "bg-orange-500", text: "text-white", icon: Briefcase },
];

const QUESTIONS = [
  // Culture, Recreation & Education
  { id: 1, category: "culture", question: "College of the Holy Cross, a Jesuit liberal arts college founded in 1843, sits atop which Worcester hill?", options: ["Mount St. James", "Bancroft Hill", "Chandler Hill", "Green Hill"], correctAnswer: "Mount St. James" },
  { id: 2, category: "culture", question: "In 1909, Sigmund Freud delivered his only lectures in the United States at which Worcester university?", options: ["Clark University", "Worcester State University", "Assumption University", "Anna Maria College"], correctAnswer: "Clark University" },
  { id: 3, category: "culture", question: "With land purchases beginning in 1854, which Worcester park is considered one of the first in the U.S. acquired with public funds?", options: ["Elm Park", "Green Hill Park", "Institute Park", "Newton Hill"], correctAnswer: "Elm Park" },
  // Potpourri
  { id: 4, category: "potpourri", question: "In 1963, Worcester graphic artist Harvey Ball designed which now-famous image for an insurance company?", options: ["The smiley face", "The peace sign", "The recycling symbol", "The thumbs-up icon"], correctAnswer: "The smiley face" },
  { id: 5, category: "potpourri", question: "Worcester native Esther Howland is known as the \"Mother of the American\" what, for pioneering mass-produced greeting cards in the 1840s?", options: ["Valentine", "Christmas card", "Postcard", "Birthday card"], correctAnswer: "Valentine" },
  { id: 6, category: "potpourri", question: "Thanks to its central location within Massachusetts, Worcester is nicknamed the:", options: ["Heart of the Commonwealth", "Hub of the Universe", "Gateway City", "City of Champions"], correctAnswer: "Heart of the Commonwealth" },
  // History
  { id: 7, category: "history", question: "In what year was Worcester officially incorporated as a city?", options: ["1848", "1776", "1900", "1620"], correctAnswer: "1848" },
  { id: 8, category: "history", question: "Worcester printer and Revolutionary War figure Isaiah Thomas founded which historical society still headquartered in the city?", options: ["American Antiquarian Society", "Massachusetts Historical Society", "Smithsonian Institution", "National Archives"], correctAnswer: "American Antiquarian Society" },
  { id: 9, category: "history", question: "What is the name of the catastrophic February 1978 snowstorm that paralyzed Worcester and New England?", options: ["The Blizzard of '78", "Hurricane Carol", "The Great Ice Storm", "Snowmageddon"], correctAnswer: "The Blizzard of '78" },
  // Famous People & Events
  { id: 10, category: "famous", question: "Worcester-born Robert H. Goddard, the father of modern rocketry, launched the first liquid-fueled rocket in 1926 in which nearby town?", options: ["Auburn", "Shrewsbury", "Leicester", "Holden"], correctAnswer: "Auburn" },
  { id: 11, category: "famous", question: "Worcester-born activist Abbie Hoffman co-founded which 1960s countercultural political group?", options: ["The Yippies (Youth International Party)", "The Black Panthers", "Students for a Democratic Society", "The Weather Underground"], correctAnswer: "The Yippies (Youth International Party)" },
  { id: 12, category: "famous", question: "In 1850, Worcester hosted the first national convention dedicated to which cause?", options: ["Women's rights", "Abolition of slavery", "Labor unions", "Temperance"], correctAnswer: "Women's rights" },
  // Geography
  { id: 13, category: "geography", question: "As the crow flies, roughly how far is Worcester from Boston?", options: ["About 40 miles", "About 90 miles", "About 120 miles", "About 15 miles"], correctAnswer: "About 40 miles" },
  { id: 14, category: "geography", question: "Which lake forms part of Worcester's eastern border with Shrewsbury and hosts collegiate rowing regattas?", options: ["Lake Quinsigamond", "Lake Winnipesaukee", "Walden Pond", "Indian Lake"], correctAnswer: "Lake Quinsigamond" },
  { id: 15, category: "geography", question: "Worcester's hilly terrain has earned it a comparison to Rome for being built across how many hills?", options: ["Seven", "Three", "Twelve", "Five"], correctAnswer: "Seven" },
  // Business & Industry
  { id: 16, category: "business", question: "Due to 19th-century wire manufacturers like Washburn & Moen, Worcester earned which industrial nickname?", options: ["The Wire City", "The Steel City", "Nail City", "The Iron Capital"], correctAnswer: "The Wire City" },
  { id: 17, category: "business", question: "Founded in Worcester in 1882 and still headquartered there, which company is famous for ginger ale and seltzer?", options: ["Polar Beverages", "Moxie", "Coca-Cola", "Nantucket Nectars"], correctAnswer: "Polar Beverages" },
  { id: 18, category: "business", question: "Table Talk Pies, famous for individually-wrapped snack pies, was founded in Worcester in what year?", options: ["1924", "1899", "1950", "1975"], correctAnswer: "1924" },
];

const DISPLAY_FONT = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const SERIF_FONT = "Georgia, 'Times New Roman', serif";
const LABEL_FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const ANIMATION_CSS = `
  @keyframes panel-in {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes deal-in {
    0% { opacity: 0; transform: translateY(36px) rotate(3deg) scale(0.96); }
    65% { opacity: 1; }
    100% { opacity: 1; transform: translateY(0) rotate(-0.6deg) scale(1); }
  }
  @keyframes fade-down {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes tile-pick {
    0% { transform: scale(1) translateY(0); }
    35% { transform: scale(1.06) translateY(-4px); box-shadow: 0 14px 24px rgba(0,0,0,0.35); }
    100% { transform: scale(0.94) translateY(-10px); opacity: 0; }
  }
  @keyframes option-pop {
    0% { transform: scale(1); }
    45% { transform: scale(1.035); }
    100% { transform: scale(1); }
  }
  @keyframes option-shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-3px); }
    40%, 60% { transform: translateX(3px); }
  }
  @keyframes mark-pop {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes wedge-win {
    0% { transform: scale(0.4); opacity: 0; filter: drop-shadow(0 0 0 rgba(201,151,63,0)); }
    55% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 8px rgba(201,151,63,0.85)); }
    100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0 rgba(201,151,63,0)); }
  }
  @keyframes win-pop {
    0% { transform: scale(0.6); opacity: 0; }
    65% { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes confetti-fall {
    0% { opacity: 0; top: -6%; transform: translateX(0) rotate(0deg); }
    12% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; top: 115%; transform: translateX(var(--drift)) rotate(var(--rotate)); }
  }
  .panel-in { animation: panel-in 0.45s cubic-bezier(.22,1,.36,1); }
  .deal-in { animation: deal-in 0.5s cubic-bezier(.2,.85,.25,1.05); }
  .fade-down { animation: fade-down 0.5s ease both; }
  .fade-down-delay { animation: fade-down 0.5s ease 0.05s both; }
  .fade-up { animation: fade-up 0.3s ease both; }
  .fade-up-delay-1 { animation: fade-up 0.3s ease 0.06s both; }
  .fade-up-delay-2 { animation: fade-up 0.3s ease 0.1s both; }
  .option-pop { animation: option-pop 0.35s ease; }
  .option-shake { animation: option-shake 0.4s ease; }
  .mark-pop { animation: mark-pop 0.25s cubic-bezier(.22,1,.36,1) both; }
  .wedge-new {
    transform-box: fill-box;
    transform-origin: center;
    animation: wedge-win 0.65s cubic-bezier(.22,1,.36,1);
  }
  .wedge-stagger {
    transform-box: fill-box;
    transform-origin: center;
    opacity: 0;
    animation: wedge-win 0.55s cubic-bezier(.22,1,.36,1) forwards;
  }
  .win-pop { animation: win-pop 0.5s cubic-bezier(.22,1,.36,1) both; }
  .win-pop-delay { animation: win-pop 0.5s cubic-bezier(.22,1,.36,1) 0.05s both; }
  .tile-pick { animation: tile-pick 0.26s cubic-bezier(.4,0,.2,1) forwards; z-index: 1; }
  .tile-dim { animation: none; opacity: 0.4; transform: scale(0.96); transition: opacity 0.2s ease, transform 0.2s ease; }
  .streak-badge { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
  .streak-pop { animation: streak-pop 0.4s cubic-bezier(.34,1.56,.64,1); }
  @keyframes streak-pop {
    0% { transform: scale(0.85); }
    55% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  .streak-hot { animation: streak-glow 1.6s ease-in-out infinite; }
  @keyframes streak-glow {
    0%, 100% { box-shadow: 0 0 6px rgba(249,115,22,0.35); }
    50% { box-shadow: 0 0 14px rgba(249,115,22,0.65); }
  }
  .brass-btn { position: relative; overflow: hidden; }
  .brass-btn::after {
    content: "";
    position: absolute;
    top: 0;
    left: -60%;
    width: 35%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
    transform: skewX(-20deg);
    transition: left 0.55s ease;
  }
  .brass-btn:hover::after { left: 130%; }
  .confetti-piece {
    position: absolute;
    top: -6%;
    left: var(--left);
    width: 7px;
    height: 12px;
    border-radius: 1px;
    opacity: 0;
    animation: confetti-fall var(--duration) ease-in var(--delay) forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function PlayerToken({ wedges, size = 220, justWonKey = null, stagger = false }) {
  const cx = 100;
  const cy = 100;
  const r = 92;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <circle cx={cx} cy={cy} r={r + 5} fill="#c9973f" />
      {CATEGORIES.map((cat, i) => {
        const start = i * 60;
        const end = start + 60;
        const won = wedges[cat.key];
        let cls = "";
        let style;
        if (won && !prefersReducedMotion) {
          if (stagger) {
            cls = "wedge-stagger";
            style = { animationDelay: `${i * 0.09}s` };
          } else if (justWonKey === cat.key) {
            cls = "wedge-new";
          }
        }
        return (
          <path
            key={cat.key}
            className={cls}
            style={style}
            d={wedgePath(cx, cy, r, start, end)}
            fill={won ? cat.hex : "#2a3f36"}
            stroke="#c9973f"
            strokeWidth="2.5"
            opacity={won ? 1 : 0.6}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={22} fill="#c9973f" stroke="#241a10" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={22} fill="none" stroke="#f3e9d2" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function Confetti() {
  if (prefersReducedMotion) return null;
  const colors = CATEGORIES.map((c) => c.hex).concat(["#c9973f"]);
  const pieces = Array.from({ length: 26 }, (_, i) => ({
    id: i,
    left: `${(Math.random() * 100).toFixed(1)}%`,
    delay: `${(Math.random() * 0.5).toFixed(2)}s`,
    duration: `${(1.5 + Math.random() * 1.2).toFixed(2)}s`,
    drift: `${((Math.random() * 2 - 1) * 50).toFixed(0)}px`,
    rotate: `${(Math.random() * 360).toFixed(0)}deg`,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            "--left": p.left,
            "--delay": p.delay,
            "--duration": p.duration,
            "--drift": p.drift,
            "--rotate": p.rotate,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

export default function TriviaGame() {
  const [wedges, setWedges] = useState({});
  const [view, setView] = useState("home");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lastAskedByCategory, setLastAskedByCategory] = useState({});
  const [justWonKey, setJustWonKey] = useState(null);
  const [drawingKey, setDrawingKey] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [streakTick, setStreakTick] = useState(0);

  const wonCount = Object.values(wedges).filter(Boolean).length;

  function drawCard(category) {
    if (drawingKey) return;
    const pool = QUESTIONS.filter((q) => q.category === category.key);
    const lastId = lastAskedByCategory[category.key];
    const filtered = pool.length > 1 ? pool.filter((q) => q.id !== lastId) : pool;
    const question = filtered[Math.floor(Math.random() * filtered.length)];

    setDrawingKey(category.key);
    setJustWonKey(null);
    window.setTimeout(() => {
      setLastAskedByCategory((prev) => ({ ...prev, [category.key]: question.id }));
      setCurrentCategory(category);
      setCurrentQuestion({ ...question, options: shuffle(question.options) });
      setSelectedAnswer(null);
      setDrawingKey(null);
      setView("question");
    }, prefersReducedMotion ? 0 : 240);
  }

  function selectAnswer(option) {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === currentQuestion.correctAnswer) {
      setWedges((prev) => ({ ...prev, [currentCategory.key]: true }));
      setJustWonKey(currentCategory.key);
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
  }

  function nextTurn() {
    const allCollected = CATEGORIES.every((c) => wedges[c.key]);
    setView(allCollected ? "win" : "home");
  }

  function resetGame() {
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
  }

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ background: "radial-gradient(ellipse at center, #234a3a 0%, #163025 65%, #0f231b 100%)" }}
    >
      <style>{ANIMATION_CSS}</style>
      <div className="w-full max-w-md">
        {view === "home" && (
          <header className="text-center mb-6">
            <p className="fade-down uppercase tracking-[0.3em] text-[#c9973f] text-xs font-bold mb-1" style={{ fontFamily: LABEL_FONT }}>
              Worcester Historical Museum Presents
            </p>
            <h1
              className="fade-down-delay text-3xl sm:text-4xl text-[#f3e9d2] uppercase tracking-tight"
              style={{ fontFamily: DISPLAY_FONT, textShadow: "2px 2px 0 #0f231b" }}
            >
              Worcester Trivia
            </h1>
          </header>
        )}

        {view === "home" && (
          <div className="panel-in flex flex-col items-center gap-6 bg-[#f3e9d2] border-4 border-[#c9973f] rounded-2xl px-5 py-8 sm:px-6 sm:py-10 shadow-2xl">
            <PlayerToken wedges={wedges} justWonKey={justWonKey} />
            <div className="flex flex-col items-center gap-2">
              <p className="text-[#241a10] font-bold text-lg" style={{ fontFamily: LABEL_FONT }}>
                {wonCount} / 6 wedges collected
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span
                  key={streakTick}
                  className={`streak-badge inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 ${
                    streak > 0 ? "border-orange-500 bg-orange-50" : "border-[#241a10]/15 bg-[#faf4e6]"
                  } ${streak >= 3 && !prefersReducedMotion ? "streak-hot" : ""} ${!prefersReducedMotion ? "streak-pop" : ""}`}
                >
                  <Flame
                    size={15}
                    strokeWidth={2.5}
                    className={streak > 0 ? "text-orange-500" : "text-[#241a10]/30"}
                    fill={streak > 0 ? "currentColor" : "none"}
                  />
                  <span
                    className={`font-bold text-sm ${streak > 0 ? "text-orange-700" : "text-[#241a10]/40"}`}
                    style={{ fontFamily: LABEL_FONT }}
                  >
                    {streak} Streak
                  </span>
                </span>
                {bestStreak > 1 && (
                  <span
                    className="text-[#241a10]/45 text-xs font-semibold uppercase tracking-wide"
                    style={{ fontFamily: LABEL_FONT }}
                  >
                    Best {bestStreak}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full">
              <p
                className="fade-down text-[#241a10]/70 text-xs uppercase tracking-[0.25em] font-bold text-center mb-3"
                style={{ fontFamily: LABEL_FONT }}
              >
                Choose a Category
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat, i) => {
                  const won = !!wedges[cat.key];
                  const isPicking = drawingKey === cat.key;
                  const isDimmed = !!drawingKey && !isPicking;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => drawCard(cat)}
                      disabled={!!drawingKey}
                      aria-label={`Draw a ${cat.name} question`}
                      className={`brass-btn fade-up relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-[#241a10]/25 px-3 py-5 shadow-md transition hover:-translate-y-0.5 active:scale-[0.97] disabled:cursor-default ${cat.bg} ${cat.text} ${isPicking ? "tile-pick" : ""} ${isDimmed ? "tile-dim" : ""}`}
                      style={{ fontFamily: LABEL_FONT, animationDelay: `${0.05 + i * 0.05}s` }}
                    >
                      {won && (
                        <span className="absolute top-1.5 right-1.5 bg-[#f3e9d2] text-[#241a10] rounded-full p-0.5 shadow">
                          <CheckCircle2 size={14} strokeWidth={3} />
                        </span>
                      )}
                      <cat.icon size={26} strokeWidth={2.25} />
                      <span className="text-center text-xs sm:text-sm font-bold uppercase tracking-wide leading-tight">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {(view === "question" || view === "result") && currentQuestion && currentCategory && (
          <div
            className="deal-in bg-[#f3e9d2] border-4 border-[#241a10] rounded-lg shadow-2xl overflow-hidden"
            style={{ transform: "rotate(-0.6deg)" }}
          >
            <div className={`${currentCategory.bg} ${currentCategory.text} px-5 py-4 flex items-center gap-3`}>
              <currentCategory.icon size={26} strokeWidth={2.5} />
              <span className="uppercase tracking-wider font-bold text-lg" style={{ fontFamily: DISPLAY_FONT }}>
                {currentCategory.name}
              </span>
            </div>

            <div className="px-6 py-6">
              <p className="text-[#241a10] text-xl leading-snug mb-6" style={{ fontFamily: SERIF_FONT }}>
                {currentQuestion.question}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isTheCorrectAnswer = option === currentQuestion.correctAnswer;

                  let stateClasses = "bg-white border-[#241a10]/20 text-[#241a10] hover:border-[#c9973f] hover:bg-[#faf4e6]";
                  let motionClass = "";
                  if (view === "result") {
                    if (isTheCorrectAnswer) {
                      stateClasses = "bg-green-100 border-green-600 text-green-900";
                      motionClass = "option-pop";
                    } else if (isSelected && !isCorrect) {
                      stateClasses = "bg-red-100 border-red-600 text-red-900";
                      motionClass = "option-shake";
                    } else {
                      stateClasses = "bg-white border-[#241a10]/10 text-[#241a10]/50";
                    }
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => selectAnswer(option)}
                      disabled={view === "result"}
                      className={`flex items-center justify-between gap-3 text-left px-4 py-3 rounded-lg border-2 font-medium transition ${stateClasses} ${motionClass}`}
                      style={{ fontFamily: LABEL_FONT }}
                    >
                      <span>{option}</span>
                      {view === "result" && isTheCorrectAnswer && <CheckCircle2 size={20} className="mark-pop text-green-600 shrink-0" />}
                      {view === "result" && isSelected && !isCorrect && <XCircle size={20} className="mark-pop text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {view === "result" && (
                <div className="mt-6">
                  <p
                    className={`fade-up font-bold text-lg mb-4 ${isCorrect ? "text-green-700" : "text-red-700"}`}
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    {isCorrect ? "Correct! Wedge earned." : "Not quite."}
                  </p>
                  {!isCorrect && (
                    <p className="fade-up-delay-1 text-[#241a10]/80 mb-4" style={{ fontFamily: SERIF_FONT }}>
                      The correct answer was <strong>{currentQuestion.correctAnswer}</strong>.
                    </p>
                  )}
                  <button
                    onClick={nextTurn}
                    className="fade-up-delay-2 w-full bg-[#241a10] hover:bg-[#3a2a1a] active:scale-[0.98] text-[#f3e9d2] font-bold uppercase tracking-wide px-6 py-3 rounded-lg transition"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    Next Turn
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "win" && (
          <div className="panel-in relative flex flex-col items-center gap-6 bg-[#f3e9d2] border-4 border-[#c9973f] rounded-2xl px-6 py-10 shadow-2xl text-center">
            <Confetti />
            <PartyPopper size={40} className="win-pop text-[#c9973f]" />
            <h2 className="win-pop-delay text-2xl uppercase text-[#241a10] tracking-tight" style={{ fontFamily: DISPLAY_FONT }}>
              You Win!
            </h2>
            <p className="text-[#241a10]/80" style={{ fontFamily: SERIF_FONT }}>
              You've claimed all six wedges and captured the Heart of the Commonwealth.
            </p>
            <PlayerToken wedges={wedges} size={180} stagger />
            <button
              onClick={resetGame}
              className="brass-btn inline-flex items-center gap-2 bg-[#c9973f] hover:bg-[#b5852f] active:scale-[0.98] text-[#241a10] font-bold uppercase tracking-wide px-6 py-3 rounded-lg transition"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              <RotateCcw size={18} strokeWidth={2.5} />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
