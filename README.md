# Signal Decoder

A small React + TypeScript game built with Vite. Watch a pattern of flashing squares, then select the same squares to decode the signal. Progress through predefined levels with increasing difficulty and keep track of your score.

## Tech Stack
- **Build tool**: Vite (TypeScript, React plugin)
- **UI**: React 19, React DOM 19
- **Language**: TypeScript 5
- **Linting**: ESLint 9

## Getting Started

### Prerequisites
- Node.js 18+ (recommended LTS)

### Install
```bash
npm install
```

### Run in development
```bash
npm run dev
```
This starts Vite’s dev server. Open the printed URL (typically `http://localhost:5173`).

### Build for production
```bash
npm run build
```
Outputs production assets to `dist/`.

### Preview the production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Project Structure

```
signal-decoder/
  index.html            # HTML shell and app entry reference
  src/
    main.tsx           # React entry: mounts <App /> to #root
    App.tsx            # Game UI and state management
    components/
      Grid.tsx         # Grid component rendering cells and interactions
    rules.ts           # Level definitions (titles, hints, dimensions/targets)
    useFlasher.ts      # Timing/phase hook that controls flashing + countdown
    types.ts           # Shared TypeScript types
    App.css, index.css # Styles
  vite.config.ts       # Vite config with React plugin
  package.json         # Scripts and dependencies
```

## How the index/entry works (Vite + React)

Vite uses `index.html` as the HTML entry during development. That file references your JavaScript/TypeScript entry via a module script tag.

Key files in this project:

```1:14:signal-decoder/index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>signal-decoder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- `index.html` provides the HTML shell and a `div` with `id="root"`.
- The `<script type="module" src="/src/main.tsx">` line tells Vite to load `src/main.tsx` as the JS/TS entry.

The `src/main.tsx` file bootstraps React and mounts the root component into the `#root` element:

```1:11:signal-decoder/src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

During `npm run dev`, Vite serves `index.html`, follows the module script to `src/main.tsx`, and performs on-demand compilation and HMR. During `npm run build`, Vite uses `index.html` as the HTML entry and bundles `src/main.tsx` and its imports to optimized assets in `dist/`.

## Game Overview

- **Phases**: The game cycles through `flashing → selecting → result`.
- **Flashing**: `useFlasher` controls whether cells are visibly flashing and counts down the time for the current level.
- **Selecting**: After flashing stops, you can click cells in the `Grid` to select your guess.
- **Result**: On submit, your selection is compared with the target pattern for the level:
  - Correct selections add to score; incorrect selections subtract (never below 0).
  - Missed cells are shown in the results summary.
- **Levels**: Defined in `rules.ts` with `level`, `title`, `description`, and `hint`. Use the toolbar to restart, skip, or proceed to the next level.
 - **Indexing note**: Grid indices start at 0.

## Key Modules

- `App.tsx`: Manages high-level game state (level index, phase mirroring, selection set, scoring, transitions). Renders top bar, instructions, and controls.
- `components/Grid.tsx`: Renders the grid of cells, visual flashing state, selection toggling, and result highlighting.
- `useFlasher.ts`: Provides the timing and phase state machine: tracks `phase`, `isOn` (flashing), `timeLeftMs`, `target` set, and `resetAndStart(level)` to restart timers/targets.
- `rules.ts`: Supplies level metadata and target generation parameters.
- `types.ts`: Type definitions for payloads like `CheckResult`.

## Configuration

`vite.config.ts` enables the React plugin for JSX/TSX and fast refresh:

```1:8:signal-decoder/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

## Deployment Notes

The app is a static SPA after build. You can deploy the contents of `dist/` to any static host (Netlify, Vercel, GitHub Pages, S3/CloudFront, etc.). If the app is not served from the domain root, set Vite’s `base` option accordingly.

## Scripts

- `npm run dev`: Start dev server
- `npm run build`: Type-check and build production assets
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint

## Troubleshooting

- Blank page in production: ensure the `base` path matches hosting subpath.
- CSS not applying: verify `index.css` is imported in `main.tsx`.
- HMR not updating: restart `npm run dev` and clear browser cache.
