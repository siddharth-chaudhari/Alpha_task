# Contacts CRM

A modern, premium contact management application built as an evaluation exercise. The app provides two synchronized views — **Table** and **Board (Kanban)** — for managing fictional business contacts, with a shared right-side details panel for viewing and editing contact information.

![Table View](docs/table-view.png)

## Technologies Used

| Technology | Purpose |
|---|---|
| **React 19** | Component library and UI rendering |
| **TypeScript 7** | Static type checking |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS v4** | Utility-first styling (with `@tailwindcss/vite` plugin) |
| **Lucide React** | Consistent SVG icon library |
| **React Hooks** | State management (`useState`, `useMemo`, `useCallback`, `useEffect`) |

No backend, database, or external state management library is used.

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Installation

```bash
git clone <repository-url>
cd Alpha_task
npm install
```

## Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Production Build

```bash
npm run build
```

The output is written to the `dist/` directory. To preview the production build locally:

```bash
npm run preview
```

## Deployment

To deploy to **Vercel**:

```bash
npx vercel
```

To deploy to **Netlify**, push the repository and configure:
- Build command: `npm run build`
- Publish directory: `dist`

---

## Features

### Table View
- Spreadsheet-style table with columns: Name, Email, Company, Role, Owner, Labels, Stage, Notes.
- Avatar initials with gradient background for each contact.
- Colored stage badges and label badges.
- Em dash (`—`) placeholders for missing optional fields.
- Truncated notes column to prevent layout breakage.
- Hover and keyboard-focus states for rows.
- Horizontal scrolling on narrower desktops.
- Clicking a row opens the contact details panel.

### Board View (Kanban)
- Four fixed columns: Lead, Prospect, Qualified, Customer.
- Contact count in each column header.
- **Drag-and-Drop**: Drag cards between columns to update stage immediately. Supports dropping into empty columns with active visual drop targets and grabbing cursor affordance.
- Attractive cards with avatar, name, role, company, owner, grip handle, and label badges.
- Empty state message for columns with zero contacts.
- Scrollable within each column for many contacts.
- Clicking a card opens the same contact details panel (drag-protected to avoid accidental clicks).

### Contact Details Drawer
- Resizable right-side drawer (320px min, up to 720px max, default 420px) with persistent width in `localStorage`.
- Left-edge drag handle with hover/focus indicator and ArrowLeft/ArrowRight keyboard support.
- Fully responsive: full-width on mobile viewports.
- Smooth slide-in and slide-out transitions (200ms) with animated backdrop opacity and reduced-motion support.
- **Outside-Click Closing**: Clicking the backdrop closes the drawer.
- **Unsaved Changes Confirmation**: If draft is modified, clicking outside, pressing Escape, or clicking Close prompts a confirmation dialog ("Keep Editing" / "Discard Changes"). Clean close if no changes.
- Editable fields: Name, Email, Company, Role, Owner, Stage (select), Labels (add/remove), Notes (textarea).
- **Save Changes** button with validation feedback.
- **Cancel** button to discard unsaved edits without exiting.

### Notifications (Toast System)
- Top-right toast notifications positioned below the navbar.
- Success toasts on save ("Contact updated successfully." or "Contact created successfully." for new contacts).
- Error toasts on validation failures (e.g. empty name).
- Auto-dismiss after ~3s and manual dismiss button.
- ARIA live region support and rapid-save deduplication.

### Theme Switching (Dark & Light Mode)
- Navbar toggle button with Sun and Moon icons.
- Class-based theme switching compatible with Tailwind CSS v4.
- Full color scheme support across navbar, tables, cards, board columns, drawer, inputs, dialogs, badges, and toasts.
- Preference persisted in `localStorage` (`alpha_crm_theme`) with system preference detection and zero-flash inline head script.

### Search
- Case-insensitive search across name, email, and company.
- Results update in real time for both Table and Board views.
- Board view filters cards within their columns; empty columns remain visible.
- "No contacts found" empty state when no matches.

### Add Contact
- Creates a new contact with a unique ID and defaults (stage: Lead).
- Immediately opens the details panel for editing.
- Appears in both Table and Board views.

---

## State Management Design

The application uses a single canonical state model in the root `App` component:

```
contacts          — the saved array of Contact records (source of truth)
currentView       — 'table' | 'board'
selectedContactId — ID of the currently opened contact, or null
searchQuery       — the current search string
theme             — 'light' | 'dark'
toasts            — active Toast notifications array
```

### Key design decisions

1. **Single source of truth**: Both views derive their records from the same `contacts` array. Drag-and-drop and drawer editing update the exact same canonical state.
2. **Draft-based editing**: The `ContactDetailsPanel` creates a local `draft` copy via `useState`. Editing the draft never mutates the saved contact. Only clicking "Save" writes back to the canonical state.
3. **Immutable updates**: All state updates use functional updaters (`setContacts(prev => prev.map(...))`) — no direct mutation of arrays or objects.
4. **Derived values via `useMemo`**: Filtered contacts and the selected contact are computed from canonical state, avoiding stale or duplicated data.
5. **Stable IDs**: Contacts are identified by their `id` field. Stage changes, drag-and-drop moves, saves, and view switches all key off this stable identifier.
6. **View independence**: Switching between Table and Board does not reset, duplicate, or lose any data. The `currentView` flag is orthogonal to the contacts dataset.

### Synchronization guarantees

- Saving a stage change immediately moves the contact into the correct Board column and updates the Table row.
- Dragging a card to a new column immediately updates the contact's stage in the Table View and canonical state.
- Repeated view switches are safe: no duplication, no data loss.
- Cancel discards the draft and resets to the last saved values.
- Unsaved changes are protected by a confirmation modal on backdrop click, Escape key, or close button.

---

## Component Structure

```
src/
├── components/
│   ├── AppHeader.tsx            — Header with search, theme toggle, view toggle, add button
│   ├── ViewSwitcher.tsx         — Table/Board toggle tabs with keyboard arrow navigation
│   ├── ContactsTable.tsx        — Table container and column headers
│   ├── ContactTableRow.tsx      — Individual table row with badges & dark styles
│   ├── ContactsBoard.tsx        — Board layout grouping contacts by stage
│   ├── BoardColumn.tsx          — Kanban column with drop target & count badge
│   ├── ContactCard.tsx          — Draggable card component with grab affordance
│   ├── ContactDetailsPanel.tsx  — Resizable drawer with backdrop, transitions & confirmation
│   ├── ConfirmDiscardDialog.tsx — Modal confirmation for unsaved changes
│   ├── Toast.tsx                — Accessible toast notifications container & items
│   ├── StageBadge.tsx           — Colored stage indicator badge (light & dark)
│   ├── LabelBadge.tsx           — Colored label badge (light & dark)
│   └── EmptyState.tsx           — Reusable empty state with icon
├── data/
│   └── contacts.ts              — 10 fictional initial contacts
├── types/
│   ├── contact.ts               — Contact interface & Stage/ViewMode types
│   └── toast.ts                 — ToastMessage & ToastType definitions
├── App.tsx                      — Root component with canonical state & theme management
├── main.tsx                     — Entry point
└── index.css                    — Tailwind v4 import, custom dark variant & tokens
```

## Design Choices

- **Indigo/lavender accent palette** with neutral grays for a professional SaaS appearance.
- **Full Dark Mode support** with high-contrast surfaces (`surface-900` / `surface-950`).
- **Inter font** (Google Fonts) for clean, modern typography.
- **Glassmorphism header** with `backdrop-blur` for depth.
- **Gradient avatar circles** with initials and safe fallbacks.
- **Subtle transitions** (150–200ms) on interactive elements, respecting `prefers-reduced-motion`.
- **Custom scrollbars** for both light and dark themes.
- **Accessible controls**: ARIA roles, live regions, keyboard focus rings, semantic HTML, labeled form inputs.

## Trade-offs

- **HTML5 native drag-and-drop**: Zero runtime bundle bloat and 100% React 19 compatibility without external package peer-dependency conflicts.
- **No persistent contact storage**: Contact mutations reset on page refresh (theme and drawer width preferences are persisted in `localStorage`).
- **No column sorting beyond search**: Search provides instant filtering; column sorting can be added as a future enhancement.

## What Could Be Improved

- Add `localStorage` or `IndexedDB` persistence so contact modifications survive page refreshes.
- Add column sorting (click column headers to sort by Name, Company, Stage, etc.).
- Add pagination or virtualization for large contact lists (1,000+ contacts).
- Add unit tests with Vitest and component tests with React Testing Library.
