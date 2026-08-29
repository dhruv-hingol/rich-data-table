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
  routes/
    appRouter.tsx            # Lazy-loaded routes (InventoryDashboardPage, InventoryFormPage)
  pages/
    InventoryDashboardPage.tsx
    InventoryFormPage.tsx
  features/
    inventory/
      api/
        apiInterceptor.ts     # Request/response interceptor layer
        inventoryApi.ts       # Unified API interface
        inventoryKeys.ts      # Query key factory
        useInventoryQuery.ts  # TanStack Query custom hooks
        useInventoryMutations.ts # Mutation hooks (create, update, delete, bulk import)
      components/
        InventoryTable.tsx           # AG Grid table view
        TableToolbar.tsx             # Search box, column manager trigger, add/import buttons
        ColumnManagerPanel.tsx       # Show/hide/reorder columns, persists to localStorage
        SelectionActionBar.tsx       # Floating bar: "N selected" + bulk delete/export
        StatusSummaryStrip.tsx       # KPI status cards with active filter state
        AppliedFiltersBar.tsx        # Applied filter badge chips
        FilterSheet.tsx              # Slide-over filter drawer
        DeleteConfirmDialog.tsx      # Bulk delete modal confirmation
        EmptyState.tsx
        TableSkeleton.tsx
        ImportPreviewTable.tsx       # AG Grid preview table (theme="legacy")
        RecordForm.tsx               # Shared form body container
        RecordFormSkeleton.tsx
        bulk-import/
          BulkImportDialog.tsx       # 3-step wizard with switch-case step dispatch
          ImportWizardSteps.tsx      # Step progress indicator bar
          UploadStep.tsx             # Step 1 drag & drop upload dropzone
          ValidationPreviewStep.tsx  # Step 2 validation preview with Lucide icons
          CommitSummaryStep.tsx      # Step 3 commit summary
        form-sections/
          index.ts
          ProductDetailsSection.tsx  # Form section with red required asterisks
          StockLocationSection.tsx
          PricingFinancialSection.tsx
          SupplierInfoSection.tsx
          PhysicalSpecsSection.tsx
      constants/
        filterOptions.ts     # Select options for category, warehouse, status
        formDefaultValues.ts # Form default values and tab metadata
        statusCardConfigs.ts # KPI status card definitions & card generator
      hooks/
        useTabScrollSpy.ts   # ScrollSpy tracking for form sections
      lib/
        columnDefsFactory.tsx # Generates AG Grid colDefs from schema
        csvParser.ts          # PapaParse streaming wrapper + row-to-schema mapping
        mockServer.ts         # In-memory database + debounced IDB persistence
        mockDataGenerator.worker.ts # Web Worker Faker generator
        recordSchema.ts       # Zod schema — single source of truth for form + CSV
      store/
        useTableUIStore.ts    # Zustand: selectedIds, search, statusFilter, visibleColumns
      types/
        inventory.types.ts
  components/
    data-table/
      index.tsx              # Reusable AgGridTable wrapper with theme="legacy"
      table-pagination.tsx   # Custom pagination controls
    tables/
      table-header.tsx
    ui/                      # Primitives (button, input, select, modal, drawer, toast, badge, checkbox, etc.)
  hooks/
    useDebouncedValue.ts
    useUndoableAction.ts     # Generic undo-toast timer logic for single delete
  styles/
    ag-grid-theme.css        # CSS-variable overrides for AG Grid theming API
    globals.css
README.md
PROMPT.md
INDEX.md
SKILL.md
```

Rule for the agent: **one component = one responsibility.** `InventoryTable.tsx` never contains
form logic; `BulkImportDialog.tsx` never talks to AG Grid directly — it calls `useBulkCreateRecordsMutation`.

---

## 4. Fake API surface (implement all of these — treat as a real REST contract)

```ts
// inventoryApi.ts
listRecords(params: {
  page: number; pageSize: number;
  sortBy?: string; sortDir?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}): Promise<PaginatedResponse<InventoryRecord>>

getRecord(id: string): Promise<InventoryRecord>

createRecord(payload: CreateInventoryRecordPayload): Promise<InventoryRecord>

updateRecord(id: string, patch: UpdateInventoryRecordPayload): Promise<InventoryRecord>

deleteRecords(ids: string[]): Promise<{ deletedIds: string[] }>

bulkCreateRecords(rows: Partial<InventoryRecord>[]): Promise<{
  created: InventoryRecord[];
  rejected: { row: Record<string, unknown>; errors: string[] }[];
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
  or a paginated client cache + `useInventoryRecordsQuery` fetched in pages of 25–100, appended to the
  grid's data source. Column virtualization on by default.
- Checkbox selection column pinned left. Row height comfortable (36–40px).
- Sticky header. Horizontal scroll with a visible custom scrollbar.
- Column pinning: SKU and Checkbox pinned left by default.
- AG Grid `theme="legacy"` configured to prevent v33 Error #239 styling conflicts.

**TableToolbar.tsx**
- Debounced global search input (300ms) — filters via `search` param, not client-side substring scan.
- "Manage columns" button -> opens `ColumnManagerPanel`.
- "Add record", "Import CSV", "Delete selected" (disabled/hidden until ≥1 row selected) buttons.
- Row count: "Showing X of Y records" — always visible, data-scale cue.

**ColumnManagerPanel.tsx**
- Controlled checkbox list of all 49 columns, preset buttons (*Essentials*, *Inventory*, *Pricing*, *Supplier*, *All*).
- Persists choice to `localStorage` key `'apex_visible_columns_v1'`.

**AddRecordDialog.tsx / RecordForm.tsx**
- Grouped into 6 tabbed/scrollspy collapsible sections matching domain groups. Inline Zod validation,
  submit disabled until valid, dynamic red asterisk indicators (`<span className="text-rose-500 font-bold ml-0.5">*</span>`),
  and instant query cache invalidation on submission.

**BulkImportDialog.tsx** (three explicit steps with switch-case step rendering)
1. **Upload (`UploadStep.tsx`)** — drag/drop or file picker, accept `.csv` only, show Lucide upload icons.
2. **Preview & validate (`ValidationPreviewStep.tsx`)** — stream-parse with PapaParse, run each row through Zod,
   render lazy-loaded `<ImportPreviewTable>` (AG Grid with `theme="legacy"`), valid/invalid row counters with Lucide icons.
3. **Commit (`CommitSummaryStep.tsx`)** — calls `useBulkCreateRecordsMutation`, progress indicator, final summary toast,
   and invalidates `inventoryKeys.all` so table updates immediately without page refresh.

**DeleteConfirmDialog.tsx**
- Shown for bulk delete (≥2 rows). Single-row delete uses `useUndoableAction` (5s undo toast).

**SelectionActionBar.tsx**
- Floating bar when `selectedRows.size > 0`: "N items selected — Delete / Export / Clear."

---

## 6. Non-negotiable technical requirements

- No `useState<InventoryRecord[]>` holding the full dataset anywhere. All row data flows through
  TanStack Query's cache.
- Debounce all search/filter inputs (300ms).
- CSV parsing must be streaming (`Papa.parse(file, { step: ... })`), zero main thread blocking.
- Every mutation (create/delete/bulk-import) invalidates or optimistically updates `inventoryKeys.all`.
- Loading state: skeleton rows, not a spinner overlay, on first load only.
- Code splitting and dynamic imports (`React.lazy` + `Suspense`) across routes, modals, form sections, and step views.
- Clean `@/src` path aliases configured across TypeScript and Vite.

---

## 7. Explicit "don't" list (things that look like shortcuts and will be penalized)

- Don't fetch all rows once and filter/sort/paginate in-memory in the browser.
- Don't use `window.confirm()` for delete — use custom confirmation dialogs.
- Don't parse the whole CSV into a JS string with `FileReader.readAsText`.
- Don't put selection state or filter state inside TanStack Query — belongs in Zustand.
- Don't omit AG Grid `theme="legacy"` when combining CSS file imports with v33 engine.

---

## 8. AI Integration & Workflow Report

### Prompts Used & Interaction Summary
1. **Form Required Red Asterisks Refactoring:**
   - *Prompt:* `"in form, requried field astrik must be in red color", "can used title and erorr directl into input", "in input, pass required field and if yes then * will show, not in label"`
   - *Action:* Updated `Input` and `Select` UI primitives to accept `required?: boolean`. Red asterisks (`<span className="text-rose-500 font-bold ml-0.5">*</span>`) are rendered automatically inside input/select labels, stripping hardcoded `*` strings across all form section components (`ProductDetailsSection`, `StockLocationSection`, `PricingFinancialSection`, `SupplierInfoSection`).

2. **Icon Library Migration:**
   - *Prompt:* `"add icon from library", "in this file we have icon, used library for htat"`
   - *Action:* Replaced plain text arrows `→`, checkmarks `✓`, crosses `✕`, file emojis `📄`, and party emojis `🎉` with `lucide-react` icons (`UploadCloud`, `CheckCircle2`, `XCircle`, `ChevronRight`).

3. **Modular Step Architecture & Switch Dispatch:**
   - *Prompt:* `"make small component for steps and used it here, creae file in same folder only", "for this also make separete steps component, used that directly here", "here can we used switch case and for better?"`
   - *Action:* Refactored `BulkImportDialog.tsx` to extract step content into `ImportWizardSteps.tsx`, `UploadStep.tsx`, `ValidationPreviewStep.tsx`, and `CommitSummaryStep.tsx`. Rendered steps cleanly using a `renderStepContent()` helper with a `switch (step)` statement.

4. **AG Grid Import Preview & Legacy Theme Error #239 Fix:**
   - *Prompt:* `"here cna we used ag table in place of it", "AG Grid #239: Theming API and CSS File Themes are both used in the same page... because no value was provided to the theme grid option it defaulted to themeQuartz."`
   - *Action:* Created [`ImportPreviewTable.tsx`](file:///d:/practice/rich-data-table/src/features/inventory/components/ImportPreviewTable.tsx) using `AgGridReact` to replace the static HTML preview table in `ValidationPreviewStep.tsx`. Passed `theme="legacy"` to both `ImportPreviewTable` and `AgGridTable` to resolve AG Grid Error #239.

5. **Instant Query Cache Invalidation on Commit:**
   - *Prompt:* `"when commit the report and back to table, then ned to refresh to get the new data, make sure it should not required any of that , once i do commit, it should include directly in tabelw ithout any refresh of table"`
   - *Action:* Added `useBulkCreateRecordsMutation` in `useInventoryQuery.ts` and called `queryClient.invalidateQueries({ queryKey: inventoryKeys.all })` upon bulk commit in `BulkImportDialog.tsx`, ensuring imported records appear in the table immediately without manual page refresh.

6. **Dynamic Import & Code Splitting:**
   - *Prompt:* `"add dynamic import and make sure it shuold be used in each file"`
   - *Action:* Implemented `React.lazy()` and `<Suspense>` across `appRouter.tsx`, `App.tsx`, `InventoryDashboardPage.tsx`, `InventoryFormPage.tsx`, `BulkImportDialog.tsx`, and `ValidationPreviewStep.tsx`.

7. **Centralized `@/src` Path Aliasing:**
   - *Prompt:* `"import any file it should use "@/src" instead of "../../" in such way"`
   - *Action:* Configured `@/src` and `@` path aliases in `vite.config.ts` and `tsconfig.app.json`. Refactored imports across all component files to use `@/src/...`.

8. **Extracted Status KPI Card Configuration:**
   - *Prompt:* `"write this in constatn file and take count froom arugment"`
   - *Action:* Created [`statusCardConfigs.ts`](file:///d:/practice/rich-data-table/src/features/inventory/constants/statusCardConfigs.ts) containing `STATUS_CARD_CONFIGS` definitions and `getStatusSummaryCards(counts)`. Refactored `StatusSummaryStrip.tsx` to derive card configurations dynamically.

### What Was Written Manually vs. AI-Assisted
- **Scaffolding & Boilerplate (AI-Assisted):** 49 column definitions, Zod schema defaults, fake domain data fields via FakerJS, initial UI layout.
- **Data Engine & Business Logic (Collaborative):** `mockServer.ts` server-side search/filter/pagination logic, debounced IndexedDB persistence, `idb-keyval` window unload flushing.
- **Manual Oversight & Refactorings (Human Review):**
  - **Column Manager Panel Controlled State:** Converted uncontrolled checkboxes to controlled components wired to `visibleColumns` in Zustand store with `localStorage` persistence.
  - **IndexedDB Mutation Performance Optimization:** Replaced synchronous full-array IndexedDB writes per mutation with a 2000ms debounced trailing edge `scheduleSaveToIDB` plus `window.beforeunload` flush.
  - **AG Grid Error #239 Fix:** Identified and resolved AG Grid v33 theme conflict by explicitly specifying `theme="legacy"`.

### Areas for Further Review With More Time
- **SQLite Wasm Web Worker:** Moving the mock database out of main-thread JavaScript arrays into a Web Worker running SQLite Wasm for 1M+ row scalability.
- **Multi-Cell Batch Inline Editing:** Extending AG Grid with multi-cell batch editing and dirty-state transaction commits.


