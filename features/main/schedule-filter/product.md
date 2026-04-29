## Context

Vibe Todo is a task-tracking app built with Vue 3, Nuxt.js 3, and Tailwind CSS. The current design uses a dark retro 80s aesthetic with neon purple accents. The Figma design introduces a complete visual overhaul to a modern, light-themed UI with glassmorphism cards and a purple gradient palette, along with several new functional features.

## Current State (reference: image.png)

- Dark background (`bg-dark-bg`) with neon violet/purple color scheme
- Simple "VIBE TODO" header in retro font
- Basic text input ("ENTER TASK...") with an "ADD" button
- Character counter (X / 200)
- Todo list with drag-and-drop reordering, checkbox toggle, delete with confirmation dialog
- Pagination controls
- No progress tracking, no search, no filtering, no date/schedule picker

## Requirements

### 1. Visual Redesign — Light Glassmorphism Theme

- Replace the dark retro background with a **light gradient background** (lavender → soft purple → pink, approx `#f5f3ff` → `#faf5ff` → `#fdf4ff`)
- All cards use **glassmorphism style**: semi-transparent white (`rgba(255,255,255,0.7)`), subtle white border (`rgba(255,255,255,0.4)`), rounded corners (`rounded-2xl` / `rounded-xl`), and layered box shadows
- Typography switches from retro/monospace to **Inter font family** (regular + medium weights)
- Color palette: primary gradient `#8e51ff` → `#ad46ff` → `#e12afb`, text colors `#314158` (dark), `#45556c` (medium), `#90a1b9` (placeholder), `#62748e` (subtle)

### 2. Redesigned Header

- App title **"Vibe ToDo"** with sparkle icons on each side, using the purple-to-pink gradient text
- Subtitle: **"Your productivity companion"** in muted text (`#45556c`)
- **Notification bell button** to the right of the subtitle — circular with light border, white/glass background

### 3. New Progress Tracker Section

- Card showing **"Progress Today"** label with a chart/trend icon
- **Completion percentage** displayed in gradient purple text (e.g., "0%")
- **Gradient progress bar** (`#8e51ff` → `#ad46ff` → `#e12afb`) on a gray track (`#e2e8f0`), fully rounded
- Summary text: **"X of Y tasks completed"** below the bar

### 4. Redesigned Task Input

- Elevated glassmorphism card with stronger shadow (`shadow-2xl`)
- Input placeholder: **"What would you like to accomplish?"** in a rounded white input with light border
- **Calendar/date picker button** — bordered square button with a calendar icon, positioned between the input and submit button
- **"Add Task" button** — gradient purple (`#8e51ff` → `#e12afb`), rounded, with medium white text
- **Character counter** right-aligned below: "0 / 200" in muted text

### 5. New Search & Filter Functionality

- **Search input** at the top of the task list card — full-width, with a search icon prefix and placeholder "Search tasks..."
- **Filter tab bar** with three tabs: **All (count)**, **Pending (count)**, **Completed (count)**
  - Active tab: gradient purple background with white text, shadow
  - Inactive tabs: semi-transparent white background (`rgba(255,255,255,0.6)`) with muted text (`#45556c`)

### 6. Redesigned Todo Items

- Each item in a semi-transparent card with light border (`rgba(226,232,240,0.5)`)
- **Drag handle** (6-dot grid icon) on the left for reordering
- **Circular checkbox** — empty circle outline when pending; styled when completed
- **Task text** with date subtitle below (formatted as "Apr 29, 2026" in `#62748e`)
- **Trash/delete icon** on the right — minimal, single-color icon

### 7. Layout & Spacing

- Centered container, max width ~896px
- Consistent padding and spacing between sections (gap-24px between major cards)
- Inner card padding of 32px
- All interactive elements maintain minimum 44x44px touch targets