# #Python — Family Python Course

Interactive Python course with in-browser code execution and automatic exam grading.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router v6
- Supabase (auth + progress)
- Pyodide (Python in the browser)
- CodeMirror 6 (code editor)
- Cloudflare Pages (hosting)

## Setup

### 1. Supabase
1. Go to https://supabase.com → create a new project
2. Go to SQL Editor → paste the contents of `supabase/schema.sql` → Run
3. Go to Project Settings → API → copy `URL` and `anon public` key

### 2. Environment variables
```
cp .env.example .env
```
Fill in your Supabase values:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally
```
npm install
npm run dev
```

### 4. Deploy to Cloudflare Pages
See deployment instructions below.
