# KeybCompare Version 3

A polished Next.js keyboard comparison website with shadcn-style UI, richer specs, and a catalog-driven data layer.

## What changed

- cleaner premium dark UI
- larger product gallery cards
- deeper compare tables
- extra specs including sound profile, battery life, latency, mounting, materials, software, weight, and actuation range
- easier filters for wireless and rapid-trigger boards

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Main catalog file

Edit keyboard data here:

```text
data/keyboards.ts
```

## Deploy

Push to GitHub and connect to Vercel.
Make sure Vercel is set to:

- Framework Preset: **Next.js**
- Output Directory: **blank**
