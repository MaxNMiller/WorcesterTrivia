# Deployment Roadmap

Four phases, in order. Each one names exactly what's already done in this repo vs. what
requires you to click through an external service (Supabase/Apple/Google dashboards) —
those parts can't be automated from here.

## Phase 1 — Development setup

**Already done in this repo:** the Expo/TypeScript project is scaffolded and every dependency
listed in `docs/ARCHITECTURE.md` is installed (`mobile/package.json`). NativeWind, Reanimated,
Supabase, and the offline-cache plumbing are wired up and type-check cleanly
(`npx tsc --noEmit` — see verification note at the bottom of this doc).

**Your steps:**
1. `cd mobile && npm install` (only needed again if you pull this on a different machine).
2. `npx expo start` to boot the dev server (more in Phase 3 below).
3. Port the remaining UI pieces listed at the bottom of `docs/ARCHITECTURE.md`
   (`QuestionCard`, `StreakBadge`, `Confetti`, a real `WinScreen`) following the pattern in
   `src/components/CategoryTile.tsx`.

## Phase 2 — Connect the CMS

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, open **SQL Editor** → paste in the full contents of
   `mobile/supabase/schema.sql` → run it. This creates both tables, locks them down with
   Row Level Security, and seeds the 18 starter questions.
3. In **Project Settings → API**, copy the **Project URL** and the **`anon` public key**.
4. In `mobile/`, copy `.env.example` to `.env` and fill in those two values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   (Expo automatically inlines `EXPO_PUBLIC_*` variables into the app at build time — no
   further config needed. `.env` is already git-ignored.)
5. **Invite your non-technical editors:** Supabase Dashboard → **Project Settings → Team** →
   invite them with the **Editor** role. They'll use the **Table Editor** tab to add/edit rows
   in `categories` and `questions` directly — a spreadsheet-like grid, no SQL required. Changes
   are live the next time the app syncs (see the offline strategy in `ARCHITECTURE.md` §5) —
   **no app update, no App Store/Play Store review, ever, for a content change.**

## Phase 3 — Testing

For almost all of development, you don't need a build at all:

1. `npx expo start` in `mobile/`.
2. Install the free **Expo Go** app from the App Store / Play Store on any phone.
3. Scan the QR code the terminal prints. The app opens live on the device, with hot reload as
   you edit code. This is also the easiest way for **non-technical stakeholders** to preview
   progress — send them the QR code, no build/install process required.

Once you're getting close to a release and want to test something closer to the real
production binary (or the moment you add any native module Expo Go doesn't include by
default):

4. `npx eas login` (create a free Expo account if you don't have one).
5. `npx eas build:configure` (this fills in `extra.eas.projectId` in `app.json`,
   currently a placeholder).
6. `npx eas build --platform ios --profile preview` and/or
   `npx eas build --platform android --profile preview`.
7. **iOS:** add internal testers in App Store Connect → TestFlight, submit the preview build
   there. **Android:** upload the preview build to the Play Console's **Internal testing**
   track and add tester emails.

## Phase 4 — Publishing

**Accounts you need (both cost money, both are one-time account setup regardless of how many
apps you ship):**
- Apple Developer Program — $99/year — enroll at [developer.apple.com](https://developer.apple.com).
- Google Play Console — $25 one-time — enroll at [play.google.com/console](https://play.google.com/console).

**Steps:**
1. In `mobile/app.json`, replace the placeholder `ios.bundleIdentifier` and
   `android.package` (`com.yourorg.worcestertrivia`) with your real reverse-DNS identifiers.
2. Create the app record in App Store Connect and in Google Play Console (name, bundle
   ID/package, default locale).
3. Write a **privacy policy** and host it anywhere public — required by both stores because
   the app makes network requests to a third-party service (Supabase). A single static page
   describing "we fetch trivia questions from our database; we don't collect personal data"
   is sufficient if that's true for your app.
4. `npx eas build --platform ios --profile production`
   `npx eas build --platform android --profile production`
5. `npx eas submit --platform ios`
   `npx eas submit --platform android`
   (first run of each will prompt for your Apple/Google credentials and store them for next
   time via EAS)
6. Fill in store listing metadata: screenshots, description, age rating questionnaire, privacy
   policy URL, content rating. Both stores review this before the app goes live — budget a
   few days for the first submission especially.

**After that:** any pure-content change (new/edited questions) needs none of the above ever
again — it's just an edit in Supabase Studio. Any pure-JS code change can often ship via
`npx eas update` (OTA) without a new store review at all. Only native-module changes or store
metadata changes require a new `eas build` + `eas submit` cycle.

---

**Verification performed in this session:** `npx tsc --noEmit` was run against the full
scaffold (config, types, services, hook, components, `App.tsx`) with zero errors — the schema
shape, TypeScript types, row-normalization function, bundled fallback data, and the game-logic
hook all fit together correctly. Running the app on a physical device (Phase 3) and everything
in Phase 2 requiring your own Supabase project, and all of Phase 4, could not be executed in
this session and are the concrete next steps above.
