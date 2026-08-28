// Inventory Filter Options Constants single source of truth.
import type { SelectOption } from '../../../components/ui/select';

export const WAREHOUSE_OPTIONS: SelectOption[] = [
  { label: 'Select warehouse', value: 'ALL' },
  { label: 'WH-NORTH-01', value: 'WH-NORTH-01' },
  { label: 'WH-SOUTH-02', value: 'WH-SOUTH-02' },
  { label: 'WH-EAST-05', value: 'WH-EAST-05' },
  { label: 'WH-WEST-09', value: 'WH-WEST-09' },
];

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Select category', value: 'ALL' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Industrial Hardware', value: 'Industrial Hardware' },
  { label: 'Safety Equipment', value: 'Safety Equipment' },
  { label: 'Packaging Materials', value: 'Packaging Materials' },
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

export const LOCATION_DISABLED_OPTIONS: SelectOption[] = [
  { label: 'Select warehouse first', value: 'NONE' },
];
