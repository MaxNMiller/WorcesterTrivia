# Worcester Trivia — Mobile

Expo + React Native + TypeScript port of `../TriviaGame.jsx`, backed by a Supabase CMS so
non-technical teammates can add/edit trivia questions without touching code.

- **`docs/ARCHITECTURE.md`** — tech stack rationale, CMS comparison, data schema, offline
  strategy, and a checklist of what's fully ported vs. still to build.
- **`docs/DEPLOYMENT_ROADMAP.md`** — the four phases from here to live App Store/Play Store
  listings.

## Quick start

```bash
cd mobile
npm install                      # already done if you just cloned this
cp .env.example .env             # then fill in your Supabase URL + anon key
npx expo start                   # scan the QR code with the Expo Go app
```

See `docs/DEPLOYMENT_ROADMAP.md` Phase 2 for how to set up the Supabase project itself
(`supabase/schema.sql` creates and seeds everything in one paste-and-run).
