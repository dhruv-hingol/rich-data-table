// Inventory Filter & Form Options Constants single source of truth.
import type { SelectOption } from '../../../components/ui/select';

export const WAREHOUSE_OPTIONS: SelectOption[] = [
  { label: 'Select warehouse', value: 'ALL' },
  { label: 'WH-NORTH-01', value: 'WH-NORTH-01' },
  { label: 'WH-SOUTH-02', value: 'WH-SOUTH-02' },
  { label: 'WH-EAST-05', value: 'WH-EAST-05' },
  { label: 'WH-WEST-09', value: 'WH-WEST-09' },
  { label: 'WH-CENTRAL-MAIN', value: 'WH-CENTRAL-MAIN' },
];

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Select category', value: 'ALL' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Industrial Hardware', value: 'Industrial Hardware' },
  { label: 'Safety Equipment', value: 'Safety Equipment' },
  { label: 'Packaging Materials', value: 'Packaging Materials' },
];

export const FORM_CATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Industrial Hardware', value: 'Industrial Hardware' },
  { label: 'Safety Equipment', value: 'Safety Equipment' },
  { label: 'Packaging Materials', value: 'Packaging Materials' },
];

export const FORM_WAREHOUSE_OPTIONS: SelectOption[] = [
  { label: 'WH-NORTH-01', value: 'WH-NORTH-01' },
  { label: 'WH-SOUTH-02', value: 'WH-SOUTH-02' },
  { label: 'WH-EAST-05', value: 'WH-EAST-05' },
  { label: 'WH-WEST-09', value: 'WH-WEST-09' },
];

export const SUBCATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Select sub category', value: 'ALL' },
  { label: 'Sensors', value: 'Sensors' },
  { label: 'Microcontrollers', value: 'Microcontrollers' },
  { label: 'Bearings', value: 'Bearings' },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { label: 'Select stock status', value: 'ALL' },
  { label: 'Low Stock Alert', value: 'LOW_STOCK' },
  { label: 'Healthy Stock', value: 'HEALTHY' },
  { label: 'Overstock', value: 'OVERSTOCK' },
  { label: 'Discontinued', value: 'DISCONTINUED' },
];

export const SKU_OPTIONS: SelectOption[] = [
  { label: 'Select SKU', value: 'ALL' },
  { label: 'SKU-OK-115', value: 'SKU-OK-115' },
  { label: 'SKU-LOW-102', value: 'SKU-LOW-102' },
  { label: 'SKU-OVER-201', value: 'SKU-OVER-201' },
  { label: 'SKU-DISC-305', value: 'SKU-DISC-305' },
  { label: 'SKU-W-901-4401', value: 'SKU-W-901-4401' },
  { label: 'SKU-W-450-8820', value: 'SKU-W-450-8820' },
];

export const LOCATION_DISABLED_OPTIONS: SelectOption[] = [
  { label: 'Select warehouse first', value: 'NONE' },
];
