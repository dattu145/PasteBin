# Pastebin Lite (MERN-ish Stack)

A simple, secure pastebin application built with a **Node.js/Express** backend and a **React/Vite** frontend.

## Architecture

This project is structured as a monorepo setup:

-   **`server/`**: The Node.js Express backend. Handles API requests, interactions with Supabase, and serves the static frontend in production.
-   **`client/`**: The React application (Vite + TypeScript). Handles the UI and client-side routing.

## Features

-   **Create Pastes**: Share text snippets easily.
-   **Security**: Content is stored securely in Supabase.
-   **Expiration**: Set TTL (Time To Live) for auto-deletion (logic handled at read-time).
-   **View Limits**: Restrict how many times a paste can be viewed (Atomic increments).
-   **Dark Mode**: Sleek, modern One Dark inspired UI.

## Local Development

1.  **Install dependencies** (Root, Client, and Server):
    ```bash
    npm install
    cd client && npm install
    cd ..
    ```

2.  **Environment Variables**:
    Create `.env` in the root (or `server/` directory, it will be loaded):
    ```env
    NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
    PORT=3002
    ```

3.  **Run Development Environment**:
    This starts both the Backend (port 3002) and Filter (port 5173/5174) concurrently.
    ```bash
    npm run dev
    ```

4.  **Access the App**:
    Open the URL shown in the terminal (e.g., [http://localhost:5173](http://localhost:5173)).
    The frontend will communicate with the backend API at `http://localhost:3002`.

## Production Build

To run the application in production mode where Node.js serves the frontend:

1.  **Build the Client**:
    ```bash
    npm run build
    ```
    (This runs `vite build` in `client/` and puts artifacts in `client/dist`).

2.  **Start the Server**:
    ```bash
    npm start
    ```
    This runs `server/server.ts`, which serves the API and the static files from `client/dist`.

## File Structure

```
├── client/                # React setup
│   ├── src/
│   │   ├── App.tsx        # Router
│   │   ├── PasteCreate.tsx# Home Form
│   │   ├── PasteView.tsx  # View Page
│   │   └── index.css      # Styles
│   └── vite.config.ts
├── server/                # Node setup
│   ├── server.ts          # Entry point
│   ├── routes/
│   │   ├── pastes.ts      # API Logic
│   │   └── healthz.ts
│   └── lib/
│       └── supabase.ts
├── package.json           # Root scripts (concurrently, etc.)
└── .env
```
