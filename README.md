# Bugops - Daily Task Manager

A calendar-first task management web app with Supabase auth and database.

## Setup

### 1. Run the Supabase schema

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **SQL Editor** → **New Query**
3. Copy the contents of `supabase-schema.sql` and run it

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

`.env.local` is already set with your Supabase credentials. If needed:

```
NEXT_PUBLIC_SUPABASE_URL=https://bpkpgshnrxblujlkggxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
