# NovaBoard

Project hub for NovaStack Studio. Boards, priorities, teams, and a timeline, with Supabase as the database when you are ready.

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase keys the app stores a demo workspace in the browser. Creating issues, projects, users, and teams still works.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql`.
3. Optional: run `supabase/seed.sql` for the sample NovaStack workspace.
4. Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Restart `npm run dev`. Settings shows whether the database connected.

The SQL policies allow the anon key to read and write so the app works before auth is added. Tighten those policies before a public launch. Inngest is not wired yet.

## Deploy

`npm run build` produces a standard Next.js app you can host on AWS Amplify. Set the same two environment variables in the Amplify console.
