# Bar Joist Capacity Calculator

SJI K-Series bar joist capacity calculator for structural engineers.  
ASD load combinations · Simply supported beam analysis · Imperial units.

## Features

- **Tab 1 — Existing Joist Capacity**: Select from 60 K-series joist designations (10K1–30K12) with auto-populated load data from Vulcraft ASD tables. Computes moment, shear, and deflection with interactive diagrams.
- **Tab 2 — Joist With Additional Load**: Apply uniform roof loads (psf × spacing), additional partial uniform loads, and point loads with Dead/Live load type classification. Full superposition analysis with capacity comparison.

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel

### Option A: GitHub → Vercel (recommended)

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/bar-joist-calculator.git
   git push -u origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Vercel auto-detects Vite — just click **Deploy**
5. Done! Your app is live.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. Vercel auto-detects the Vite framework.

## Build for Production

```bash
npm run build
```

Output goes to `dist/` folder — can be hosted on any static file server.

## Tech Stack

- React 18
- D3.js (diagrams)
- Vite (build tool)
- No backend required — runs entirely client-side
