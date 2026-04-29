# Feature Specification: Schedule & Filter with Visual Redesign

**Feature Branch**: `schedule-filter`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "Add feature described in features/main/schedule-filter/product.md — visual redesign to light glassmorphism theme, progress tracking, task scheduling with date picker, search & filter, redesigned header and todo items"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visual Redesign to Light Theme (Priority: P1)

As a user, I want the app to have a modern, light-themed appearance with glassmorphism card styling and a soft purple gradient palette so the interface feels fresh, polished, and easy to read.

**Why this priority**: This is the foundational change. Every other feature (progress tracker, search/filter, date picker) is designed within this new visual language. Without the redesign, no other story can be delivered coherently.

**Independent Test**: Can be fully tested by loading the application and verifying the new visual treatment is applied — light gradient background, glassmorphism cards, updated typography, and purple accent palette — delivering an immediately noticeable visual upgrade.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the page renders, **Then** the background displays a soft lavender-to-pink gradient instead of the previous dark background
2. **Given** the app is loaded, **When** the user views any card section (input, list, progress), **Then** each card displays semi-transparent white styling with subtle borders, rounded corners, and layered shadows
3. **Given** the app is loaded, **When** the user reads any text, **Then** the typography uses a clean sans-serif font (Inter family) with appropriate weight variations for headings and body text
4. **Given** the app is loaded, **When** the user views interactive buttons, **Then** primary actions display the purple-to-pink gradient accent color

---

### User Story 2 — Search & Filter Tasks (Priority: P2)

As a user, I want to search my tasks by keyword and filter them by status (all, pending, completed) so I can quickly find specific tasks without scrolling through the entire list.

**Why this priority**: Search and filter are the highest-value new functional capabilities. They directly improve task management efficiency, especially as the task list grows.

**Independent Test**: Can be fully tested by creating several tasks (some completed, some pending), then using the search input and filter tabs to verify correct filtering behavior.

**Acceptance Scenarios**:

1. **Given** the user has multiple tasks, **When** the user types a keyword in the search input, **Then** only tasks containing that keyword in their text are displayed
2. **Given** the user has both pending and completed tasks, **When** the user taps the "Pending" filter tab, **Then** only uncompleted tasks are shown
3. **Given** the user has both pending and completed tasks, **When** the user taps the "Completed" filter tab, **Then** only completed tasks are shown
4. **Given** the user is on any filter tab, **When** the user taps "All", **Then** all tasks are shown regardless of status
5. **Given** filter tabs are displayed, **When** the user views the tab labels, **Then** each tab shows the count of tasks in that category (e.g., "Today (3)", "All (12)", "Pending (8)", "Completed (4)")
6. **Given** the app is loaded for the first time or refreshed, **When** the filter tabs render, **Then** the "Today" tab is selected by default, showing only tasks dated for the current day
7. **Given** the user has typed a search query, **When** no tasks match the search, **Then** an appropriate empty-state message is displayed
8. **Given** the user has an active search query and a filter selected, **When** both are applied, **Then** results reflect the intersection (matching keyword AND matching active filter)

---

### User Story 3 — Task Scheduling with Date Picker (Priority: P3)

As a user, I want to assign a date to a task when creating it so I can schedule and organize tasks by when they need to be done.

**Why this priority**: Date assignment is a core new data capability that transforms the app from a simple checklist into a scheduling tool. It adds meaningful structure to task management.

**Independent Test**: Can be fully tested by creating a new task, using the date picker to assign a date, and verifying the date appears on the saved task item.

**Acceptance Scenarios**:

1. **Given** the user is creating a new task, **When** the user taps the calendar button next to the input field, **Then** a date picker appears allowing the user to select a date
2. **Given** the date picker is open, **When** the user selects a date, **Then** the selected date is associated with the new task
3. **Given** a task has been created with a date, **When** the task is displayed in the list, **Then** the date is shown beneath the task text in a readable format (e.g., "Apr 29, 2026")
4. **Given** the user is creating a task, **When** the user does not select a date, **Then** the task is created without a date and no date subtitle is displayed
5. **Given** the date picker is open, **When** the user taps outside the picker or presses a cancel/close control, **Then** the picker closes without assigning a date
6. **Given** an existing task with a date, **When** the user taps the date subtitle, **Then** the date picker re-opens allowing the user to change the date
7. **Given** an existing task without a date, **When** the user taps a calendar icon on the task item, **Then** the date picker opens allowing the user to assign a date

---

### User Story 4 — Progress Tracking (Priority: P4)

As a user, I want to see a visual summary of my task completion progress so I can stay motivated and track how productive I've been.

**Why this priority**: Progress tracking adds motivational feedback but is not essential for core task management. It enhances the experience once create, complete, search, and filter are working.

**Independent Test**: Can be fully tested by creating tasks, completing some of them, and verifying the progress card updates with the correct percentage, progress bar fill, and summary count.

**Acceptance Scenarios**:

1. **Given** the user has tasks, **When** the progress section is visible, **Then** it displays the completion percentage (completed ÷ total × 100, rounded to nearest whole number)
2. **Given** the user completes a task, **When** the progress section updates, **Then** the percentage increases and the progress bar fills proportionally
3. **Given** the user has no tasks, **When** the progress section is visible, **Then** it displays 0% with an empty progress bar and "0 of 0 tasks completed"
4. **Given** the user has completed all tasks, **When** the progress section is visible, **Then** it displays 100% with a fully filled progress bar

---

### User Story 5 — Redesigned Header (Priority: P5)

As a user, I want a clean, modern header that reflects the app's brand identity, including the app name with decorative accents and a subtitle.

**Why this priority**: Header redesign is a cosmetic improvement that completes the overall visual polish. It does not add functional value and can be delivered last.

**Independent Test**: Can be fully tested by loading the app and verifying the header displays the app title with sparkle decorations, the subtitle text, and the notification bell icon.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the header renders, **Then** the app title "Vibe ToDo" is displayed with decorative sparkle icons flanking it
2. **Given** the app is loaded, **When** the header renders, **Then** the subtitle "Your productivity companion" appears below the title in muted text
3. **Given** the app is loaded, **When** the header renders, **Then** a notification bell icon button is displayed to the right of the subtitle area

---

### User Story 6 — Redesigned Todo Items (Priority: P6)

As a user, I want each todo item to have a clean, card-like appearance with a circular checkbox, visible drag handle, task text, optional date subtitle, and a delete action so the list is visually organized and easy to interact with.

**Why this priority**: This completes the redesign of existing functionality within the new visual language. It depends on Story 1 (visual redesign) being in place.

**Independent Test**: Can be fully tested by creating tasks (with and without dates), completing tasks, reordering via drag handles, and deleting tasks — verifying each interaction and visual state.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** it is displayed in the list, **Then** it appears as a semi-transparent card with a drag handle on the left, circular checkbox, task text, and delete icon on the right
2. **Given** a task has a date assigned, **When** it is displayed, **Then** the date appears as a subtitle beneath the task text
3. **Given** a task is pending, **When** the user views the checkbox, **Then** it appears as an empty circle outline
4. **Given** the user taps a task's checkbox, **When** the task toggles to completed, **Then** the checkbox visually indicates completion
5. **Given** multiple tasks exist, **When** the user drags a task's handle, **Then** the task can be reordered within the list

---

### Edge Cases

- What happens when the user searches for a term that matches no tasks? → An empty-state message should be shown
- What happens when all tasks are completed and the user selects "Pending" filter? → An empty list with a contextual message (e.g., "No pending tasks")
- What happens when no tasks are dated for today and the "Today" filter is active (default)? → An empty list with a contextual message (e.g., "No tasks scheduled for today")
- What happens when the user has zero tasks? → Progress shows 0%, empty task list with encouraging message
- What happens when a task's text is very long and the user searches for a substring? → The task should still appear in results; text truncation should not prevent matching
- What happens when the user combines search with a filter? → Results are the intersection of both criteria
- How does the date picker behave on mobile devices? → The picker must be usable on touch screens with adequate touch target sizes
- What happens when the user clears the search input? → All tasks (respecting the current filter) should reappear immediately

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace the existing dark theme with a light glassmorphism visual treatment across all screens — including gradient background, semi-transparent card surfaces, updated typography, and purple accent palette
- **FR-002**: System MUST display a progress section showing the task completion percentage, a visual progress bar, and a summary count ("X of Y tasks completed")
- **FR-003**: System MUST update the progress section in real time when tasks are created, completed, or deleted
- **FR-004**: System MUST provide a search input at the top of the task list that filters displayed tasks by keyword match against task text
- **FR-005**: System MUST provide filter tabs ("Today", "All", "Pending", "Completed") where "Today" is selected by default and shows tasks dated for the current day plus undated tasks; "All" shows all tasks; "Pending" shows uncompleted tasks; "Completed" shows completed tasks
- **FR-006**: Each filter tab MUST display the count of tasks matching that filter
- **FR-007**: Search and filter MUST work together — applying both narrows results to the intersection of both criteria. Pagination MUST apply to the filtered result set, and the current page MUST reset to page 1 whenever the search query or filter selection changes
- **FR-008**: System MUST provide a custom calendar dropdown date picker adjacent to the task input, styled with the glassmorphism design system (semi-transparent background, subtle borders, rounded corners), that allows users to optionally assign a date to a new task
- **FR-009**: Tasks with an assigned date MUST display the date in a human-readable format (e.g., "Apr 29, 2026") beneath the task text. Users MUST be able to tap the date subtitle to re-open the date picker and change the date. Undated tasks MUST display a calendar icon that opens the picker to assign a date. When the date picker is open for an existing dated task, the user MAY clear the date by selecting a "No date" or "Clear" option, which removes the date subtitle and reverts the task to undated
- **FR-010**: System MUST redesign the header to display the app title "Vibe ToDo" with decorative sparkle icons and a subtitle "Your productivity companion"
- **FR-011**: The header MUST include a notification bell icon button (visual placeholder — notification functionality is out of scope for this feature)
- **FR-012**: Each todo item MUST display a drag handle, circular checkbox, task text, optional date subtitle, and a delete icon
- **FR-013**: System MUST maintain all existing functionality — task creation with character limit, checkbox toggling, drag-and-drop reordering, delete with confirmation, and pagination
- **FR-014**: All interactive elements MUST maintain a minimum touch target size of 44×44 pixels
- **FR-015**: The redesigned task input MUST retain the character counter (0 / 200) and display the placeholder text "What would you like to accomplish?"
- **FR-016**: System MUST persist task dates alongside existing task data so dates survive page reloads

### Key Entities

- **Task (extended)**: A user-created item with text content, completion status, creation timestamp, optional scheduled date, and display order position
- **Filter State**: The current combination of search query (text) and status filter (today / all / pending / completed) that determines which tasks are visible; defaults to "today" on load
- **Progress Summary**: A derived view showing total tasks, completed count, and completion percentage

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users perceive the app as modern and polished — the visual redesign is immediately noticeable upon loading the app
- **SC-002**: Users can find a specific task among 50+ tasks in under 5 seconds using search or filter
- **SC-003**: Users can assign a date to a new task in 2 taps or fewer (one to open picker, one to select date)
- **SC-004**: The progress tracker accurately reflects completion state within 1 second of any task status change
- **SC-005**: All existing task management workflows (create, complete, delete, reorder) continue to function without regression
- **SC-006**: The interface is fully usable on both desktop and mobile viewports without horizontal scrolling or overlapping elements
- **SC-007**: 100% of interactive elements meet the 44×44px minimum touch target requirement

## Clarifications

### Session 2026-04-29

- Q: How should pagination interact with search/filter results? → A: Paginate filtered results, reset to page 1 on filter/search change
- Q: Should the date picker use native browser input or a custom calendar dropdown? → A: Custom calendar dropdown styled with glassmorphism to match the design system
- Q: Should the progress tracker scope to today's tasks or all tasks? → A: Track all tasks for progress (motivational framing), but add a "Today" filter tab selected by default showing tasks dated for the current day
- Q: Should undated tasks appear under the "Today" filter? → A: Yes, undated tasks appear in the "Today" filter alongside today's dated tasks
- Q: Can users edit the date on an existing task? → A: Yes, tapping the date subtitle (or a calendar icon on undated tasks) re-opens the picker to change or assign a date

## Assumptions

- The notification bell in the header is a visual-only placeholder; notification functionality will be implemented in a future feature
- "Progress Today" tracks all tasks in the system, not only tasks dated for the current day — the "Today" label is motivational framing. A separate "Today" filter tab (selected by default) provides date-scoped task viewing
- The date picker assigns a calendar date only (no time component)
- Tasks created without a date simply omit the date subtitle — they are included in the "Today" filter alongside today's dated tasks, and appear in All / Pending / Completed as normal
- The existing drag-and-drop reordering, pagination, confirmation dialog, and character-limit behaviors remain unchanged
- Search is case-insensitive and matches anywhere within the task text
- The existing localStorage persistence mechanism will be extended to include the new date field
- The redesigned layout uses a centered container with a maximum width appropriate for readability (~900px)
