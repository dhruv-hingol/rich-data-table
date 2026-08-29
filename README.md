# Apex Inventory — Rich Virtualized Data Table

A high-performance, data-intensive React + TypeScript data table built to navigate, filter, edit, and bulk-import large-scale e-commerce inventory datasets (**50,000+ records**) across **49 wide columns** with row and column virtualization.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **npm** v9+

### Installation & Run

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Architecture & Tech Stack Defense

| Concern                           | Choice                                | Technical Rationale & Defense                                                                                                                                                                                                             |
| --------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Grid Engine**                   | `ag-grid-community` + `ag-grid-react` | Provides hardware-accelerated **row and column virtualization** out-of-the-box (`theme="legacy"` mode to eliminate AG Grid v33 Error #239). Crucial for handling 49 columns and 50k+ records without DOM bloat.                           |
| **Server State & Caching**        | `@tanstack/react-query` v5            | Treats mock dataset as async paginated backend server state. Features automatic query key invalidation (`inventoryKeys.all`), background refetching, instant multi-record commit updates, and `keepPreviousData` for seamless pagination. |
| **Code Splitting & Lazy Loading** | `React.lazy()` + `<Suspense>`         | Code-splits application routes, modals (`BulkImportDialog`, `FilterSheet`), form containers (`RecordForm`), and wizard steps into separate dynamic JavaScript bundles, optimizing initial page load time (~700ms build).                  |
| **Path Aliasing**                 | `@/src` (Vite + TS)                   | Centralized path alias (`@/src/*`) configured across `vite.config.ts` and `tsconfig.app.json` for clean, decoupled, and refactor-safe component imports.                                                                                  |
| **UI State**                      | `zustand`                             | Decoupled client UI state (selected row IDs, search query, filter drafts, column visibility) from data cache, preventing unnecessary grid re-renders.                                                                                     |
| **Form Logic & Schema**           | `react-hook-form` + `zod`             | Single source of truth Zod schema (`recordSchema.ts`) shared between the 6-section Add/Edit record form and CSV row-level stream validation. UI primitives support dynamic red required asterisks (`*`).                                  |
| **CSV Import Engine**             | `papaparse` + AG Grid Preview         | Uses `step`-based stream parsing for zero-main-thread-blocking CSV parsing, combined with a lazy-loaded AG Grid validation preview table (`ImportPreviewTable.tsx`) and modular 3-step wizard dispatch (`switch (step)`).                 |
| **Styling & Icons**               | Tailwind CSS v4 + `lucide-react`      | Modern visual aesthetics, dark-themed KPI summary cards, custom CSS variable overrides (`ag-grid-theme.css`), Sonner toast notifications, responsive drawers, and Lucide icons.                                                           |
| **Mock Network & DB Layer**       | In-Memory Server + `idb-keyval`       | Simulates real REST API with 150–500ms network latency, server-side pagination, sorting, filtering, debounced background IndexedDB persistence, and window unload flushing.                                                               |
| **Data Generation**               | `@faker-js/faker` in Web Worker       | Generates 50,000 deterministic domain records in a Web Worker (`mockDataGenerator.worker.ts`) to keep app initialization instant.                                                                                                         |

---

## 📦 Features & Assignment Requirement Coverage

- [x] **50,000 Mock Records Dataset:** High-cardinality e-commerce inventory data covering 49 fields across 7 domain categories (Identity, Inventory & Location, Pricing & Financial, Supplier Details, Physical & Lifecycle, Extra Attributes & Audit, Derived/Computed metrics).
- [x] **Wide Table (~10 to 60 Columns Configurable):** 49 configurable columns with pinned columns (SKU, Checkbox), column reordering, custom cell renderers (SKU navigation, stock status pills with live status indicators, returnable/fragile badges, Indian Rupee currency formatters `₹ INR`), and a persistent, toggleable **Column Manager Panel** saved to `localStorage`.
- [x] **Interactive Status Summary KPI Strip:** Real-time summary cards for stock status breakdown (_Total Inventory_, _Low Stock Alert_, _Healthy Stock_, _Overstock_, _Discontinued_) powered by `statusCardConfigs.ts`. Clicking cards updates table filters instantly.
- [x] **Search & Filter:** Global debounced search input (300ms), stock status quick-filter tabs, and column filter sheet. **All search and filter execution occurs on the server layer before pagination**, ensuring accuracy across the dataset.
- [x] **Add / Edit Record Form:** Multi-section drawer/page form powered by React Hook Form & Zod with live derived status calculation and optimistic cache update on submission. Fields feature standard red asterisk indicators (`<span className="text-rose-500 font-bold ml-0.5">*</span>`).
- [x] **Bulk CSV Upload Wizard:** Modular 3-step wizard (`UploadStep` → `ValidationPreviewStep` with AG Grid preview & downloadable error CSV → `CommitSummaryStep` progress indicator). Features instant query cache invalidation on commit without requiring a page refresh.
- [x] **Single & Bulk Delete:** Multi-select checkbox column with a floating action bar (`SelectionActionBar`), bulk delete modal confirmation (`DeleteConfirmDialog`), and single-item delete with a 5-second undo toast (`useUndoableAction`).
- [x] **Dynamic Import Code-Splitting:** Heavy components (`RecordForm`, `InventoryTable`, `FilterSheet`, `BulkImportDialog`, `ImportPreviewTable`) are loaded on-demand via `React.lazy()` and `<Suspense>`.

---

## 💡 Requirement-Specific Evaluative Written Questions

### 1. The decision I'm least sure about, and the alternative I rejected

- **The Decision:** Wiring TanStack Query server-side pagination with AG Grid Community using custom pagination control components instead of using AG Grid Enterprise's Server-Side Row Model (SSRM).
- **The Alternative Rejected:** Fetching all 50,000–100,000 records into client-side React state (`useState<InventoryRecord[]>`) and relying on AG Grid's client-side row model, or requiring a paid AG Grid Enterprise license.
- **Why I'm Least Sure & Defense:**
  AG Grid Community does not provide out-of-the-box server-side sorting/filtering UI toolbars unless configured with complex custom datasources or enterprise licenses. By pairing TanStack Query's paginated queries (`useInventoryRecordsQuery`) with a custom paginator bar, we guarantee a minimal memory footprint in React and mirror production API contracts. However, this required custom glue code for pagination and sorting callbacks rather than relying on AG Grid's native enterprise engine.

---

### 2. What breaks first at 10× the data (500k – 1M records), and what I'd do about it

- **What Breaks First:**
  1. **In-Memory Main-Thread Array Scans (`mockServer.ts`):** Filtering and sorting a 1,000,000-item JavaScript array using linear `Array.prototype.filter()` on the main thread will cause visible input lag / frame drops on search keystrokes.
  2. **IndexedDB Single-Key Storage Limits (`idb-keyval`):** Attempting to serialize/deserialize 1M JSON objects into a single IndexedDB key exceeds browser memory thresholds and causes startup delays.
  3. **CSV Parsing Memory Spikes:** Streamed rows pushed into React state for preview table rendering could overflow browser tab memory if 500k rows are held in memory simultaneously.

- **What I'd Do About It:**
  1. **Web Worker Database Engine:** Move the mock database layer entirely into a **Dedicated Web Worker** using **SQLite Wasm (`@sqlite.org/sqlite-wasm`)** or an IndexedDB worker query engine with indexed columns (`CREATE INDEX idx_sku ON inventory(sku)`).
  2. **Chunked CSV Processing:** Implement chunked batch insertion (5,000 rows per transaction) directly into the worker DB without holding parsed rows in React state.
  3. **Production Backend Migration:** Connect the application to a real backend database (PostgreSQL + Elasticsearch / PG TSVector) using database cursor pagination and server-side full-text search indexing.

---

### 3. What I'd build next with more time

1. **Saved Column Views & Layout Presets:** Allow users to create, save, and toggle between named column presets (e.g., _"Pricing View"_, _"Warehouse Audit View"_, _"Shipping Details"_).
2. **Multi-Row Batch Inline Cell Editing:** Enable inline cell editing directly in the grid with dirty-cell tracking and batch updates (e.g. select 100 rows → set warehouse location in bulk).
3. **Advanced Visual Filter Builder:** A multi-condition visual query builder supporting complex boolean expressions (`AND` / `OR` logic across date ranges, numeric bounds, and tag arrays).
4. **Streamed CSV / XLSX Export:** Export filtered or selected rows to downloadable CSV / Excel files using web workers.
5. **Real-Time Data Sync:** WebSocket / Server-Sent Events (SSE) integration for live inventory stock level updates with visual grid highlight flashes.

---

## 📂 Project Structure Overview

```
src/
  app/                     # App shell, router, providers (QueryClient, Toaster)
  components/
    data-table/            # Reusable AG Grid wrapper & custom pagination bar
    ui/                    # Design system primitives (button, input, select, modal, drawer, toast)
  features/
    inventory/
      api/                 # API interceptors, React Query hooks & query key factories
      components/          # InventoryTable, TableToolbar, BulkImportDialog, RecordForm, etc.
        bulk-import/       # Modular wizard step components (UploadStep, ValidationPreviewStep, etc.)
        form-sections/     # Form section tab components (ProductDetails, StockLocation, etc.)
      constants/           # Status card configs, filter options & default values
      hooks/               # Custom inventory hooks & scrollspy logic
      lib/                 # Zod schema, PapaParse streaming, MockServer & Web Worker generator
      store/               # Zustand table UI store (selection, search, filters, drawer state)
      types/               # TypeScript domain interfaces & API payload types
```
