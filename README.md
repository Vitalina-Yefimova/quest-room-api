# Quest Room — API

NestJS backend for the Quest Room app: auth (phone / email, JWT, cookies), quest catalog (MongoDB), user profile, orders, favorites, transactional email (SendGrid) and SMS / OTP (Twilio). User data and orders are stored in **PostgreSQL** via **Prisma**; quest content and related documents use **MongoDB** (Mongoose).

**Source:** [github.com/Vitalina-Yefimova/quest-room-api](https://github.com/Vitalina-Yefimova/quest-room-api) · **Live API:** [quest-room-api.vercel.app](https://quest-room-api.vercel.app)

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)

## Features

- `/auth` — register, login, phone / email flows, JWT (Bearer + `access_token` cookie where used)
- `/quests` — public quest list and details (MongoDB)
- `/users` — profile and related user operations (Prisma)
- `/orders` — booking / orders
- `/favorites` — user favorites
- `/email` — outbound email (SendGrid) when configured
- Global **ValidationPipe**, **cookie-parser**, **CORS** from `FRONTEND_URL`, **JWT** guard with `@Public()` for open routes

## Stack

NestJS 11 · TypeScript 5 · Prisma 6 + PostgreSQL · Mongoose 8 + MongoDB · Zod (env) · class-validator / class-transformer · `@nestjs/jwt` · passport-jwt · bcrypt · SendGrid · Twilio

---

## Environment

Server env is loaded with **`dotenv/config`** and validated in [`src/utils/config.ts`](src/utils/config.ts) with Zod **`schema.parse()`** (invalid or missing required keys fail at startup).

Copy [`.env.example`](.env.example) to **`.env`** and fill in real values. On Vercel (or another host), set the same keys in the project **Environment Variables** UI.

| Variable            | Notes |
| ------------------- | ----- |
| `PORT`              | HTTP port (e.g. `3000` locally). |
| `FRONTEND_URL`      | **Exact** browser origin(s) for CORS with `credentials: true` — comma-separated, e.g. deployed Next.js app **and** local frontend origin for dev. Full URLs are OK; they are normalized to `origin` in code. |
| `DATABASE_URL`      | PostgreSQL connection string for Prisma. |
| `MONGODB_URI`       | MongoDB (local or Atlas). |
| `JWT_SECRET`        | Long random string for signing JWTs. |
| `JWT_EXPIRES_IN`    | JWT lifetime (e.g. `7d`, `1d`). |
| `SENDGRID_API_KEY`  | Optional; email features need a real key. |
| `TWILIO_*`          | Optional; SMS / OTP need all three when used. |

### CORS and the Next.js frontend

The UI lives in a **separate repo** and a different origin in production. The API sets `Access-Control-Allow-Origin` from **`FRONTEND_URL`** and enables **`credentials: true`**, so the browser only accepts responses when the frontend origin is listed.

**Frontend (Next.js):** [**Vitalina-Yefimova/quest-room-nextjs-frontend**](https://github.com/Vitalina-Yefimova/quest-room-nextjs-frontend) — set **`API_BASE_URL`** to this API’s public URL for production. Live demo: [quest-room-nextjs-frontend.vercel.app](https://quest-room-nextjs-frontend.vercel.app/).

**Backend (this repo):** [**Vitalina-Yefimova/quest-room-api**](https://github.com/Vitalina-Yefimova/quest-room-api).

**Local dev:** e.g. API `http://localhost:3000` and Next.js `http://localhost:3000` (or your actual local frontend origin) — include the frontend origin(s) in `FRONTEND_URL` when testing cross-origin with cookies.

---

## Run locally

**Node.js 20+** recommended.

1. **PostgreSQL** — e.g. Docker from the repo root:

   ```bash
   docker compose up -d
   ```

   Default in [`.env.example`](.env.example) matches `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` in [`docker-compose.yml`](docker-compose.yml).

2. **MongoDB** — run locally or point `MONGODB_URI` to Atlas.

3. Install and env:

   ```bash
   npm install
   cp .env.example .env    # Windows: copy .env.example .env
   # Edit .env — all required keys must be set (see table above).
   ```

4. **Prisma** (after PostgreSQL is up):

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Start the API:

   ```bash
   npm run start:dev       # http://localhost:3000 (or your PORT)
   ```

Other scripts:

```bash
npm run build
npm run start:prod
npm run lint
npm run seed              # seed MongoDB quests (see src/seeds/quests)
```

---

## Deploy (e.g. Vercel)

Set the same environment variables as in production **`.env`**. The app expects **`DATABASE_URL`**, **`MONGODB_URI`**, **`JWT_*`**, and **`FRONTEND_URL`** at minimum. Build command is typically **`npm run build`**; start command **`npm run start:prod`** (or the platform’s Nest/serverless adapter if you use one).

---

## Repo layout

```
src/main.ts              # bootstrap: cookies, CORS, ValidationPipe, JwtAuthGuard, PORT
src/utils/config.ts      # validated env + corsOrigins()
src/app.module.ts
src/auth/
src/users/
src/quests/
src/orders/
src/favorites/
src/email/
src/sms/
src/prisma/
prisma/schema.prisma
prisma/migrations/
```

---

## License & `private`

[`package.json`](package.json) sets **`"private": true`** — this package is not intended for **`npm publish`**. No separate open-source license file is included here; treat as personal / portfolio use unless you add one.
