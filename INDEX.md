# INDEX.md — Build Reference & Progress Tracker

Flat lookup table for every file this project needs, cross-referenced to the phase that creates
it (see SKILL.md) and the section of PROMPT.md that specifies it. Check items off as you verify
them at each phase checkpoint — don't check something off because the agent wrote the file; check
it off because you ran it and it does what section says.

## Data layer & Constants

| File | Phase | Spec (PROMPT.md §) | Verified? |
|---|---|---|---|
| `inventory.types.ts` | 1 | §2 | ☑ |
| `recordSchema.ts` | 1 | §2, §5 (reused by form + CSV) | ☑ |
| `mockDataGenerator.worker.ts` | 1 | §2 | ☑ |
| `mockServer.ts` | 1 | §4 | ☑ |
| `inventoryApi.ts` | 2 | §4 | ☑ |
| `apiInterceptor.ts` | 2 | §4 | ☑ |
| `inventoryKeys.ts` | 2 | §4 | ☑ |
| `statusCardConfigs.ts` | 4 | §5 (KPI status summary cards) | ☑ |
| `filterOptions.ts` | 4 | §5 | ☑ |

## Query hooks & Mutations

| Hook | Phase | Wraps | Verified? |
|---|---|---|---|
| `useInventoryQuery.ts` | 2 | `listRecords`, `getRecord`, `getUniqueSkus`, `getUniqueCategories` | ☑ |
| `useInventoryMutations.ts` | 2 | `createRecord`, `updateRecord`, `deleteRecords`, `bulkCreateRecords` | ☑ |

## UI state & Custom Hooks

| File | Phase | Holds | Verified? |
|---|---|---|---|
| `useTableUIStore.ts` (zustand) | 4 | selectedIds, search, statusFilter, filterDrafts, visibleColumns | ☑ |
| `useDebouncedValue.ts` | 4 | generic debounce hook | ☑ |
| `useTabScrollSpy.ts` | 5 | scrollspy active tab tracking for form sections | ☑ |
| `useUndoableAction.ts` | 7 | generic undo-timer | ☑ |

## Grid

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `columnDefsFactory.tsx` | 3 | §2 field groups → AG Grid colDefs | ☑ |
| `InventoryTable.tsx` | 3 | §5 (dynamic import + theme="legacy") | ☑ |
| `ag-grid-theme.css` | 3, 8 | §1 (custom theme, CSS variables) | ☑ |
| `index.tsx` (data-table wrapper) | 3 | §1 (AgGridTable reusable wrapper) | ☑ |

## Toolbar / Column Management / Status Summary

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `TableToolbar.tsx` | 4 | §5 (search, buttons, add/import trigger) | ☑ |
| `ColumnManagerPanel.tsx` | 4 | §5 (preset buttons, checkbox list, localStorage) | ☑ |
| `StatusSummaryStrip.tsx` | 4 | §5 (KPI status cards w/ active state) | ☑ |
| `AppliedFiltersBar.tsx` | 4 | §5 (active filter badge chips) | ☑ |
| `SelectionActionBar.tsx` | 7 | §5 (floating bar for selected rows) | ☑ |

## Add / Edit Record Form

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `InventoryFormPage.tsx` | 5 | §5 (lazy loaded page container) | ☑ |
| `RecordForm.tsx` | 5 | §5 (6-section tabbed form container) | ☑ |
| `RecordFormSkeleton.tsx` | 5 | §5 | ☑ |
| `ProductDetailsSection.tsx` | 5 | §5 (form section w/ red asterisk asterisks) | ☑ |
| `StockLocationSection.tsx` | 5 | §5 (form section) | ☑ |
| `PricingFinancialSection.tsx` | 5 | §5 (form section) | ☑ |
| `SupplierInfoSection.tsx` | 5 | §5 (form section) | ☑ |
| `PhysicalSpecsSection.tsx` | 5 | §5 (form section) | ☑ |

## Bulk import

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `csvParser.ts` | 6 | §5 (streaming PapaParse) | ☑ |
| `BulkImportDialog.tsx` | 6 | §5 (3-step wizard w/ switch-case dispatch) | ☑ |
| `ImportWizardSteps.tsx` | 6 | §5 (step progress indicator header) | ☑ |
| `UploadStep.tsx` | 6 | §5 (Step 1 dropzone) | ☑ |
| `ValidationPreviewStep.tsx` | 6 | §5 (Step 2 preview with Lucide icons) | ☑ |
| `CommitSummaryStep.tsx` | 6 | §5 (Step 3 commit summary) | ☑ |
| `ImportPreviewTable.tsx` | 6 | §5 (AG Grid validation preview w/ theme="legacy") | ☑ |
| `/public/sample-import.csv` | 6 | test fixture w/ bad rows | ☑ |

## Delete & Dialogs

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `DeleteConfirmDialog.tsx` | 7 | §5 (bulk delete confirmation) | ☑ |
| `FilterSheet.tsx` | 4 | §5 (slide-over filter drawer) | ☑ |

## Polish & UI Components

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `EmptyState.tsx` | 8 | §6 | ☑ |
| `TableSkeleton.tsx` | 8 | §6 | ☑ |
| `button.tsx`, `input.tsx`, `select.tsx`, `modal.tsx`, `confirmation-modal.tsx`, `drawer.tsx`, `toast.tsx`, `badge.tsx`, `checkbox.tsx` | 8 | §1 (primitives with red asterisk support) | ☑ |

## API Contract (implemented in `inventoryApi.ts`, backed by `mockServer.ts`)

| Endpoint | Params | Returns | Phase |
|---|---|---|---|
| `listRecords` | page, pageSize, search?, statusFilter? | `PaginatedResponse<InventoryRecord>` | 1–2 |
| `getRecord` | id | `InventoryRecord` | 1–2 |
| `createRecord` | CreateInventoryRecordPayload | `InventoryRecord` | 1–2, 5 |
| `updateRecord` | id, UpdateInventoryRecordPayload | `InventoryRecord` | 1–2 |
| `deleteRecords` | ids: string[] | `{ deletedIds: string[] }` | 1–2, 7 |
| `bulkCreateRecords` | Partial<InventoryRecord>[] | `{ created: InventoryRecord[]; rejected: [...] }` | 1–2, 6 |

## Docs & Architecture

| File | Phase | Content |
|---|---|---|
| `README.md` | 9 | Tech stack defense, 10x scalability, path aliases, lazy loading | ☑ |
| `PROMPT.md` | 9 | Master prompt, folder structure, AI interaction & workflow report | ☑ |
| `INDEX.md` | 9 | File reference table & progress tracker | ☑ |
| `SKILL.md` | 9 | Agent workflow guide & build phase checkpoints | ☑ |

## Cross-cutting checks (Verified Clean)

- ☑ No component holds the full dataset in `useState`
- ☑ Every mutation updates or invalidates the TanStack Query cache (`inventoryKeys.all`) — no manual full-page reload required
- ☑ Search and filter inputs are debounced (300ms)
- ☑ CSV parsing is streaming (`Papa.parse(file, { step: ... })`), zero main thread blocking
- ☑ Selection and filter state lives in Zustand (`useTableUIStore`), not React Query
- ☑ AG Grid uses `theme="legacy"` mode to prevent AG Grid v33 Error #239
- ☑ Code splitting and dynamic imports (`React.lazy` + `Suspense`) applied to routes, dialogs, and step views
- ☑ Clean `@/src` path aliases configured across TypeScript and Vite
- ☑ Form primitives (`Input`, `Select`) dynamically render red asterisk indicators (`*`) for required fields
- ☑ Production build passes cleanly with 0 TypeScript/Vite errors (`npm run build`)

