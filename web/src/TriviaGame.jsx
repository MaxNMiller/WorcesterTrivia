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
  Lightbulb,
} from "lucide-react";
import logo from "./assets/worcester-trivia-logo.png";

const CATEGORIES = [
  { key: "culture", name: "Culture, Recreation & Education", hex: "#C73A80", textHex: "#FFFFFF", icon: Palette },
  { key: "potpourri", name: "Potpourri", hex: "#7349B8", textHex: "#FFFFFF", icon: Sparkles },
  { key: "history", name: "History", hex: "#F4CF3A", textHex: "#1D1B1A", icon: Landmark },
  { key: "famous", name: "Famous People & Events", hex: "#7DB33F", textHex: "#1D1B1A", icon: Users },
  { key: "geography", name: "Geography", hex: "#2A6FBA", textHex: "#FFFFFF", icon: Globe },
  { key: "business", name: "Business & Industry", hex: "#EE7A2E", textHex: "#1D1B1A", icon: Briefcase },
];

const QUESTIONS = [
  // Culture, Recreation & Education
  {
    id: 1,
    category: "culture",
    question: "What Worcester-born, well-known, multi-instrumental musician, arranger, and composer was the subject of the short documentary film Anything for Jazz?",
    options: ["Duke Ellington", "John Coltrane", "Jaki Byard", "Charlie Parker", "Ornette Coleman"],
    correctAnswer: "Jaki Byard",
    explanation: "Jaki Byard was born in Worcester in 1922 and could play piano, saxophone, trumpet, and more. He recorded with Charles Mingus, Eric Dolphy, and Roland Kirk, and taught for years at the New England Conservatory. The 1980 short documentary Anything for Jazz is a portrait of him.",
  },
  // Potpourri
  {
    id: 2,
    category: "potpourri",
    question: "Which Worcester restaurant was visited by celebrities including Al Pacino, Rodney Dangerfield, Frank Sinatra, and Bette Midler?",
    options: ["Pilgrim Oyster House", "Aku-Aku", "The Odyssey", "Rovezzi's", "El Morocco"],
    correctAnswer: "El Morocco",
    explanation: "El Morocco, a Lebanese-American restaurant on a hill off Wall Street, was a Worcester institution for decades. Stars performing in central Massachusetts made a point of stopping in for dinner.",
  },
  // History
  {
    id: 3,
    category: "history",
    question: "In what year was Worcester officially incorporated as a city?",
    options: ["1848", "1776", "1900", "1620"],
    correctAnswer: "1848",
    explanation: "Worcester was incorporated as a town in 1722. By the 1840s, the canal, the railroads, and new factories had grown its population so quickly that it received a city charter in 1848.",
  },
  {
    id: 4,
    category: "history",
    question: "Worcester printer and Revolutionary War figure Isaiah Thomas founded which historical society still headquartered in the city?",
    options: ["American Antiquarian Society", "Massachusetts Historical Society", "Smithsonian Institution", "National Archives"],
    correctAnswer: "American Antiquarian Society",
    explanation: "Isaiah Thomas founded the American Antiquarian Society in 1812, starting with his own collection of books and newspapers. Today its library on Salisbury Street holds one of the largest collections of early American printed material in the world.",
  },
  {
    id: 5,
    category: "history",
    question: "What is the name of the catastrophic February 1978 snowstorm that paralyzed Worcester and New England?",
    options: ["The Blizzard of '78", "Hurricane Carol", "The Great Ice Storm", "Snowmageddon"],
    correctAnswer: "The Blizzard of '78",
    explanation: "The Blizzard of '78 dropped more than two feet of snow on much of southern New England. Thousands of drivers were stranded on the highways, and Governor Michael Dukakis banned non-emergency travel for days while crews dug out.",
  },
  // Famous People & Events
  {
    id: 6,
    category: "famous",
    question: "What U.S. President delivered commencement addresses at both Clark University and the College of the Holy Cross?",
    options: ["Teddy Roosevelt", "Bill Clinton", "Dwight D. Eisenhower", "Woodrow Wilson", "Harry S. Truman"],
    correctAnswer: "Teddy Roosevelt",
    explanation: "Theodore Roosevelt gave both commencement addresses in June 1905, on a single visit to Worcester while he was serving as president.",
  },
  // Geography
  {
    id: 7,
    category: "geography",
    question: "In 1929, the Salisbury Mansion was moved from which Worcester location to its current home on Highland Street in Worcester?",
    options: ["Tatnuck Square", "Lincoln Square", "Newton Square", "Federal Square", "Kelley Square"],
    correctAnswer: "Lincoln Square",
    explanation: "Merchant Stephen Salisbury built the mansion in 1772 next to his store in Lincoln Square. It was moved to Highland Street in 1929, and today it is a historic house museum run by the Museum of Worcester.",
  },
  // Business & Industry
  {
    id: 8,
    category: "business",
    question: "On April 16, 1841, Loring Coes was granted a patent for what Worcester invention that is now found in nearly everyone's toolbox?",
    options: ["Phillips head screwdriver", "Flat nose pliers", "Claw hammer", "Monkey wrench", "Coping saw"],
    correctAnswer: "Monkey wrench",
    explanation: "Loring Coes patented an adjustable screw wrench that could be fitted to nuts of many sizes. He and his brother Aury built the Coes Wrench Company around it, and Coes wrenches were made in Worcester for generations.",
  },
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
    0% { transform: scale(0.4); opacity: 0; filter: drop-shadow(0 0 0 rgba(232,176,75,0)); }
    55% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 8px rgba(232,176,75,0.85)); }
    100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0 rgba(232,176,75,0)); }
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
    0%, 100% { box-shadow: 0 0 6px rgba(232,176,75,0.35); }
    50% { box-shadow: 0 0 14px rgba(232,176,75,0.7); }
  }
  .shine-btn { position: relative; overflow: hidden; }
  .shine-btn::after {
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
  .shine-btn:hover::after { left: 130%; }
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
      <circle cx={cx} cy={cy} r={r + 5} fill="#1D1B1A" />
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
            fill={won ? cat.hex : "#3A3634"}
            stroke="#1D1B1A"
            strokeWidth="2.5"
            opacity={won ? 1 : 0.6}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={22} fill="#E3202C" stroke="#1D1B1A" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={22} fill="none" stroke="#FAF9F7" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function Confetti() {
  if (prefersReducedMotion) return null;
  const colors = CATEGORIES.map((c) => c.hex).concat(["#E8B04B", "#E3202C"]);
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
      style={{ background: "radial-gradient(ellipse at center, #2A2726 0%, #1D1B1A 70%)" }}
    >
      <style>{ANIMATION_CSS}</style>
      <div className="w-full max-w-md">
        {view === "home" && (
          <header className="text-center mb-6">
            <h1 className="fade-down">
              <img
                src={logo}
                alt="Worcester Trivia, presented by the Museum of Worcester"
                className="mx-auto w-full max-w-[22rem]"
              />
            </h1>
          </header>
        )}

        {view === "home" && (
          <div className="panel-in flex flex-col items-center gap-6 bg-bone border-4 border-worcester-red rounded-2xl px-5 py-8 sm:px-6 sm:py-10 shadow-2xl">
            <PlayerToken wedges={wedges} justWonKey={justWonKey} />
            <div className="flex flex-col items-center gap-2">
              <p className="text-ink font-bold text-lg" style={{ fontFamily: LABEL_FONT }}>
                {wonCount} / 6 wedges collected
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span
                  key={streakTick}
                  className={`streak-badge inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 ${
                    streak > 0 ? "border-gold bg-gold/15" : "border-ink/15 bg-white"
                  } ${streak >= 3 && !prefersReducedMotion ? "streak-hot" : ""} ${!prefersReducedMotion ? "streak-pop" : ""}`}
                >
                  <Flame
                    size={15}
                    strokeWidth={2.5}
                    className={streak > 0 ? "text-gold" : "text-stone"}
                    fill={streak > 0 ? "currentColor" : "none"}
                  />
                  <span
                    className={`font-bold text-sm ${streak > 0 ? "text-ink" : "text-stone"}`}
                    style={{ fontFamily: LABEL_FONT }}
                  >
                    {streak} Streak
                  </span>
                </span>
                {bestStreak > 1 && (
                  <span
                    className="text-slate text-xs font-semibold uppercase tracking-wide"
                    style={{ fontFamily: LABEL_FONT }}
                  >
                    Best {bestStreak}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full">
              <p
                className="fade-down text-slate text-xs uppercase tracking-[0.25em] font-bold text-center mb-3"
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
                      className={`shine-btn fade-up relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-ink/25 px-3 py-5 shadow-md transition hover:-translate-y-0.5 active:scale-[0.97] disabled:cursor-default ${isPicking ? "tile-pick" : ""} ${isDimmed ? "tile-dim" : ""}`}
                      style={{ fontFamily: LABEL_FONT, animationDelay: `${0.05 + i * 0.05}s`, backgroundColor: cat.hex, color: cat.textHex }}
                    >
                      {won && (
                        <span className="absolute top-1.5 right-1.5 bg-bone text-ink rounded-full p-0.5 shadow">
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
            className="deal-in bg-bone border-4 border-ink rounded-lg shadow-2xl overflow-hidden"
            style={{ transform: "rotate(-0.6deg)" }}
          >
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ backgroundColor: currentCategory.hex, color: currentCategory.textHex }}
            >
              <currentCategory.icon size={26} strokeWidth={2.5} />
              <span className="uppercase tracking-wider font-bold text-lg" style={{ fontFamily: DISPLAY_FONT }}>
                {currentCategory.name}
              </span>
            </div>

            <div className="px-6 py-6">
              <p className="text-ink text-xl leading-snug mb-6" style={{ fontFamily: SERIF_FONT }}>
                {currentQuestion.question}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isTheCorrectAnswer = option === currentQuestion.correctAnswer;

                  let stateClasses = "bg-white border-ink/20 text-ink hover:border-worcester-red hover:bg-bone";
                  let motionClass = "";
                  if (view === "result") {
                    if (isTheCorrectAnswer) {
                      stateClasses = "bg-correct/15 border-correct text-ink";
                      motionClass = "option-pop";
                    } else if (isSelected && !isCorrect) {
                      stateClasses = "bg-incorrect/10 border-incorrect text-ink";
                      motionClass = "option-shake";
                    } else {
                      stateClasses = "bg-white border-ink/10 text-stone";
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
                      {view === "result" && isTheCorrectAnswer && <CheckCircle2 size={20} className="mark-pop text-correct shrink-0" />}
                      {view === "result" && isSelected && !isCorrect && <XCircle size={20} className="mark-pop text-incorrect shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {view === "result" && (
                <div className="mt-6">
                  <p
                    className="fade-up flex items-center gap-2 font-bold text-lg text-ink mb-4"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={22} strokeWidth={2.75} className="text-correct shrink-0" />
                    ) : (
                      <XCircle size={22} strokeWidth={2.75} className="text-incorrect shrink-0" />
                    )}
                    {isCorrect ? "Correct! Wedge earned." : "Not quite."}
                  </p>
                  {!isCorrect && (
                    <p className="fade-up-delay-1 text-slate mb-4" style={{ fontFamily: SERIF_FONT }}>
                      The correct answer was <strong className="text-ink">{currentQuestion.correctAnswer}</strong>.
                    </p>
                  )}
                  {currentQuestion.explanation && (
                    <div className="fade-up-delay-1 mb-5 rounded-r-lg border-l-4 border-gold bg-gold/15 px-4 py-3">
                      <p
                        className="flex items-center gap-1.5 text-ink text-xs font-bold uppercase tracking-[0.2em] mb-1.5"
                        style={{ fontFamily: LABEL_FONT }}
                      >
                        <Lightbulb size={14} strokeWidth={2.5} />
                        Did you know?
                      </p>
                      <p className="text-ink/85 text-[0.95rem] leading-relaxed" style={{ fontFamily: SERIF_FONT }}>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={nextTurn}
                    className="fade-up-delay-2 w-full bg-worcester-red hover:bg-brick active:scale-[0.98] text-bone font-bold uppercase tracking-wide px-6 py-3 rounded-lg transition"
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
          <div className="panel-in relative flex flex-col items-center gap-6 bg-bone border-4 border-worcester-red rounded-2xl px-6 py-10 shadow-2xl text-center">
            <Confetti />
            <PartyPopper size={40} className="win-pop text-gold" />
            <h2 className="win-pop-delay text-2xl uppercase text-ink tracking-tight" style={{ fontFamily: DISPLAY_FONT }}>
              You Win!
            </h2>
            <p className="text-slate" style={{ fontFamily: SERIF_FONT }}>
              You've claimed all six wedges and captured the Heart of the Commonwealth.
            </p>
            <PlayerToken wedges={wedges} size={180} stagger />
            <button
              onClick={resetGame}
              className="shine-btn inline-flex items-center gap-2 bg-worcester-red hover:bg-brick active:scale-[0.98] text-bone font-bold uppercase tracking-wide px-6 py-3 rounded-lg transition"
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
