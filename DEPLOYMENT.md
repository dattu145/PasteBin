# Pastebin Lite - Render Deployment Guide

## Prerequisites
- GitHub account with your code pushed
- Render account (sign up at render.com)
- Supabase project with your database

## Deployment Steps

### 1. Push Your Code to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file

### 3. Configure Environment Variables

In the Render dashboard, add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NODE_ENV`: production (already set in render.yaml)
- `PORT`: 3002 (already set in render.yaml)

### 4. Deploy

Click **"Create Web Service"** and Render will:
1. Install dependencies
2. Build the React frontend
3. Compile the TypeScript backend
4. Start the server

### 5. Get Your URL

After deployment, Render will give you a URL like:
```
https://pastebin-lite.onrender.com
```

## Important Notes

- **Free tier**: First request after inactivity may take 30-50 seconds (cold start)
- **Environment variables**: Make sure to add your Supabase credentials
- **Build time**: Initial build takes 3-5 minutes
- **Automatic deploys**: Push to GitHub = auto-deploy on Render

## Testing

Once deployed, test these endpoints:
- `https://your-app.onrender.com/` - React frontend
- `https://your-app.onrender.com/api/healthz` - Backend health check
- Create a paste and verify it works

## Troubleshooting

If deployment fails:
1. Check Render build logs
2. Verify environment variables are set
3. Make sure your Supabase database is accessible
4. Check that build script completed successfully

## Local Testing Before Deploy

```bash
# Build the production version locally
npm run build

# Start the production server
npm start

# Visit http://localhost:3002
```
