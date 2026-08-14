# Muthaleetu Thisai - Full-Stack Vercel + Supabase Platform

A production-grade, bilingual (Tamil & English) Mutual Fund and Investment platform hosted on Vercel (Serverless Functions + Cron) with Supabase (Postgres Database + Supabase Auth).

---

## 🌟 Key Features

1. **Automated Low-Quota Video Ingestion**:
   - Polls YouTube Data API v3 (`playlistItems.list` on uploads playlist, costing only 1 quota unit).
   - Diffs video IDs against database records; fetches details only for new videos.

2. **Protected-Term Tamil to English Translation**:
   - Translates Tamil video titles & descriptions to English using Google Cloud Translation v2 REST API.
   - Protects proper nouns, brand names, and financial terms (e.g. `NIFTY 50`, `SENSEX`, `SIP`, `Mutual Fund`, `Muthaleetu Thisai`, `Budget Padmanaban`, URLs, handles) using placeholder token masking before translation, then restores them.
   - Non-blocking translation retries: If translation fails, Tamil content is saved immediately, and marked for retry on subsequent cron runs.

3. **Public Read REST API with Cache-Control**:
   - `GET /api/videos?page=1&limit=20&category=mutual-funds` (Paginated list with both `title_ta`/`title_en` and `description_ta`/`description_en`).
   - `GET /api/videos/:youtubeId` (Single video details).
   - `Cache-Control: s-maxage=60, stale-while-revalidate=300`.

4. **Supabase Authentication**:
   - Google OAuth, Email/Password, Passwordless Magic Link OTP, and Password Reset flows.
   - Row-Level Security (RLS) policies protecting user profiles and watch history.
   - Server-side JWT role verification for Admin routes (`/api/admin/*`).

5. **Admin Console**:
   - Dashboard telemetry: Total videos, pending translations, registered users, weekly signups.
   - Video management: Category/tags editing, manual translation retries, and trending video toggles.

---

## 🚀 Environment Setup & Deployment

### 1. Database & Schema Initialization (Supabase / Postgres)
1. Log into your [Supabase Dashboard](https://supabase.com) and create a new project.
2. Go to **SQL Editor** and paste the contents of [`schema.sql`](./schema.sql).
3. Execute the SQL script. This creates the `videos`, `profiles`, and `watch_history` tables, indexes, `is_admin()` function, user creation trigger, and RLS policies.

### 2. Configure Google OAuth in Supabase
1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com).
2. Set authorized redirect URI to `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`.
3. In Supabase Dashboard, navigate to **Authentication -> Providers -> Google**, enable it, and enter your Client ID and Client Secret.

### 3. Environment Variables Configuration (`.env`)
Create a `.env` file (refer to `.env.example`):

```env
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=UCWD5lYsFycgIDyCB_EHpYOQ

# Google Cloud Translation v2 REST API
TRANSLATE_API_KEY=your_google_translate_api_key

# Postgres Database Connection
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Supabase Credentials
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Ingestion Cron Secret (Bearer token)
CRON_SECRET=your_super_secret_cron_token

# Brand Config
COMPANY_NAME=Muthaleetu Thisai
CHANNEL_NAME=Budget Padmanaban
```

---

## 📦 Deployment to Vercel

Deploy using the Vercel CLI:

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link & Deploy to Staging
vercel

# 4. Set Environment Variables on Vercel
vercel env add YOUTUBE_API_KEY
vercel env add YOUTUBE_CHANNEL_ID
vercel env add TRANSLATE_API_KEY
vercel env add DATABASE_URL
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add CRON_SECRET

# 5. Deploy to Production
vercel --prod
```

---

## ⏱️ Vercel Hobby Plan Scheduling Caveat

> [!NOTE]
> Vercel's **Hobby (Free)** plan limits cron execution to **once per day** (`0 0 * * *` as set in `vercel.json`).
>
> If you require more frequent video polling (e.g. every 15 minutes) without upgrading to Vercel Pro:
> - You can trigger `/api/cron/fetch-videos` from an external free scheduler (such as GitHub Actions cron or [cron-job.org](https://cron-job.org)).
> - Send an HTTP GET or POST request to `https://your-domain.vercel.app/api/cron/fetch-videos` with the header:
>   `Authorization: Bearer <CRON_SECRET>`
> - The endpoint validates `CRON_SECRET` identically regardless of who invokes it.
