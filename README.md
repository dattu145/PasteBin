# Pastebin Lite

A simple, secure pastebin application built with Next.js and Supabase.

## Features

-   **Create Pastes**: Share text snippets easily.
-   **Security**: Content is stored securely in Supabase.
-   **Expiration**: Set TTL (Time To Live) for auto-deletion (logic handled at read-time).
-   **View Limits**: Restrict how many times a paste can be viewed (Atomic increments).
-   **Dark Mode**: Sleek, modern UI.

## File Structure

```
├── app/
│   ├── api/
│   │   ├── healthz/       # Health check endpoint
│   │   └── pastes/        # Create and Read API routes
│   │       └── [id]/      # Dynamic route for specific paste
│   ├── p/
│   │   └── [id]/          # View Paste Page (Server Component)
│   ├── globals.css        # Global styles & Design Tokens
│   └── page.tsx           # Home Page / Create Paste Form (Client Component)
├── lib/
│   ├── pastes.ts          # Shared logic for fetching/incrementing views
│   ├── supabase.ts        # Supabase client singletons
│   └── utils.ts           # Utility functions (ID generation, etc.)
├── .env                   # Environment variables
└── supabase_schema.sql    # SQL to create tables in Supabase
```

## How to run the app locally

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Supabase**:
    -   Create a project at [https://supabase.com](https://supabase.com).
    -   Go to **Project Settings -> API** and copy `URL` and `anon public key`.
    -   Paste them into `.env`:
        ```env
        NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
        NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
        ```
    -   Run the SQL found in `supabase_schema.sql` in your Supabase **SQL Editor** to create tables and functions.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000).

## Persistence Layer

This application uses **Supabase (PostgreSQL)** for persistence.
-   **Direct Connection**: Uses `@supabase/supabase-js` for robust, real-time ready data access.
-   **Atomic Operations**: Uses Postgres Functions (RPC) to atomically increment view counts, ensuring strict view limits even under high concurrency.
-   **Deployment**: Zero-config deployment on Vercel (just add the env vars).

## Design Decisions

-   **Supabase over Prisma**: For a "Pastebin-like" app, Supabase offers a streamlined API, built-in Row Level Security (RLS), and a simpler deployment story without managing database proxies/connection pools manually.
-   **Server-Side Rendering (SSR)**: Paste views are rendered on the server for speed and SEO.
-   **Client-Side Interactivity**: The creation form uses React Client Components for a responsive UX.
