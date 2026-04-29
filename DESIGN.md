---
version: alpha
name: Vibe Todo
description: A modern productivity companion with a light glassmorphism aesthetic and vibrant purple gradient accents.
colors:
  primary: "#8E51FF"
  primary-mid: "#AD46FF"
  primary-end: "#E12AFB"
  surface: "#FFFFFF"
  surface-glass: "#F7F5FF"
  surface-glass-light: "#F0EDF7"
  background-start: "#F5F3FF"
  background-mid: "#FAF5FF"
  background-end: "#FDF4FF"
  border: "#E2E8F0"
  border-glass: "#E8E4F0"
  text-dark: "#314158"
  text-medium: "#45556C"
  text-subtle: "#62748E"
  text-placeholder: "#90A1B9"
  track: "#E2E8F0"
  error: "#DC2626"
typography:
  headline-display:
    fontFamily: Inter
    fontSize: 60px
    fontWeight: 500
    lineHeight: 60px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 400
    lineHeight: 32px
  label-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
rounded:
  sm: 14px
  md: 16px
  lg: 24px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 16px
    height: 60px
  button-secondary:
    backgroundColor: "{colors.surface-glass}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.sm}"
    padding: 8px
    height: 37px
  button-icon:
    backgroundColor: "{colors.surface-glass}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.sm}"
    size: 37px
  filter-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    height: 40px
  filter-tab-inactive:
    backgroundColor: "{colors.surface-glass-light}"
    textColor: "{colors.text-medium}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    height: 40px
  input-text:
    backgroundColor: "{colors.surface-glass}"
    textColor: "{colors.text-placeholder}"
    rounded: "{rounded.md}"
    padding: 20px
    height: 60px
  input-search:
    backgroundColor: "{colors.surface-glass}"
    textColor: "{colors.text-placeholder}"
    rounded: "{rounded.md}"
    padding: 16px
    height: 52px
  card-elevated:
    backgroundColor: "{colors.surface-glass}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-standard:
    backgroundColor: \"{colors.border-glass}\"
    rounded: "{rounded.md}"
    padding: 24px
  todo-item:
    backgroundColor: "{colors.surface-glass-light}"
    textColor: "{colors.text-subtle}"
    rounded: "{rounded.md}"
    padding: 18px
    height: 80px
  checkbox-unchecked:
    backgroundColor: "transparent"
    textColor: "{colors.border}"
    size: 24px
  progress-bar:
    backgroundColor: "{colors.track}"
    rounded: "{rounded.full}"
    height: 12px
  page-background:
    backgroundColor: "{colors.background-start}"
    textColor: "{colors.background-mid}"
  page-background-end:
    backgroundColor: "{colors.background-end}"
    textColor: "{colors.primary-mid}"
  alert-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
  button-primary-gradient:
    backgroundColor: "{colors.primary-end}"
    textColor: "#FFFFFF"
---

# Vibe Todo Design System

## Overview

Vibe Todo is a modern productivity companion app. The visual identity uses a **light glassmorphism** aesthetic — semi-transparent white surfaces layered over a soft lavender-to-pink gradient background. The design feels airy, clean, and approachable while maintaining depth through layered translucent cards and subtle shadows.

The brand personality is friendly yet focused. Purple gradient accents (`#8E51FF` → `#AD46FF` → `#E12AFB`) provide energy and visual interest without overwhelming the interface. The overall effect should evoke a calm, productive workspace — not a dark hacker terminal.

Target audience: individuals who want a simple, visually pleasing task manager that feels modern and polished.

## Colors

The palette combines neutral translucent surfaces with a vibrant purple-to-pink gradient accent system.

- **Primary (#8E51FF):** A rich violet used as the starting point of the brand gradient. Applied to active filter tabs, the "Add Task" button, and the progress bar.
- **Primary Mid (#AD46FF):** The midpoint of the brand gradient, bridging violet to magenta.
- **Primary End (#E12AFB):** A vivid pink-magenta marking the end of the brand gradient. Used alongside the primary for gradient fills.
- **Surface (#FFFFFF):** Pure white, used for input field backgrounds and button bases.
- **Surface Glass (#FFFFFFB3 / 70% white):** The primary surface for glassmorphism cards and containers.
- **Surface Glass Light (#FFFFFF99 / 60% white):** A lighter translucent surface for inactive filter tabs and todo item rows.
- **Background:** A three-stop gradient (`#F5F3FF` → `#FAF5FF` → `#FDF4FF`) flowing from soft lavender through light violet to pale pink. Serves as the full-page backdrop.
- **Border (#E2E8F0):** A soft blue-gray used for input borders and the progress bar track.
- **Border Glass (#FFFFFF66 / 40% white):** A subtle white border for glassmorphism card edges.
- **Text Dark (#314158):** High-contrast dark slate for primary text, task names, and labels.
- **Text Medium (#45556C):** Medium-contrast slate for subtitles and secondary information.
- **Text Subtle (#62748E):** Low-contrast blue-gray for timestamps and metadata.
- **Text Placeholder (#90A1B9):** Muted gray-blue for input placeholder text.

## Typography

The entire interface uses the **Inter** font family. Two weights provide hierarchy: Medium (500) for headings, buttons, and labels; Regular (400) for body text, metadata, and placeholders.

- **Headline Display:** Inter Medium at 60px with tight line height. Used exclusively for the app title "Vibe ToDo", rendered with the purple-to-pink gradient as text fill.
- **Body Medium:** Inter Regular at 16px / 24px line height. The workhorse for input text, task names, filter labels, and the subtitle.
- **Body Small:** Inter Regular at 14px / 20px. Used for progress summary text ("X of Y tasks completed").
- **Label Large:** Inter Regular at 24px / 32px. Used for the progress percentage display.
- **Label Medium:** Inter Medium at 16px / 24px. Used for button text ("Add Task"), filter tab labels ("All", "Pending", "Completed").
- **Label Small:** Inter Regular at 12px / 16px. Used for timestamps ("Apr 29, 2026") and the character counter ("0 / 200").

## Layout

The layout follows a **single-column, centered container** model with a maximum width of 896px. The page is vertically scrollable with 32px top/bottom padding.

Content is organized into distinct card sections stacked vertically:

1. **Header** — App title with flanking sparkle icons, subtitle, and notification button
2. **Progress Card** — Daily completion stats with gradient progress bar
3. **Input Card** — Task creation form with text input, calendar button, and submit button
4. **Task List Card** — Search, filter tabs, and scrollable todo item list

Cards use 32px internal padding for elevated sections and 24px for standard sections. Vertical gap between major cards is 24px. Internal element spacing uses the 8px / 12px / 16px scale consistently.

## Elevation & Depth

Depth is conveyed through **layered glassmorphism** and differentiated shadow levels:

- **Standard cards** (progress section): Light shadow (`0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)`) with semi-transparent white background and white border.
- **Elevated cards** (input section, task list): Heavier shadow (`0 25px 50px rgba(0,0,0,0.25)`) creating a floating effect over the gradient background.
- **Buttons** (Add Task, calendar): Medium shadow matching the standard card level.
- **Todo items** have no shadow — they rely on border and background opacity for separation.

The translucent `rgba(255,255,255,0.7)` surface combined with `rgba(255,255,255,0.4)` borders creates the characteristic frosted-glass appearance.

## Shapes

The shape language uses **generous, consistent rounding** to create a soft, approachable feel:

- **Large containers** (input card, task list): 24px corner radius
- **Medium elements** (progress card, inputs, todo items): 16px corner radius
- **Small elements** (buttons, filter tabs, icon buttons): 14px corner radius
- **Progress bar and pill shapes**: Fully rounded (9999px) for a capsule effect

All corners within a given element use uniform radius — no mixed corner radii.

## Components

### Buttons

- **Primary (Add Task):** Full purple gradient background (`#8E51FF` → `#AD46FF` → `#E12AFB`), white text in Inter Medium 16px, 16px rounded corners, drop shadow. Minimum width ~129px, height 60px.
- **Icon Button (Calendar):** White background with `#DDD6FF` purple-tinted border, 16px rounded corners, 56×60px, centered icon with drop shadow.
- **Notification Button:** Circular 37×37px, `rgba(255,255,255,0.7)` background with `#E2E8F0` border, 14px radius.

### Filter Tabs

- Three equal-width tabs in a horizontal row with 8px gap.
- **Active tab:** Purple gradient background, white text, subtle shadow.
- **Inactive tabs:** `rgba(255,255,255,0.6)` background, `#45556C` text, no border or shadow.

### Input Fields

- **Task input:** Full-width, 60px height, `rgba(255,255,255,0.8)` background, 2px `#E2E8F0` border, 16px radius, 20px horizontal padding. Placeholder in `#90A1B9`.
- **Search input:** Full-width, 52px height, same styling as task input but with a 20×20px search icon inset at 16px from the left edge. Text indented 48px.

### Todo Items

- Full-width row, 80px height, `rgba(255,255,255,0.6)` background, 2px `rgba(226,232,240,0.5)` border, 16px radius.
- Left: 6-dot drag handle icon (20×20px) → circular checkbox (24×24px) → task text block (name + date) → trash icon (18×18px) on the right.
- Task name in Inter Regular 16px `#314158`. Date subtitle in Inter Regular 12px `#62748E`.
- All interactive elements (checkbox, drag handle, delete) maintain ≥44×44px touch target.

### Progress Bar

- 12px tall, fully rounded track in `#E2E8F0`.
- Fill uses the full purple gradient (`#8E51FF` → `#AD46FF` → `#E12AFB`), also fully rounded.

## Do's and Don'ts

- Do use the purple gradient exclusively for primary actions, the progress bar, active filters, and the title text
- Do maintain the glassmorphism effect — surfaces must remain semi-transparent over the gradient background
- Do keep all text in the Inter font family; do not introduce additional typefaces
- Do ensure a minimum 44×44px touch target for all interactive elements
- Don't use pure opaque white for card backgrounds — always use `rgba(255,255,255, 0.6–0.8)` for the frosted-glass effect
- Don't apply heavy shadows to inline elements like todo items — reserve elevation for container cards
- Don't mix the old dark/neon retro aesthetic with the new light glassmorphism theme
- Don't use more than two font weights (400 Regular, 500 Medium) in the interface