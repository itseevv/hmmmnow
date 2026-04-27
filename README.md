# HmmmNow 🚽

在伦敦突然 Hmmmm？帮你快速找到附近能去的厕所。

London-only Chinese-language toilet rescue PWA for Chinese-speaking tourists.

## Run locally

```bash
npm install
npm run dev
```

The app works with mock data out of the box — no Supabase required for development.

## Environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase setup

Run these SQL statements in your Supabase SQL editor:

```sql
create table toilets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  access_type text not null,
  code text,
  tip text,
  hmmm_note text,
  opening_hours text,
  confidence text,
  last_checked date,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table pending_toilets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area_or_address text,
  access_type text,
  code text,
  tip text,
  hmmm_note text,
  extra_note text,
  created_at timestamp with time zone default now()
);
```

## Deploy to Vercel

```bash
npm run build
```

Then connect the repo to Vercel. Set the environment variables in Vercel's dashboard.

Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- Supabase
- Leaflet + OpenStreetMap
- vite-plugin-pwa
