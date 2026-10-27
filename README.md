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
- Attractive cards with avatar, name, role, company, owner, and label badges.
- Empty state message for columns with zero contacts.
- Scrollable within each column for many contacts.
- Clicking a card opens the same contact details panel.

### Contact Details Panel
- Right-side panel (full width on narrow screens).
- Editable fields: Name, Email, Company, Role, Owner, Stage (select), Labels (add/remove), Notes (textarea).
- **Save Changes** button (disabled when no changes detected).
- **Cancel** button to discard unsaved edits.
- Closing the panel (X button) does not save changes.
- Closing preserves the current Table or Board view.

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
```

### Key design decisions

1. **Single source of truth**: Both views derive their records from the same `contacts` array. There are no separate copies for Table and Board.
2. **Draft-based editing**: The `ContactDetailsPanel` creates a local `draft` copy via `useState`. Editing the draft never mutates the saved contact. Only clicking "Save" writes back to the canonical state.
3. **Immutable updates**: All state updates use functional updaters (`setContacts(prev => prev.map(...))`) — no direct mutation of arrays or objects.
4. **Derived values via `useMemo`**: Filtered contacts and the selected contact are computed from canonical state, avoiding stale or duplicated data.
5. **Stable IDs**: Contacts are identified by their `id` field. Stage changes, saves, and view switches all key off this stable identifier.
6. **View independence**: Switching between Table and Board does not reset, duplicate, or lose any data. The `currentView` flag is orthogonal to the contacts dataset.

### Synchronization guarantees

- Saving a stage change immediately moves the contact into the correct Board column and updates the Table row.
- Repeated view switches are safe: no duplication, no data loss.
- Cancel discards the draft and resets to the last saved values.
- The close button discards unsaved changes without saving.

---

## Component Structure

```
src/
├── components/
│   ├── AppHeader.tsx           — Header with search, view toggle, add button
│   ├── ViewSwitcher.tsx        — Table/Board toggle tabs
│   ├── ContactsTable.tsx       — Table container and column headers
│   ├── ContactTableRow.tsx     — Individual table row with badges
│   ├── ContactsBoard.tsx       — Board layout grouping contacts by stage
│   ├── BoardColumn.tsx         — Single Kanban column with header and cards
│   ├── ContactCard.tsx         — Card component for the board view
│   ├── ContactDetailsPanel.tsx — Right-side editable details panel
│   ├── StageBadge.tsx          — Colored stage indicator badge
│   ├── LabelBadge.tsx          — Colored label badge
│   └── EmptyState.tsx          — Reusable empty state with icon
├── data/
│   └── contacts.ts             — 10 fictional initial contacts
├── types/
│   └── contact.ts              — Contact interface & Stage/ViewMode types
├── App.tsx                     — Root component with canonical state
├── main.tsx                    — Entry point
└── index.css                   — Tailwind v4 import & design tokens
```

## Design Choices

- **Indigo/lavender accent palette** with neutral grays for a professional SaaS appearance.
- **Inter font** (Google Fonts) for clean, modern typography.
- **Glassmorphism header** with `backdrop-blur` for depth.
- **Gradient avatar circles** instead of placeholder images for personality without external assets.
- **Consistent rounded corners** (rounded-lg/xl) throughout.
- **Subtle transitions** (150ms) on interactive elements — hover, focus, selection.
- **Custom scrollbars** for a polished feel.
- **Accessible controls**: ARIA roles, keyboard focus rings, semantic HTML, labeled form inputs.

## Trade-offs

- **No drag-and-drop**: Omitted in favor of a reliable stage dropdown in the details panel. DnD would add complexity without improving the core evaluation criteria.
- **No persistent storage**: State resets on page refresh. Adding `localStorage` persistence would be a small enhancement.
- **No sorting/filtering beyond search**: Could be extended with column header sort toggles and filter dropdowns.
- **No confirmation dialog for unsaved changes**: Closing the panel silently discards the draft. A "Discard changes?" modal would improve UX.

## What Could Be Improved

- Add `localStorage` or `IndexedDB` persistence so data survives page refreshes.
- Implement drag-and-drop for stage transitions on the board.
- Add column sorting (click column headers to sort).
- Add a confirmation modal when discarding unsaved changes.
- Add pagination or virtualization for large contact lists.
- Add unit tests with Vitest and component tests with React Testing Library.
- Add keyboard shortcuts (Escape to close panel, etc.).
- Implement a proper responsive mobile layout for the board view.
