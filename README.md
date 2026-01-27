# Pastebin Lite

A simple pastebin web application where users can share text content with optional expiration and view limits.

## Tech Stack

- **Frontend**: React (Vite) + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)

## Features

- Create and share text snippets with a unique URL
- Set expiration time (in seconds)
- Limit number of views
- Automatic view counting

## Local Setup

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([signup here](https://supabase.com))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pastebin-lite
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Set Up Supabase Database

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run this query:

```sql
create table pastes (
  id text primary key,
  content text not null,
  expires_at timestamptz,
  max_views int,
  current_views int default 0,
  created_at timestamptz default now()
);

create function increment_view_count(row_id text)
returns void as $$
  update pastes set current_views = current_views + 1 where id = row_id;
$$ language sql;
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
PORT=3002
```

Replace with your actual Supabase project URL and anon key (found in **Project Settings > API**).

### 5. Run the Application

```bash
npm run dev
```

This will start:
- **Backend server** at `http://localhost:3002`
- **Frontend** at `http://localhost:5173` (or next available port)

### 6. Open in Browser

Visit `http://localhost:5173` to use the application.

## API Endpoints

- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Retrieve a paste
- `GET /api/healthz` - Health check

## Project Structure

```
pastebin-lite/
├── client/           # React frontend
│   └── src/
├── server/           # Express backend
│   ├── routes/
│   └── lib/
└── package.json
```
