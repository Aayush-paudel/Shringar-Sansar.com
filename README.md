# Shringar Sansar — Website

A React + Vite storefront prototype for Shringar Sansar (Bharatpur, Nepal).
Data (cart, products, orders) persists in the browser via localStorage — this
is a frontend-only prototype, not a shared multi-user database.

## Run locally

npm install
npm run dev

Open http://localhost:5173

## Build for production

npm run build
npm run preview

## Deploy

### Vercel (recommended)
1. Push this folder to a GitHub repo.
2. Go to vercel.com -> Add New Project -> import the repo.
3. Framework preset: Vite. Build command: npm run build. Output dir: dist.
4. Deploy.

### Netlify (drag and drop)
1. Run: npm run build
2. Go to app.netlify.com/drop
3. Drag the dist/ folder in.

### Any static host
Run npm run build, then upload the contents of dist/ to your web server
(Apache, Nginx, S3, etc). Any static file host works since this is a
client-side-only app.

## Admin access
Demo password: shringar123
Change this in src/App.jsx (AdminGate component) before going live.
