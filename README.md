# VIBE TODO

A retro neo purple 80s-themed todo tracking web app built with **Vue 3**, **Nuxt 3**, and **Tailwind CSS**.

---

## Features

- Add, complete, and delete todos
- Retro neo purple / synthwave visual theme with neon glow effects
- Todos persist across browser sessions via `localStorage`
- Fully static — no backend or authentication required

---



## Prerequisites

- [Node.js](https://nodejs.org/) (for local development)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Task](https://taskfile.dev/) (task runner)

---

## Run

### Docker (production build)

Start the app along with security services (SonarQube, etc.):

```bash
task up
```

The app will be available at **http://localhost:3002**.


### V1 side-by-side comparison

To run the original v0.1.0 alongside the latest version (in a separate terminal):

```bash
task up:v1
```

> This automatically clones the [vibe-sdd-todo](https://github.com/emilioforrer/vibe-sdd-todo) repo as a git worktree at `.worktrees/vibe-sdd-todo-v1` if it doesn't already exist.

---

## Other Tasks

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `task ci`            | Run lint, test coverage, and SonarQube analysis  |
| `task lint`          | Run ESLint and produce a JSON report             |
| `task test:coverage` | Run unit tests with coverage (lcov)              |
| `task sonar-scanner` | Run SonarQube analysis                           |
| `task trivy`         | Run Trivy vulnerability & secret scan            |
| `task grype`         | Run Grype vulnerability scan (SARIF output)      |
| `task snyk`          | Run Snyk dependency and code security tests      |