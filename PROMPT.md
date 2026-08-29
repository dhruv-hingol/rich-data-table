# PROMPT.md — Master Build Spec

Feed this whole file to the agent (Claude Code / Cursor) as the first message of the session.
It is the single source of truth for what "done" looks like. `SKILL.md` governs the *order*
you work in; this file governs *what* to build.

---

## 0. One-paragraph brief (paste this verbatim as the opening prompt)

> Build a React + TypeScript data table app for browsing 10,000–100,000 mock e-commerce
> inventory records, with 40–60 configurable columns. Data is served from a fake in-memory
> "server" layer (simulated latency + server-side pagination/sort/filter) accessed through
> TanStack Query — never load the full dataset into one component's state. Use AG Grid
> Community for the grid (row + column virtualization required at this width/height).
> Support: search/filter, add-record form (RHF + Zod), CSV bulk upload (PapaParse, streamed,
> with a validation/preview step before commit), single delete with undo-toast, and multi-select
> bulk delete with a confirm dialog. Style with Tailwind + shadcn/ui, custom AG Grid theme via
> CSS variables — no default enterprise-grid look. Follow the folder structure and component
> list below exactly; do not invent alternate locations for files.

---

## 1. Tech stack (fixed — do not substitute)

| Concern | Choice | Why (say this if asked) |
|---|---|---|
| Grid | `ag-grid-community` + `ag-grid-react` | Built-in row *and* column virtualization — required for 60-col width, not just tall-table height |
| Server state | `@tanstack/react-query` | Models data as async/paginated even though it's mocked — matches real backend integration later |
| UI state | `zustand` | Selection, filters, modal/drawer open state — kept separate from server cache, never duplicated |
| Forms | `react-hook-form` + `zod` | Add-record form validation, CSV row validation (same schema, reused) |
| CSV parsing | `papaparse` (streaming mode) | Never blocks main thread on large files |
| Styling | Tailwind CSS + `shadcn/ui` | Dialogs, drawers, toasts, buttons, inputs — AG Grid handles only the grid body |
| Fake backend | in-memory module + `idb-keyval` for persistence | Simulates a real API: latency, pagination, sort, filter, mutation — this is what "data-intensive design" is graded on |
| Testing | Vitest + React Testing Library | At minimum: CSV validation logic, delete/undo logic, filter logic |
| Build | Vite | Fast HMR for iteration |

Do not add Redux, MUI, Chakra, react-table/TanStack Table, or any second grid library.

---

## 2. Domain model

Entity: `InventoryRecord`. ~50 columns across these groups (spread them across the type,
don't cram unrelated fields together):

- **Identity (5):** id, sku, name, barcode, category
- **Classification (6):** subcategory, brand, tags[], variant, unit, hsCode
- **Inventory (8):** warehouseId, warehouseName, quantityOnHand, quantityReserved, quantityAvailable, reorderPoint, reorderQty, binLocation
- **Pricing (8):** costPrice, listPrice, salePrice, currency, marginPct, taxRate, discountPct, priceTier
- **Supplier (6):** supplierId, supplierName, supplierSku, leadTimeDays, minOrderQty, lastPurchaseDate
- **Status/lifecycle (6):** status (enum: active/discontinued/backorder/draft), isPerishable, expiryDate, weightKg, dimensionsCm, isFragile
- **Audit (6):** createdAt, updatedAt, createdBy, updatedBy, lastSoldAt, syncStatus
- **Derived/computed (5, computed client-side, not editable):** stockValue, daysOfSupply, isLowStock, isOverstock, ageInDays

That's ~50 fields — expose a "Manage Columns" panel so the *visible* set is configurable
(the assignment says column count should be "configurable," treat that as a real UI feature,
not just a prop).

Generate mock data with `@faker-js/faker`, deterministic seed, in a Web Worker so generating
50k+ rows doesn't freeze the UI on first load.

---

## 3. Folder structure (create exactly this)

```
src/
  app/
    App.tsx
    providers.tsx            # QueryClientProvider, ThemeProvider, Toaster mount
    router.tsx                # if using TanStack Router; single-route app is fine otherwise
  features/
    inventory/
      api/
        inventoryApi.ts       # fake network layer: list/create/update/delete/bulkCreate
        inventoryKeys.ts       # query key factory
        useInventoryList.ts    # useInfiniteQuery / useQuery wrapper (server-side paging)
        useCreateRecord.ts     # useMutation
        useDeleteRecords.ts    # useMutation, accepts string[] for bulk
        useBulkImport.ts       # useMutation, accepts validated rows[]
      components/
        InventoryTable.tsx           # AG Grid wrapper, owns column defs
        InventoryTable.columns.tsx   # column definitions, cell renderers
        TableToolbar.tsx             # search box, column-manager trigger, add/import/delete buttons
        ColumnManagerPanel.tsx       # show/hide/reorder columns, persists to localStorage
        AddRecordDialog.tsx          # RHF + Zod form in a shadcn Dialog
        RecordForm.tsx               # shared form body (used by Add + Edit)
        BulkImportDialog.tsx         # 3-step wizard: upload -> preview/validate -> commit
        ImportPreviewTable.tsx       # small AG Grid instance showing parsed rows + row-level errors
        DeleteConfirmDialog.tsx      # used for bulk delete only
        SelectionActionBar.tsx       # floating bar: "12 selected" + bulk delete/export
        EmptyState.tsx
        TableSkeleton.tsx
      lib/
        recordSchema.ts        # Zod schema — single source of truth for form AND CSV validation
        csvParser.ts           # PapaParse streaming wrapper + row-to-schema mapping
        mockServer.ts          # in-memory "database" + fake latency + query/sort/filter logic
        mockDataGenerator.worker.ts   # Web Worker, faker-based generator
        columnDefsFactory.ts    # generates AG Grid colDefs from schema, incl. cell types
      store/
        useTableUIStore.ts      # zustand: selectedIds, filterText, activeFilters, columnVisibility
      types/
        inventory.types.ts
  components/
    ui/                        # shadcn primitives (button, dialog, input, toast, etc.)
    layout/
      AppShell.tsx
      PageHeader.tsx
  hooks/
    useDebouncedValue.ts
    useUndoableAction.ts        # generic undo-toast timer logic, used by single-delete
  styles/
    ag-grid-theme.css           # CSS-variable overrides for AG Grid theming API
    globals.css
  test/
    csvParser.test.ts
    mockServer.test.ts
    useUndoableAction.test.ts
main.tsx
vite-env.d.ts
README.md
prompt.md
```

Rule for the agent: **one component = one responsibility.** `InventoryTable.tsx` never contains
form logic; `BulkImportDialog.tsx` never talks to AG Grid directly — it calls `useBulkImport`.

---

## 4. Fake API surface (implement all of these — treat as a real REST contract)

```ts
// inventoryApi.ts
listRecords(params: {
  page: number; pageSize: number;
  sortBy?: string; sortDir?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;   // column-level filters from AG Grid
}): Promise<{ rows: InventoryRecord[]; totalCount: number }>

getRecord(id: string): Promise<InventoryRecord>

createRecord(payload: NewInventoryRecord): Promise<InventoryRecord>

updateRecord(id: string, patch: Partial<InventoryRecord>): Promise<InventoryRecord>

deleteRecords(ids: string[]): Promise<{ deletedIds: string[] }>

bulkCreateRecords(rows: NewInventoryRecord[]): Promise<{
  created: InventoryRecord[];
  rejected: { row: number; errors: string[] }[];
}>
```

Every function must:
1. Await a random 150–500ms delay (simulate network).
2. Read/write from the in-memory store (or IndexedDB via `idb-keyval` for persistence across reload).
3. Do sort/filter/pagination **inside** this layer, not in the React component — this is the
   detail that proves "data-intensive design" thinking instead of dumping 50k rows into the client.

React Query hooks wrap these 1:1. No component calls `inventoryApi` directly — always through a hook.

---

## 5. Component-by-component UX spec

**InventoryTable.tsx**
- AG Grid, `rowModelType="clientSide"` is NOT allowed for 50k+ rows — use server-side row model
  or a paginated client cache + `useInfiniteQuery` fetched in pages of 200–500, appended to the
  grid's data source. Column virtualization on by default (AG Grid default behavior — don't disable it).
- Checkbox selection column pinned left. Row height comfortable (36–40px), zebra striping optional.
- Sticky header. Horizontal scroll with a visible custom scrollbar (60 columns needs this to feel navigable).
- Column pinning: id/sku pinned left by default.

**TableToolbar.tsx**
- Debounced global search input (300ms) — filters via `search` param, not client-side substring scan.
- "Manage columns" button -> opens `ColumnManagerPanel`.
- "Add record", "Import CSV", "Delete selected" (disabled/hidden until ≥1 row selected) buttons.
- Row count: "Showing X of Y records" — always visible, this is a data-scale cue the reviewer will look for.

**ColumnManagerPanel.tsx**
- Checkbox list of all ~50 columns, drag-to-reorder, "Show only essentials" preset button.
- Persists choice to localStorage so it survives reload.

**AddRecordDialog.tsx / RecordForm.tsx**
- Grouped into collapsible sections matching the domain-model groups above (nobody wants a 50-field
  flat form). Inline Zod validation, submit disabled until valid, optimistic insert into the grid
  on success with a toast confirmation.

**BulkImportDialog.tsx** (three explicit steps, don't collapse them)
1. **Upload** — drag/drop or file picker, accept `.csv` only, show filename + size.
2. **Preview & validate** — stream-parse with PapaParse, run each row through the shared Zod
   schema, show a small grid: total rows / valid / invalid, with invalid rows flagged and their
   specific field errors visible on hover or in an expandable panel. User can download an
   "errors only" CSV. Commit button disabled if 0 valid rows.
3. **Commit** — calls `bulkCreateRecords`, progress indicator for large files, final toast:
   "1,842 imported, 12 skipped."

**DeleteConfirmDialog.tsx**
- Only shown for bulk delete (≥2 rows) or when deleting >1 row. Single-row delete skips this —
  it uses the undo-toast pattern instead (delete immediately, 5s toast with "Undo", commit the
  mutation only after the toast expires or on next action).

**SelectionActionBar.tsx**
- Floating bar, appears when `selectedIds.length > 0`: "N selected — Delete / Clear selection."

---

## 6. Non-negotiable technical requirements

- No `useState<InventoryRecord[]>` holding the full dataset anywhere. All row data flows through
  TanStack Query's cache.
- Debounce all search/filter inputs.
- CSV parsing must be streaming (`Papa.parse(file, { step: ... })` or worker mode) — never
  `Papa.parse(fullString)` on a large file.
- Every mutation (create/delete/bulk-import) invalidates or optimistically updates the relevant
  query key — no manual full-page refetch.
- Loading state: skeleton rows, not a spinner overlay, on first load only (not on every page fetch).
- Empty state and zero-search-results state are distinct, both designed (not "No data").
- Accessibility: dialogs trap focus, table is keyboard-navigable (AG Grid gives you most of this —
  don't break it with custom cell renderers that swallow key events).

---

## 7. Explicit "don't" list (things that look like shortcuts and will be penalized)

- Don't fetch all rows once and filter/sort/paginate in-memory in the browser — defeats the point of the assignment.
- Don't use `window.confirm()` for delete — use the shadcn Dialog.
- Don't parse the whole CSV into a JS string with `FileReader.readAsText` then `JSON.parse`/split by newline — use PapaParse's streaming API.
- Don't put selection state or filter state inside TanStack Query — that's UI state, belongs in Zustand.
- Don't build a second custom virtualization layer on top of AG Grid — configure AG Grid's own virtualization correctly instead.

---

## 8. AI Integration & Workflow Report

### Prompts Used & Interaction Summary
1. **Architecture & Schema Scaffold:** Prompts establishing the 49-column `InventoryRecord` model, directory boundaries (Zustand for UI state vs TanStack Query for server state vs `mockServer.ts` for backend simulation), and Vite + Tailwind setup.
2. **Virtualization & AG Grid Integration:** Prompts targeting AG Grid Community configuration with 49 wide columns, custom cell renderers (stock badges, currency formatters), and viewport auto-resizing.
3. **PapaParse Streaming & Zod Validation:** Prompts generating the step-mode CSV streaming parser, normalizing raw headers, and handling row-level error reporting against `recordSchema.ts`.
4. **Refactoring & Polish Prompts:** Requests to verify strict TypeScript types (`tsc -b`), fix linting rules, and implement 5-second undo toast mechanics for single deletes.

### What Was Written Manually vs. AI-Assisted
- **Scaffolding & Boilerplate (AI-Assisted):** Generating the 49 column definitions, Zod schema defaults, fake domain data fields via FakerJS, and initial UI shell layout.
- **Data Engine & Business Logic (Collaborative):** Designing `mockServer.ts` to ensure search and multi-column filtering execute on the full dataset before pagination slicing, preventing false page-sliced search results.
- **Manual Oversight & Bug Fixes (Human Review):**
  - **Column Manager Wiring Fix:** Identified that the initial AI-generated `ColumnManagerPanel` rendered uncontrolled `defaultChecked` checkboxes and wrote `columnPreset` to Zustand without reading it anywhere in the grid. Rewrote `columnDefsFactory.tsx` and `useTableUIStore` to introduce controlled `visibleColumns` state, preset mappings, and `localStorage` persistence.
  - **IndexedDB Mutation Performance Fix:** Caught that `mockServer` was calling `set(IDB_KEY, this.records)` on every single row mutation (serializing 50,000 JSON items synchronously). Implemented a trailing 2-second debounced save with a `beforeunload` window listener flush.
  - **Fabricated Testing Claim Removal:** Audited `README.md` and removed fabricated claims regarding non-existent Vitest test suites, keeping documentation strictly aligned with verified codebase reality.

### Areas for Further Review With More Time
- **SQLite Wasm Web Worker:** Moving the mock database out of main-thread JavaScript arrays into a Web Worker running SQLite Wasm for 1M+ row scalability.
- **Inline Grid Cell Editing:** Extending AG Grid with multi-cell batch editing and dirty-state transaction commits.

