# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Arena Excel** is a gamified Excel learning platform for Brazilian users. It consists of three workspaces in a monorepo:

- `nodejs_space/` — NestJS REST API (primary backend)
- `react_native_space/` — React Native + Expo mobile app
- `nextjs_space/` — Next.js (placeholder, not actively developed)

**Language:** All user-facing text, prompts, and comments are in **Portuguese (Brazilian)**.

---

## Backend: nodejs_space/

### Commands
```bash
npm run start:dev        # Development (watch mode)
npm run build            # prisma generate + nest build
npm run start:prod       # node dist/main
npm run test             # Jest tests
npm run lint             # ESLint
npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma migrate dev   # Run new migrations
npm run prisma seed      # Seed trail questions (safe-seed.ts)
```

### Architecture
- **Framework:** NestJS with TypeScript, one module per feature
- **ORM:** Prisma 6 → PostgreSQL (Railway in production)
- **API docs:** Swagger available at `/api-docs` in development
- **File uploads:** Multer, 50MB limit, served from `uploads/` and `public/`
- **Port:** 3000 (overridden by `$PORT` env var in production)

### Module Layout (`src/`)
| Module | Purpose |
|---|---|
| `auth/` | JWT + Google OAuth, token refresh, password reset |
| `user/` | Profile, XP, level, streak, lives |
| `exercises/` | Lesson-based exercises with images |
| `trails/` | Trail-based learning paths (newer system) |
| `questions/` | Questions for trails (7 types: multiple_choice, spreadsheet, formula_builder, chart_builder, fill_in_blank, drag_drop, ordering) |
| `progress/` | User progress on lessons and trails |
| `missions/` | Daily missions system |
| `leaderboard/` | Weekly ranking |
| `badges/` | Badge collection |
| `achievements/` | Achievement unlock logic |
| `chat/` | Excelino chatbot via Anthropic Claude API |
| `planilha-ia/` | Spreadsheet analysis via Anthropic Claude API |
| `notifications/` | Push notifications via Expo Server SDK |
| `prisma/` | PrismaService (shared DB client) |
| `services/` | GoogleOAuthService, EmailService (Resend + Nodemailer) |

### AI Services (Anthropic Claude)
Both AI features use `claude-sonnet-4-6` via `@anthropic-ai/sdk`:
- **Chat** (`chat/chat.service.ts`): Excelino chatbot, 500 max tokens, responds in PT-BR, redirects off-topic questions
- **Planilha IA** (`planilha-ia/planilha-ia.service.ts`): Analyzes spreadsheet data (up to 8000 chars), returns structured analysis with emoji-formatted sections

Both require `ANTHROPIC_API_KEY` environment variable.

### Key Prisma Models
- `users` — XP, level, streak, lives, premium flag
- `trails` + `questions` — Trail learning paths with rich question types
- `usertrailprogress` + `useranswers` — Trail progress tracking
- `levels` + `lessons` + `exercises` — Legacy lesson system
- `dailymissions`, `badges`, `achievements`, `PlanilhaAnalise` — Gamification & AI usage

### Environment Variables (required)
`DATABASE_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `EXPO_ACCESS_TOKEN`

---

## Mobile: react_native_space/

### Commands
```bash
npm start            # Expo dev server
npm run android      # Android emulator
npm run ios          # iOS simulator
npm test             # Jest + Testing Library
npm run lint         # ESLint
```

### Build/Deploy
```bash
eas build --platform android   # EAS cloud build
eas submit                     # Submit to stores
```
EAS project: `da5d7d19-2572-475a-8544-0050d93771ce`, owner: `excelcomjohni`

### Architecture
- **Navigation:** React Navigation — bottom tabs (Home, Trails, Ranking, Profile) + native stack
- **State:** Context API + AsyncStorage for local persistence
- **Auth:** `expo-auth-session` for Google OAuth, JWT stored in AsyncStorage
- **Purchases:** RevenueCat (`react-native-purchases`) for premium subscriptions

### Screen Layout (`src/screens/`)
- `auth/` — Login, Register, GoogleCallbackScreen, PasswordReset
- `onboarding/` — 8-step onboarding flow (profession, goals, study time, etc.)
- `trails/` — Trail selection and question flow
- `learn/` — Legacy lesson/exercise screens
- `main/` — HomeScreen, ProfileScreen, BadgesScreen, RankingScreen, CertificateScreen, WikiExcelScreen, PlanilhaIAScreen

### Feature Limits (free vs premium)
- Chat: 10 messages/day (stored in AsyncStorage) → unlimited for premium
- Planilha IA: 3 analyses/day (tracked on backend) → unlimited for premium
- Lives: 5 max, recharge over time

### Key Components
- `ChatModal` (`components/chat/`) — floating chat UI, driven by `ChatContext`
- `PaywallModal` — premium subscription gate shown when limits are hit
- `SpreadsheetWebView` — interactive spreadsheet viewer (WebView + xlsx)

---

## Cross-Cutting Concerns

### Gamification Flow
XP gain → level up → streak tracking → daily missions → badge unlock → achievements → leaderboard ranking. Lives are consumed on wrong answers in trail questions.

### Trail vs Lesson System
The **trail system** is the primary/newer learning path (organized by profession: General, Analyst, Manager, HR, Logistics, Finance, Sales). The **lesson system** is legacy. Both coexist in the DB.

### Mascot
Excelino is the branded AI character used in chat and planilha-IA prompts. The mascot image is at `react_native_space/assets/mascots/mascot_enthusiastic.png`.

### Production Deployment
- **Backend:** Railway (with auto-seed on `startCommand`)
- **Mobile:** EAS (Expo Application Services)
- **Production URL:** https://arenaexcel.excelcomjohni.com.br
