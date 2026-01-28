# Production API Connection Fix

## Problem
The production build was trying to connect to `http://localhost:3002/api/pastes`, which doesn't work in production because:
- `localhost` refers to the user's browser machine, not your server
- The API needs to use the same domain as the deployed application

## Solution
Implemented environment-based API URL configuration:

### Development (Local)
- Uses `http://localhost:3002/api` (separate backend server)
- Configured in `client/.env.development`

### Production (Render)
- Uses `/api` (relative URL, same domain)
- Configured in `client/.env.production`

## Changes Made

1. **Created Environment Files:**
   - `client/.env.development` - Contains `VITE_API_BASE_URL=http://localhost:3002/api`
   - `client/.env.production` - Contains `VITE_API_BASE_URL=/api`

2. **Updated API Configuration:**
   - `client/src/PasteCreate.tsx` - Now uses `import.meta.env.VITE_API_BASE_URL`
   - `client/src/PasteView.tsx` - Now uses `import.meta.env.VITE_API_BASE_URL`

3. **Updated .gitignore:**
   - Added comments to clarify that `.env.development` and `.env.production` are tracked

## How to Deploy

1. **Commit and Push Changes:**
   ```bash
   git add .
   git commit -m "Fix production API endpoint configuration"
   git push origin main
   ```

2. **Render will automatically:**
   - Detect the changes
   - Run the build command: `npm install; cd client && npm install && cd ..; npm run build`
   - Use the production environment file (`.env.production`)
   - Deploy with the correct API URL (`/api`)

## How It Works

### In Development:
```typescript
// Uses http://localhost:3002/api
const API_Base = import.meta.env.VITE_API_BASE_URL || '/api';
```

### In Production:
```typescript
// Uses /api (relative to current domain)
const API_Base = import.meta.env.VITE_API_BASE_URL || '/api';
```

When you make a request to `/api/pastes` in production:
- Browser: `https://paste-bin-5ydu.onrender.com/api/pastes`
- Server handles both frontend and API on the same domain ✅

## Testing Locally

Run the development server:
```bash
npm run dev
```

Build and test production build:
```bash
npm run build
npm start
```

## Environment Variables Reference

### Vite Environment Variables
- Must be prefixed with `VITE_` to be exposed to client-side code
- `import.meta.env.VITE_API_BASE_URL` - API base URL
- `import.meta.env.MODE` - Current mode ('development' or 'production')

### Automatic Loading
Vite automatically loads:
- `.env.development` when running `npm run dev`
- `.env.production` when running `npm run build`

## Troubleshooting

If you still see the error after deployment:

1. **Clear Browser Cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
   - Clear site data in DevTools

2. **Verify Build:**
   - Check Render deployment logs
   - Ensure build completed successfully
   - Verify the production bundle is using `/api`

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for API requests
   - Should show: `https://paste-bin-5ydu.onrender.com/api/pastes` ✅
   - Not: `http://localhost:3002/api/pastes` ❌

## Notes

- The fallback `|| '/api'` ensures the app works even if the environment variable isn't loaded
- Both `.env.development` and `.env.production` are committed to Git (they don't contain secrets)
- Use `.env.local` for local overrides with sensitive data (this file is ignored by Git)
