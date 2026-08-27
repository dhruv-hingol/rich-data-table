// Streaming CSV parser utility leveraging PapaParse and Zod record validation schema.
import Papa from 'papaparse';
import { recordSchema } from './recordSchema';
import type { InventoryRecord } from '../types/inventory.types';

export interface ParseResult {
  validRows: Partial<InventoryRecord>[];
  invalidRows: { rowNumber: number; raw: any; errors: string[] }[];
  totalParsed: number;
}

export function parseCSVStream(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const validRows: Partial<InventoryRecord>[] = [];
    const invalidRows: { rowNumber: number; raw: any; errors: string[] }[] = [];
    let rowNumber = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: (results) => {
        rowNumber++;
        const raw = results.data as any;
        const parseResult = recordSchema.safeParse(raw);

        if (parseResult.success) {
          validRows.push(parseResult.data as any);
        } else {
          const errors = parseResult.error.issues.map(
            (issue) => `${issue.path.join('.')}: ${issue.message}`
          );
          invalidRows.push({ rowNumber, raw, errors });
        }
      },
      complete: () => {
        resolve({
          validRows,
          invalidRows,
          totalParsed: rowNumber,
        });
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}
