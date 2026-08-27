# INDEX.md — Build Reference & Progress Tracker

Flat lookup table for every file this project needs, cross-referenced to the phase that creates
it (see SKILL.md) and the section of PROMPT.md that specifies it. Check items off as you verify
them at each phase checkpoint — don't check something off because the agent wrote the file; check
it off because you ran it and it does what section says.

## Data layer

| File | Phase | Spec (PROMPT.md §) | Verified? |
|---|---|---|---|
| `inventory.types.ts` | 1 | §2 | ☐ |
| `recordSchema.ts` | 1 | §2, §5 (reused by form + CSV) | ☐ |
| `mockDataGenerator.worker.ts` | 1 | §2 | ☐ |
| `mockServer.ts` | 1 | §4 | ☐ |
| `inventoryApi.ts` | 2 | §4 | ☐ |
| `inventoryKeys.ts` | 2 | §4 | ☐ |

## Query hooks

| Hook | Phase | Wraps | Verified? |
|---|---|---|---|
| `useInventoryList.ts` | 2 | `listRecords` | ☐ |
| `useCreateRecord.ts` | 2 | `createRecord` | ☐ |
| `useDeleteRecords.ts` | 2 | `deleteRecords` | ☐ |
| `useBulkImport.ts` | 2 | `bulkCreateRecords` | ☐ |

## UI state

| File | Phase | Holds | Verified? |
|---|---|---|---|
| `useTableUIStore.ts` (zustand) | 4 | selectedIds, filterText, columnVisibility | ☐ |
| `useDebouncedValue.ts` | 4 | generic debounce hook | ☐ |
| `useUndoableAction.ts` | 7 | generic undo-timer | ☐ |

## Grid

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `columnDefsFactory.ts` | 3 | §2 field groups → AG Grid colDefs | ☐ |
| `InventoryTable.tsx` | 3 | §5 | ☐ |
| `InventoryTable.columns.tsx` | 3 | §5 | ☐ |
| `ag-grid-theme.css` | 3, 8 | §1 (custom theme, not default) | ☐ |

## Toolbar / column management

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `TableToolbar.tsx` | 4 | §5 | ☐ |
| `ColumnManagerPanel.tsx` | 4 | §5 | ☐ |
| `SelectionActionBar.tsx` | 7 | §5 | ☐ |

## Add record

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `RecordForm.tsx` | 5 | §5 | ☐ |
| `AddRecordDialog.tsx` | 5 | §5 | ☐ |

## Bulk import

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `csvParser.ts` | 6 | §5 (streaming, not full-string parse) | ☐ |
| `BulkImportDialog.tsx` | 6 | §5 (3-step wizard) | ☐ |
| `ImportPreviewTable.tsx` | 6 | §5 | ☐ |
| `/public/sample-import.csv` | 6 | test fixture w/ bad rows | ☐ |

## Delete

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `DeleteConfirmDialog.tsx` | 7 | §5 (bulk only) | ☐ |

## Polish / states

| File | Phase | Spec | Verified? |
|---|---|---|---|
| `EmptyState.tsx` | 8 | §6 | ☐ |
| `TableSkeleton.tsx` | 8 | §6 | ☐ |

## API contract (implemented in `inventoryApi.ts`, backed by `mockServer.ts`)

| Endpoint | Params | Returns | Phase |
|---|---|---|---|
| `listRecords` | page, pageSize, sortBy?, sortDir?, search?, filters? | `{ rows, totalCount }` | 1–2 |
| `getRecord` | id | `InventoryRecord` | 1–2 |
| `createRecord` | NewInventoryRecord | `InventoryRecord` | 1–2, 5 |
| `updateRecord` | id, Partial\<InventoryRecord\> | `InventoryRecord` | 1–2 |
| `deleteRecords` | ids: string[] | `{ deletedIds }` | 1–2, 7 |
| `bulkCreateRecords` | NewInventoryRecord[] | `{ created, rejected }` | 1–2, 6 |

## Docs

| File | Phase | Content |
|---|---|---|
| `README.md` | 9 | least-sure decision, breaks-at-10x, next-with-more-time |
| `prompt.md` | 9 | every prompt sent this session, verbatim, honest AI-usage notes |

## Cross-cutting checks (run once at the end, not per-phase)

- ☐ No component holds the full dataset in `useState`
- ☐ Every mutation updates the TanStack Query cache (optimistic or invalidation) — no manual full refetch
- ☐ Search/filter inputs are debounced
- ☐ CSV parsing is streaming, not `readAsText` + split
- ☐ Selection/filter state lives in Zustand, not React Query
- ☐ AG Grid uses server-side/infinite row model, not client-side, for the main table
- ☐ Grid scroll is smooth at 50k+ rows, both directions
- ☐ Every async state (loading/empty/error/populated) has a distinct, designed UI
