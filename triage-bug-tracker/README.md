# Triage Bug Tracker

JavaScript recreation of the Triage application using Next.js App Router. The UI pages, shared components, Supabase integrations, and Supabase Edge Functions are ported from the TypeScript/Vite source while keeping the existing Supabase project, schema, data, and authentication flows.

## Requirements

- Node.js compatible with Next.js 16
- The existing Supabase project URL and publishable (or anon) key

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SUPABASE_PROJECT_ID` to the existing Supabase project values.
3. Install dependencies and start Next.js:

   ```powershell
   npm install
   npm run dev
   ```

4. Open <http://localhost:3000>.

The application reports a configuration error when Supabase is first used if its URL or public key is missing. Never put a Supabase service-role key in a `NEXT_PUBLIC_*` variable.

## Commands

```powershell
npm run dev
npm run build
npm run start
npm run lint
npm test
```

The source project only had a placeholder test, so the target test command runs converted JavaScript tests in `src/test`.

## Application routes

- `/` — marketing landing page
- `/auth` — sign in and sign up
- `/dashboard` — protected dashboard
- `/bugs` — protected bug list
- `/bugs/new` — protected bug report form
- `/bugs/:id` — protected bug detail and activity
- `/analytics` — protected analytics
- `/settings` — protected profile and company settings
- `/mcp-setup` — protected MCP setup information
- `/.lovable/oauth/consent` — OAuth consent

Supabase Edge Function source remains in `supabase/functions`; deploy/configure those functions against the existing Supabase project using the Supabase CLI and the project's current secrets.
