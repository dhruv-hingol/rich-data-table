# SKILL.md — Build Flow for the Coding Agent

This file governs **order and checkpoints**. `PROMPT.md` governs **content**. Read both before
starting. Work phase by phase — do not jump ahead to Phase 5 polish while Phase 2 is unfinished;
each phase ends with a checkpoint you (the human) confirm before continuing, so the agent doesn't
drift into building UI polish on top of a broken data layer.

Paste each phase's prompt into the agent one at a time. Don't paste all phases in one giant prompt —
smaller, verified steps produce more reliable output than one 3,000-word instruction dump.

---

## Phase 0 — Scaffold (≈15 min)

**Prompt to send:**
> Scaffold a Vite + React + TypeScript project. Install: ag-grid-community, ag-grid-react,
> @tanstack/react-query, zustand, react-hook-form, zod, @hookform/resolvers, papaparse,
> @faker-js/faker, idb-keyval, tailwindcss, and shadcn/ui (init with the default style).
> Create the exact folder structure from section 3 of PROMPT.md as empty files with a one-line
> comment describing each file's responsibility. Do not implement logic yet — this phase is
> structure only.

**Checkpoint:** `npm run dev` boots to a blank page with no console errors. Folder tree matches
PROMPT.md section 3 exactly. If the agent invented extra folders or renamed anything, reject and
re-run before continuing.

---

## Phase 1 — Data layer first (before any UI)

**Prompt to send:**
> Implement `inventory.types.ts`, `recordSchema.ts` (Zod), `mockDataGenerator.worker.ts`, and
> `mockServer.ts` from PROMPT.md section 4. The worker should generate 50,000 records on app
> init and store them in memory (module-level array is fine) or IndexedDB via idb-keyval.
> `mockServer.ts` must implement pagination, sort, search, and column-filter logic entirely
> server-side (i.e., inside this file), with an artificial 150–500ms delay per call. Write a
> Vitest test file that calls `listRecords` with a search term and asserts filtering happens
> before pagination, not after.

**Checkpoint:** Run the Vitest suite — it passes. In a scratch `console.log`, call
`listRecords({ page: 1, pageSize: 20 })` and confirm it resolves after a visible delay with the
right shape. **Do not proceed to UI until this works** — every UI bug downstream traces back to
data-layer bugs, and it's far cheaper to fix here.

---

## Phase 2 — Wire TanStack Query + the fake API

**Prompt to send:**
> Implement `inventoryApi.ts` as a thin wrapper over `mockServer.ts` matching the function
> signatures in PROMPT.md section 4 exactly. Implement `inventoryKeys.ts` as a query key factory.
> Implement `useInventoryList.ts`, `useCreateRecord.ts`, `useDeleteRecords.ts`, `useBulkImport.ts`
> per section 4. `useDeleteRecords` and `useCreateRecord` should update the query cache
> optimistically, not just invalidate-and-refetch.

**Checkpoint:** Build a throwaway debug component that calls `useInventoryList` and dumps JSON to
the screen. Confirm loading/success/error states all render correctly before writing a single
line of grid code.

---

## Phase 3 — The grid itself

**Prompt to send:**
> Implement `columnDefsFactory.ts` to generate AG Grid column definitions from the ~50-field
> schema, grouped per PROMPT.md section 2. Implement `InventoryTable.tsx` and
> `InventoryTable.columns.tsx` wired to `useInventoryList`. Use AG Grid's server-side row model
> (or infinite row model) — not client-side — so the grid never holds more than a couple hundred
> rows in memory at once. Add checkbox selection, column pinning for id/sku, and sticky header.
> Apply `ag-grid-theme.css` using AG Grid's theming API (CSS variables), not the default enterprise
> look.

**Checkpoint:** Load the app — grid renders, scrolls smoothly both vertically (tall) and
horizontally (wide, 50+ columns), sorting a column round-trips through `mockServer.ts` (add a
temporary console log there to confirm), and selection checkboxes work. This is the single most
important checkpoint in the whole build — don't move on until scroll performance actually feels good.

---

## Phase 4 — Toolbar, search, column manager

**Prompt to send:**
> Implement `TableToolbar.tsx` with debounced search (use `useDebouncedValue.ts`),
> `ColumnManagerPanel.tsx` with Drawer slide-over, show/hide/reorder + localStorage persistence, and
> `useTableUIStore.ts` (zustand) holding selectedIds, filterText, and columnVisibility. Wire the
> toolbar's search box to `useInventoryList`'s `search` param.

**Checkpoint:** Typing in search visibly debounces (no request per keystroke — check network/console),
hiding columns actually removes them from the grid and survives a page reload.

---

## Phase 5 — Add record

**Prompt to send:**
> Implement `RecordForm.tsx` and `AddRecordDialog.tsx` per PROMPT.md section 5, using
> `recordSchema.ts` for validation with react-hook-form + zodResolver. Group fields into
> collapsible sections. On submit, call `useCreateRecord`, show a success toast, close the dialog,
> and confirm the new row appears in the grid without a manual refetch.

**Checkpoint:** Submit a valid record — appears in grid immediately. Submit an invalid one — inline
errors show, nothing is sent to the API.

---

## Phase 6 — Bulk CSV import

**Prompt to send:**
> Implement `csvParser.ts` (streaming PapaParse) and `BulkImportDialog.tsx` /
> `ImportPreviewTable.tsx` as the 3-step wizard in PROMPT.md section 5: upload -> preview/validate
> (reuse `recordSchema.ts` per row) -> commit via `useBulkImport`. Provide a sample malformed CSV
> in `/public/sample-import.csv` with a few intentionally bad rows for testing. Show a
> valid/invalid row count and let the user download an errors-only CSV.

**Checkpoint:** Import a 5,000-row CSV with ~20 broken rows — UI stays responsive during parsing
(no frozen tab), preview correctly separates valid/invalid, commit only sends valid rows, grid
updates after commit.

---

## Phase 7 — Delete (single + bulk)

**Prompt to send:**
> Implement `useUndoableAction.ts` (generic undo-timer hook) and wire single-row delete to it:
> remove from cache immediately, show a 5s toast with an "Undo" button, only call
> `useDeleteRecords` when the toast expires without undo being clicked. Implement
> `SelectionActionBar.tsx` and `DeleteConfirmDialog.tsx` for bulk delete (≥2 rows): confirm dialog,
> then a single `useDeleteRecords` call with all selected ids.

**Checkpoint:** Delete one row -> toast appears -> click Undo -> row comes back with no network
call having fired. Select 5 rows -> bulk delete -> confirm dialog -> all 5 gone in one request.

---

## Phase 8 — Polish pass (UI/UX grading criteria live here)

**Prompt to send:**
> Do a polish pass: `EmptyState.tsx` and a distinct zero-search-results state, `TableSkeleton.tsx`
> for first load only, loading/error boundaries around the grid, empty toolbar states, consistent
> spacing/typography via Tailwind, keyboard navigation check on all dialogs, and a final look at
> `ag-grid-theme.css` so the grid doesn't look like default AG Grid. Run Lighthouse and fix any
> obvious accessibility contrast issues.

**Checkpoint:** Click through the whole app cold, as a reviewer would — every state (empty, loading,
error, populated, mid-import, mid-delete) looks intentional, not default.

---

## Phase 9 — Docs

**Prompt to send:**
> Write README.md covering: (1) the decision you're least sure about and the rejected alternative
> — use the AG Grid vs TanStack Table tradeoff from our planning discussion; (2) what breaks first
> at 10x the data (~1M rows) and what you'd do about it — discuss the in-memory mock server's
> linear-scan filter/sort becoming the bottleneck, and moving to indexed lookups or a real backend
> with DB-level filtering; (3) what you'd build next with more time — e.g. column-level saved
> views, real virtualized CSV preview for very large files, server-side full-text search,
> inline cell editing. Write prompt.md documenting every prompt used in this session, honestly,
> including what you had to fix by hand afterward.

**Checkpoint:** Both docs read like they were written by the person who built this, not generated
filler — the README's three answers should reference actual decisions made during this build, not
generic statements.

---

## Rules that apply across every phase

1. Never let the agent skip the data layer (Phase 1–2) to get to visible UI faster — this is the
   most common way these builds end up with silent 50k-row-in-memory bugs discovered too late.
2. After every phase, re-run the app and actually interact with it before sending the next
   phase's prompt — don't chain phases on trust.
3. If the agent's output diverges from PROMPT.md (wrong library, wrong file location, collapsed
   the CSV wizard into one step, etc.), stop and correct immediately rather than layering the next
   phase on top of the deviation.
4. Keep every prompt you send — verbatim — for `prompt.md`. Don't reconstruct them from memory later.
