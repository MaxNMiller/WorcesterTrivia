# Worcester Trivia — Mobile Architecture

## 1. Where this came from

The existing app (`../TriviaGame.jsx`, plus a parallel vanilla-HTML build) is a single-file
React + Tailwind + lucide-react web component. Every category, question, and answer is a
hardcoded JS literal. That's fine for a demo; it's not fine for a real product where
non-technical teammates need to add and fix trivia questions on their own, on a schedule the
engineering team isn't involved in.

Two things had to change to get to native iOS/Android apps:

1. The UI layer has to become a real mobile app (no DOM, no CSS in React Native).
2. The question data has to move out of source code and into something editors can use
   directly — without a code change or an app-store release.

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Mobile framework | **Expo (managed) + React Native + TypeScript** | Reuses React knowledge directly; EAS Build/Submit means no local Xcode/Android Studio setup is required to ship; `expo-updates`/EAS Update gives OTA JS-only patches without a store review. |
| Styling | **NativeWind v4** (Tailwind syntax for RN) | Keeps the same utility-class vocabulary the web version already uses — most class names transfer as-is. |
| Icons | **lucide-react-native** | Same icon set/names as the web app's `lucide-react`, so category icon choices carry over 1:1. |
| Vector graphics | **react-native-svg** | Renders the wedge player-token exactly like the web `<svg>` version; the math (`polarToCartesian`/`wedgePath`) is unchanged. |
| Animation | **react-native-reanimated** | Replaces CSS `@keyframes` — RN has no CSS, so every animation (`tile-pick`, `wedge-win`, confetti, streak-pop, deal-in, panel-in, …) needs a Reanimated equivalent. |
| CMS / backend | **Supabase** | See §3. |
| Local cache | **AsyncStorage** | Simple key-value persistence for the offline cache; no need for a full local database given the dataset size (dozens–hundreds of rows). |
| Connectivity check | **@react-native-community/netinfo** | Avoids waiting on a network timeout when there's obviously no connection. |

### What ports 1:1 vs. what had to be rebuilt

**Reused almost verbatim** (this is the actual "code reuse" the migration gets you):
- The game's state machine — `drawCard` / `selectAnswer` / `nextTurn` / `resetGame`, the
  shuffle-on-draw logic, the streak counter. See `src/hooks/useTriviaGame.ts` next to
  `TriviaGame.jsx` — the functions are line-for-line familiar.
- The wedge-token geometry (`polarToCartesian` / `wedgePath`) in `src/components/PlayerToken.tsx`.
- The data shape (`{ options: string[], correctAnswer: string }`) and the overall
  home → question → result → win flow.

**Rebuilt, because React Native has no DOM/CSS:**
- All markup: `<div>`/`<button>`/`<svg>` → `<View>`/`<Pressable>`/`<Svg>`.
- All animation: CSS `@keyframes` → Reanimated `useSharedValue`/`useAnimatedStyle`/`useAnimatedProps`.
- Dark mode: CSS custom properties/media queries → RN's `useColorScheme()` (NativeWind reads
  this automatically for `dark:` variants).

`src/components/CategoryTile.tsx` is written as the reference example for this conversion —
port the rest of the web app's components (`QuestionCard`, `StreakBadge`, `Confetti`,
`WinScreen`) the same way: NativeWind classes for anything static, plain inline `style` only
for values that come from data at runtime (like a category's hex color), Reanimated for
whatever used to be a CSS animation.

## 3. CMS choice: Supabase

The ask was to compare Google Sheets, Airtable, and Supabase and recommend one.

| | Supabase (recommended) | Airtable | Google Sheets |
|---|---|---|---|
| Editor UI | Table Editor — a spreadsheet-like grid in Supabase Studio | Best-in-class spreadsheet/DB hybrid UI | Everyone already knows it |
| Schema/validation | Real Postgres columns + an enum for `correct_option` — a typo can't silently break the app | Field types exist but are looser | None — a stray character breaks matching silently |
| API | Auto-generated REST (PostgREST) via `supabase-js`; no backend to write | REST API, but rate-limited (5 req/s per base) | Sheets API, quota-limited (100 req/100s/user), needs a service account or "publish to web" |
| Access control for editors | Invite teammates as Studio project members (Editor role); app only ever uses a read-only anon key + Row Level Security | Share the base; API key management is clunkier | Share the sheet; app credential story is the weakest of the three |
| Free tier | Generous (500MB DB, unlimited API requests within reason) — plenty for a trivia dataset | Free tier caps at 1,000 records/base | Free, but the API/quota tradeoffs above still apply |
| Room to grow | Realtime subscriptions, Auth, Storage all available later without switching platforms | Good for small teams, gets expensive past free tier | Not really built for this |

**Verdict:** Supabase. It's exactly as easy for a non-technical editor as a spreadsheet (the
Table Editor *is* a grid you type into), but backed by real schema constraints so bad data
can't quietly break the app, with no rate-limit surprises and no backend of our own to build
or maintain.

## 4. Data schema

See `../supabase/schema.sql` for the runnable DDL. Summary:

**`categories`**

| column | type | notes |
|---|---|---|
| `key` | text, PK | stable identifier, e.g. `"geography"` |
| `name` | text | display name |
| `color_hex` | text | e.g. `"#3b82f6"` |
| `icon_name` | text | must match a `lucide-react-native` export name (e.g. `"Globe"`); unrecognized names fall back to a generic icon in the app rather than crashing |
| `sort_order` | int | controls home-screen tile order |

**`questions`**

| column | type | notes |
|---|---|---|
| `id` | uuid, PK | auto-generated |
| `category_key` | text, FK → `categories.key` | |
| `question` | text | |
| `option_a` .. `option_d` | text | four flat columns, not a JSON array — much easier for a non-technical editor to fill in a spreadsheet-style row than to hand-edit JSON |
| `correct_option` | enum `'A' \| 'B' \| 'C' \| 'D'` | which of the four columns is correct — a dropdown/enum in the Table Editor, not free text, so it can never fail to match |
| `is_active` | boolean, default true | lets editors retire a bad question without deleting history |
| `created_at` / `updated_at` | timestamptz | `updated_at` auto-maintained by a trigger |

The app's `normalizeQuestion()` (in `src/services/questionsService.ts`) converts a
`QuestionRow` into the `{ id, category, question, options: string[], correctAnswer }` shape the
game hook already expects — this is the one place the CMS's flat-columns shape and the game's
array shape are bridged, so a schema change only ever touches one function.

**Row Level Security:** both tables are RLS-enabled with a public `select`-only policy. The
app ships a Supabase anon key that can only ever read `is_active = true` questions — it cannot
write. Editors don't go through the app at all; they log into Supabase Studio with their own
invited account and edit rows directly.

## 5. Offline strategy

A board game session is exactly the scenario where you can't assume connectivity. The
strategy in `src/services/questionsService.ts` (`loadGameData()`):

1. Check connectivity with NetInfo first, so there's no timeout wait when offline is obvious.
2. **Online:** fetch categories + questions from Supabase, write them to an AsyncStorage
   cache, return them.
3. **Offline, or the fetch failed:** return whatever was last cached.
4. **No network and no cache yet** (first-ever launch with no connectivity): fall back to
   `src/data/fallbackQuestions.ts` — the same 18 starter questions the Supabase project is
   seeded with — so the app is playable the moment it's installed, before it's ever synced.

`forceRefresh()` clears the cache and re-fetches; wire this to a "Refresh Questions" action
somewhere in the app's settings/about area so an organizer can sync deliberately right before
a session while they know they have Wi-Fi, rather than relying on it happening automatically
at some unpredictable moment.

## 6. File map — what's been built vs. what's still a port

**Done, real code:**
- `src/types/trivia.ts`, `src/data/fallbackQuestions.ts`, `supabase/schema.sql`
- `src/services/supabaseClient.ts`, `src/services/questionsService.ts`
- `src/hooks/useTriviaGame.ts` — the full ported state machine
- `src/components/PlayerToken.tsx` — full working port
- `src/components/CategoryTile.tsx` — full working port, the reference pattern
- `App.tsx` — home screen fully wired to the hook + both components; question/result/win
  screens are minimal unstyled placeholders so the app is clickable end-to-end already

**Still to port, following `CategoryTile.tsx`'s pattern exactly:**
- `QuestionCard` (category header, question text, 4 answer buttons, correct/incorrect
  styling, the `option-pop`/`option-shake`/`mark-pop` animations)
- `StreakBadge` (the flame pill + best-streak label, `streak-pop`/`streak-hot` animations)
- `Confetti` (win-screen particle burst)
- A proper `WinScreen` composition (currently inlined directly in `App.tsx`)
- Dark mode styling pass using NativeWind's `dark:` variants + `useColorScheme()`

None of this is guesswork about *how* to do it — it's the same conversion `CategoryTile.tsx`
already demonstrates, repeated four more times against the corresponding piece of
`TriviaGame.jsx`/`worcester-pursuit.html`.
