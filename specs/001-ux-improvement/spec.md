# Feature Specification: UX Improvement – Vibe Todo

**Feature Branch**: `002-ux-improvement`  
**Created**: April 23, 2026  
**Status**: Draft  
**Input**: Vibe Todo UX improvements addressing visual polish, interaction quality, and usability

## Clarifications

### Session 2026-04-23

- Q: What date/time format should be used for task creation metadata? → A: Relative time with fallback (e.g., "2 hours ago" on display, showing absolute time "Apr 23, 2026 2:30 PM" on hover)
- Q: How should existing tasks (created before this feature) handle creation dates? → A: Display "Date unknown" or a placeholder to indicate missing metadata
- Q: Should the confirmation dialog support keyboard interactions? → A: Yes, standard modal behavior (Escape key dismisses/cancels, Enter key confirms deletion)
- Q: How should touch devices handle drag and drop activation? → A: Long press activation (500ms+) enters drag mode; then drag to reorder (standard mobile pattern)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Improved Visual Polish (Priority: P1)

A user opens the Vibe Todo app and sees a refined, professional-looking interface where the header and interactive elements are visually balanced and not overwhelming.

**Why this priority**: The header glow effect and delete button visibility are the most visible issues affecting first impressions and usability of the core interface. These require no data persistence and can be deployed immediately.

**Independent Test**: Can be fully tested by visual inspection and interaction with the header and task items in the UI, validating that the header glow is refined and delete button is clearly visible.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the user views the page, **Then** the "VIBE TODO" header displays a refined neon glow effect that is proportional to the heading size (not oversized)
2. **Given** the app is loaded, **When** the user hovers over or views a task item, **Then** the delete (×) button is clearly visible with high contrast against the dark background
3. **Given** a task item is displayed, **When** the user moves their cursor away from the button area, **Then** the delete button remains visible (not hidden)

---

### User Story 2 - Task Creation Metadata Display (Priority: P1)

A user creates a task and can immediately see when it was created, displayed in a human-readable format below or near the task label.

**Why this priority**: Displaying creation dates requires no significant interaction complexity and is fundamental to task tracking. Works independently of other features.

**Independent Test**: Can be fully tested by creating a task and verifying the created date is displayed and in human-readable format (e.g., "Apr 23, 2026" or "2 hours ago").

**Acceptance Scenarios**:

1. **Given** a task is created, **When** the task item is displayed in the list, **Then** the created date/time is shown in relative format (e.g., "2 hours ago") 
2. **Given** a task item displays the created date, **When** the user hovers over the date, **Then** the absolute time is displayed as a tooltip (e.g., "Apr 23, 2026 2:30 PM")
3. **Given** a task item displays the created date, **When** the user views the task list, **Then** the date is styled subtly (smaller font, muted color) so it does not compete with the task label
4. **Given** tasks have different creation times, **When** the user views the task list, **Then** each task displays its own creation date accurately
5. **Given** a task was created before this feature launched (no created_at metadata), **When** the user views the task list, **Then** the task displays "Date unknown" or a placeholder to indicate missing metadata

---

### User Story 3 - Task Reordering via Drag and Drop (Priority: P2)

A user can reorder tasks by dragging and dropping them within the task list, and the new order is preserved after page refresh.

**Why this priority**: Drag and drop is a more advanced interaction that depends on existing functionality (creation dates are visible). Requires state persistence but does not block task creation/deletion workflows.

**Independent Test**: Can be fully tested by creating multiple tasks, dragging one task to a new position, verifying visual feedback, and confirming the new order persists after page refresh.

**Acceptance Scenarios**:

1. **Given** the task list has multiple tasks, **When** the user hovers over a task item, **Then** a visual drag handle (e.g., ⠿ or ≡ icon) is displayed to indicate the task is draggable
2. **Given** the user clicks and holds a drag handle, **When** the task is being dragged, **Then** the dragged task shows a clear visual active state (e.g., slight scale, shadow, or opacity change)
3. **Given** the user drags a task to a new position, **When** the task is dropped, **Then** the list reorders and the new position is persisted to localStorage
4. **Given** the page is refreshed, **When** the user returns to the app, **Then** the tasks remain in the reordered position
5. **Given** a task item on a touch device, **When** the user long-presses (500ms+) on the drag handle, **Then** the task enters drag mode with a clear visual indication (e.g., highlight, animation, or opacity change)
6. **Given** the task is in drag mode on a touch device, **When** the user drags to a new position and releases, **Then** the list reorders and the new position is persisted to localStorage

---

### User Story 4 - Delete Confirmation Workflow (Priority: P2)

A user clicks the delete button on a task, a confirmation dialog appears, and the task is only deleted after confirming the action.

**Why this priority**: Delete confirmation prevents accidental data loss but depends on the delete button being visible (P1 feature). Can be implemented as an independent dialog component.

**Independent Test**: Can be fully tested by clicking the delete button, verifying the confirmation dialog appears, testing both confirmation and cancellation paths, and verifying the task is deleted only after confirmation.

**Acceptance Scenarios**:

1. **Given** a task item is displayed, **When** the user clicks the × delete button, **Then** a confirmation dialog appears with the message "Are you sure you want to delete this task?"
2. **Given** the confirmation dialog is open, **When** the user clicks "Confirm", **Then** the task is removed from the list immediately
3. **Given** the confirmation dialog is open, **When** the user clicks "Cancel" or clicks outside the dialog, **Then** the dialog dismisses and the task remains in the list
4. **Given** the confirmation dialog is open, **When** the user presses the Escape key, **Then** the dialog dismisses (Cancel behavior) and the task remains in the list
5. **Given** the confirmation dialog is open, **When** the user presses the Enter key, **Then** the task is removed from the list (Confirm behavior)
6. **Given** the confirmation dialog is displayed, **When** the user views it, **Then** the dialog follows the existing retro neo-purple visual style

---

### User Story 5 - Task List Pagination (Priority: P3)

A user with more than 15 tasks can navigate through multiple pages of tasks, with pagination controls displayed below the list.

**Why this priority**: Pagination is a nice-to-have enhancement for scale and does not impact core workflows (create, delete, reorder). Can be implemented after core features are stable.

**Independent Test**: Can be fully tested by creating 20+ tasks, verifying pagination appears, navigating between pages, confirming only 15 tasks per page, and verifying drag/drop works within a single page.

**Acceptance Scenarios**:

1. **Given** there are more than 15 tasks in the list, **When** the user views the app, **Then** only 15 tasks are displayed per page
2. **Given** pagination is active, **When** the user views below the task list, **Then** pagination controls display (e.g., "Previous", "Next", current page indicator like "Page 1 of 3")
3. **Given** the user is on page 1, **When** the user clicks "Next", **Then** the view scrolls or transitions to page 2 showing tasks 16-30
4. **Given** the user is on page 2 or later, **When** the user clicks "Previous", **Then** the view transitions to the previous page
5. **Given** the user is viewing a page, **When** the user drags a task to reorder, **Then** drag and drop reordering is limited to the current page only
6. **Given** pagination is displayed, **When** the user views it, **Then** the pagination controls follow the existing retro neo-purple visual style

---

### Edge Cases

- What happens when a user tries to drag a task beyond the list boundaries? (Dragging near the edge should auto-scroll or constrain the drop zone)
- How does pagination handle tasks created/deleted while the user is on a non-first page? (Adjust page count and current page as needed)
- What happens if localStorage is not available or cleared? (Default to in-memory order, warn user if persistence fails)
- How does the drag and drop visual state look on touch devices vs. mouse-based devices?
- What if the user drags a task but releases it in the exact same position? (Order remains unchanged, no visual glitch)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a refined neon glow effect on the "VIBE TODO" header that is proportional to the heading size and does not overwhelm the visual hierarchy
- **FR-002**: System MUST display the delete (×) button on each task item with sufficient contrast against the dark background, visible at all times (not only on hover)
- **FR-003**: System MUST display the creation date/time on each task item in relative format (e.g., "2 hours ago") with absolute time shown on hover (e.g., "Apr 23, 2026 2:30 PM")
- **FR-004**: System MUST display the creation date in a subtle style (smaller font, muted color) that does not compete with the task label
- **FR-005**: System MUST support drag and drop reordering of tasks within the task list
- **FR-006**: System MUST display a visual drag handle (e.g., ⠿ or ≡ icon) on each task item to indicate draggability
- **FR-007**: System MUST display a clear visual active state when a task is being dragged (e.g., scale, shadow, or opacity change)
- **FR-008**: System MUST persist the new task order to localStorage after a reorder operation
- **FR-009**: System MUST restore the task order from localStorage on page load
- **FR-009a**: System MUST support mouse drag and drop on desktop devices (click and drag on drag handle)
- **FR-009b**: System MUST support touch drag and drop on mobile/tablet devices (long press for 500ms+ activates drag mode; then drag to reorder)
- **FR-010**: System MUST display a confirmation dialog when the user clicks the delete button
- **FR-011**: System MUST display the message "Are you sure you want to delete this task?" in the confirmation dialog
- **FR-012**: System MUST delete the task only after the user confirms the deletion (via Confirm button or Enter key)
- **FR-013**: System MUST dismiss the confirmation dialog without deleting when the user clicks "Cancel", clicks outside the dialog, or presses the Escape key
- **FR-014**: System MUST support Escape key to dismiss/cancel the confirmation dialog (standard modal behavior)
- **FR-015**: System MUST support Enter key to confirm and delete the task (standard modal behavior)
- **FR-016**: System MUST display pagination controls when there are more than 15 tasks
- **FR-017**: System MUST show only 15 tasks per page when pagination is active
- **FR-018**: System MUST display page indicators (e.g., "Page 1 of 3") and navigation buttons ("Previous", "Next")
- **FR-019**: System MUST limit drag and drop reordering to tasks on the current page only
- **FR-020**: System MUST maintain consistent retro neo-purple visual styling across all new UI elements (header, delete button, confirmation dialog, pagination controls)
- **FR-021**: System MUST display "Date unknown" or a placeholder for tasks that were created before this feature (tasks without created_at metadata)

### Key Entities

- **Task**: Represents a todo item with properties: id, label, created_at (ISO timestamp), order. Display format: created_at rendered as relative time (e.g., "2 hours ago") with absolute time on hover
- **TaskList**: Ordered collection of tasks, persisted to localStorage as JSON
- **ConfirmationDialog**: Modal UI component for destructive action confirmation
- **PaginationControl**: UI component for navigating between pages of tasks

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users report improved visual clarity when viewing the app header and task items (subjective satisfaction, target: 4/5 or higher in user feedback)
- **SC-002**: Delete button visibility is sufficient that users can locate and click it without visual strain or repeated attempts
- **SC-003**: 100% of newly created tasks display their creation date in the expected relative format with absolute time available on hover
- **SC-004**: Users can successfully reorder tasks via drag and drop on 95% of attempts without accidental drops or visual glitches
- **SC-005**: Task order persists across page refreshes with 100% accuracy (no data loss or reordering)
- **SC-006**: Confirmation dialog appears on 100% of delete button clicks and successfully prevents accidental deletions
- **SC-007**: Users can navigate pagination smoothly with all pages loading and displaying tasks correctly
- **SC-008**: All new UI elements (header, delete button, dialog, pagination) display consistently within the retro neo-purple visual style
- **SC-009**: App remains performant with 100+ tasks in localStorage (no noticeable lag in interactions)

## Assumptions

- Users have a modern browser with support for CSS flexbox, localStorage, and drag-and-drop APIs
- The retro 80s neo-purple design system is maintained across all components and follows the existing Tailwind CSS configuration
- Task data is small enough to persist entirely in localStorage without exceeding browser storage limits
- The existing `useTodos` composable will be extended to handle task ordering and creation date tracking (including relative time formatting), with support for detecting missing created_at metadata
- Date display will use relative format (e.g., "2 hours ago") with absolute timestamp on hover for accessibility
- Touch devices will use long press (500ms+) to activate drag mode, followed by standard drag and drop
- Mouse/desktop devices will use standard click and drag on the drag handle
- No API or backend changes are required; all changes are front-end only
- Existing tasks without created_at metadata will be safely migrated by displaying "Date unknown" rather than assuming upgrade timestamps
- The existing task creation flow will be modified to capture and store the creation timestamp
