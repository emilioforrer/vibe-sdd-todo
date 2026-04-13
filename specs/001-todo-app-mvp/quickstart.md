# Quickstart: Todo App MVP

**Branch**: `001-todo-app-mvp` | **Date**: 2026-04-13

---

## Prerequisites

- Node.js LTS (≥ 20.x)
- npm or pnpm (pick one; be consistent)

---

## 1. Initialise the Nuxt Project

```bash
# From the repository root
npx nuxi@latest init . --no-git-init
```

Choose: TypeScript ✅ | Package manager: npm (or pnpm)

---

## 2. Install Dependencies

```bash
npm install
npm install -D tailwindcss @nuxtjs/tailwindcss @nuxtjs/google-fonts
```

---

## 3. Configure Nuxt

**`nuxt.config.ts`**:

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],
  googleFonts: {
    families: {
      'Press Start 2P': true,
      'Space Mono': [400, 700],
    },
    display: 'swap',
  },
  // Static generation — no server required
  ssr: false,
})
```

---

## 4. Configure Tailwind

**`tailwind.config.ts`**:

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#d946ef',
        'neon-violet': '#8b5cf6',
        'dark-bg':     '#0d0015',
        'dark-card':   '#1a0033',
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'monospace'],
        mono:  ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-sm': '0 0 6px #d946ef, 0 0 12px #a21caf',
        'neon-md': '0 0 10px #d946ef, 0 0 24px #a21caf, 0 0 40px #7e22ce',
        'neon-lg': '0 0 16px #d946ef, 0 0 40px #a21caf, 0 0 70px #6b21a8',
      },
    },
  },
} satisfies Config
```

---

## 5. Project Structure to Scaffold

```
pages/index.vue
components/TodoInput.vue
components/TodoList.vue
components/TodoItem.vue
composables/useTodos.ts
assets/css/main.css
```

---

## 6. Run in Development

```bash
npm run dev
```

App available at `http://localhost:3000`.

---

## 7. Build for Production (Static)

```bash
npx nuxi generate
# Output in .output/public/ — deploy to any static host
```

---

## 8. Run Tests

```bash
npm install -D vitest @nuxt/test-utils
npx vitest run
```

---

## Key Implementation Notes

- **`useTodos` composable** is the only place that reads/writes `localStorage`. Components never touch `localStorage` directly.
- Wrap all `localStorage` calls in `try/catch` — surface `storageError` as a dismissible banner in the UI.
- Use `import.meta.client` (not `process.client`) for all browser-only guards in Nuxt 3.
- The page background should use `bg-dark-bg` with a subtle CSS grid/scanline pattern achievable via Tailwind's `bg-[size]` utilities — no additional packages.
- Todo `id` generation: use `crypto.randomUUID()` (available in all modern browsers and Node 14.17+).
