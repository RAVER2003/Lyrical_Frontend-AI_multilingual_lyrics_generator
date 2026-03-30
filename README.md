# Lyrical Frontend

A React + TypeScript + Vite frontend for a lyrics-focused product.  
This project currently includes:

- a routed app shell
- an auth/demo page
- a lyrics translation page
- a translation output preview with line-by-line reveal
- shadcn-style UI primitives used in the current screens
- a placeholder translation service ready to be replaced by a real backend/model call

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- shadcn-style UI components
- Sonner for toast notifications

## Available Routes

- `/auth`
  Demo login/signup page

- `/text-preview`
  Lyrics translation input/output page

The app redirects `/` to `/auth`.

## Current Translation Flow

The translation page is already structured for an AI/ML flow:

1. User writes source lyrics in the left editor
2. User clicks `Translate lyrics`
3. The input is sent to a translation service
4. Returned text is shown on the right
5. The response appears line by line with auto-follow behavior

Right now the service is still a placeholder:

- File: [src/services/lyrics/translate-lyrics.ts](./src/services/lyrics/translate-lyrics.ts)
- It currently normalizes the input and returns it after a short delay

Later, you can replace that function with a real API request.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Run linting

```bash
npm run lint
```

### 5. Preview production build

```bash
npm run preview
```

## Project Structure

```text
src/
  components/
    layout/
    theme/
    ui/
  lib/
  pages/
  services/
    api/
    lyrics/
  App.tsx
  index.css
  main.tsx
```

### Important folders

- `src/components/layout`
  Shared layout like the app shell

- `src/components/theme`
  Theme provider and theme toggle

- `src/components/ui`
  shadcn-style UI primitives used by the app

- `src/pages`
  Route-level pages

- `src/services/api`
  Shared API client setup

- `src/services/lyrics`
  Lyrics-specific service logic

- `src/lib`
  Shared helpers, routes, and text formatting utilities

## UI Components

The current UI layer uses shadcn-style component patterns for:

- `Button`
- `Card`
- `Textarea`
- `Badge`
- `Sonner` toaster

Relevant files:

- [src/components/ui/button.tsx](./src/components/ui/button.tsx)
- [src/components/ui/card.tsx](./src/components/ui/card.tsx)
- [src/components/ui/textarea.tsx](./src/components/ui/textarea.tsx)
- [src/components/ui/badge.tsx](./src/components/ui/badge.tsx)
- [src/components/ui/sonner.tsx](./src/components/ui/sonner.tsx)

## Backend Integration

The shared Axios client lives here:

- [src/services/api/http.ts](./src/services/api/http.ts)

It uses:

- `VITE_API_BASE_URL`

Default fallback:

```text
http://localhost:3000/api
```

### Example `.env` value

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## How To Replace The Placeholder Translation Service

Update:

- [src/services/lyrics/translate-lyrics.ts](./src/services/lyrics/translate-lyrics.ts)

Recommended direction:

```ts
import { http } from "@/services/api"

export async function translateLyrics({ input }: { input: string }) {
  const response = await http.post("/translate-lyrics", { input })
  return response.data.output
}
```

Expected frontend behavior is already ready for this:

- loading state
- disabled relevant actions while processing
- right-side waiting state
- gradual line-by-line reveal after response

## Notes

- The text areas and preview support Unicode input/output, so multilingual scripts can be used.
- Right panel copy options are stored in:
  [public/right-panel-copy-options.txt](./public/right-panel-copy-options.txt)

## Next Improvements

- connect the real translation backend
- add auth/backend integration for the auth page
- add route protection if auth becomes real
- add request cancellation and retry handling
- add persistent translation history
