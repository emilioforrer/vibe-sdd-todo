# VIBE TODO

A retro neo purple 80s-themed todo tracking web app built with **Vue 3**, **Nuxt 3**, and **Tailwind CSS**.

---

## Features

- Add, complete, and delete todos
- Retro neo purple / synthwave visual theme with neon glow effects
- Todos persist across browser sessions via `localStorage`
- Fully static — no backend or authentication required

---

## Running with Docker (recommended)

**Prerequisites**: [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

To stop:

```bash
docker compose down
```

---

## Running locally

**Prerequisites**: [Node.js](https://nodejs.org/) 20+ and npm

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The server hot-reloads on file changes.

### Production build (static)

```bash
npm run generate
```

Static output is written to `.output/public/` and can be deployed to any static host (Netlify, Vercel, GitHub Pages, etc.).

To preview the production build locally:

```bash
npx serve .output/public
```

---

## Project structure

```
pages/index.vue          # Main app page
components/
  TodoInput.vue          # Add-todo form with character counter
  TodoList.vue           # Todo list with empty state
  TodoItem.vue           # Single todo row (checkbox, text, delete)
composables/useTodos.ts  # State management + localStorage persistence
types/todo.ts            # Todo TypeScript interface
tailwind.config.ts       # Retro purple theme, neon glow utilities
nuxt.config.ts           # Nuxt configuration
```
