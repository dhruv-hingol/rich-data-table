import { faker } from '@faker-js/faker';
import type { InventoryRecord, StockStatus } from '../types/inventory.types';

const CATEGORIES = [
  { name: 'Electronics', subs: ['Sensors', 'Microcontrollers', 'Cables', 'Power Supply', 'Connectors'] },
  { name: 'Industrial Hardware', subs: ['Fasteners', 'Bearings', 'Pumps', 'Valves', 'Pipes'] },
  { name: 'Safety Equipment', subs: ['PPE', 'Fire Extinguishers', 'First Aid', 'Signage', 'Harnesses'] },
  { name: 'Packaging Materials', subs: ['Boxes', 'Tape', 'Bubble Wrap', 'Pallets', 'Labels'] },
  { name: 'Tools & Machinery', subs: ['Hand Tools', 'Power Tools', 'Pneumatics', 'Measuring', 'Cutting'] },
  { name: 'Chemicals & Lubricants', subs: ['Solvents', 'Oils', 'Adhesives', 'Cleaners', 'Grease'] },
];

const WAREHOUSES = ['WH-NORTH-01', 'WH-SOUTH-02', 'WH-EAST-05', 'WH-WEST-09', 'WH-CENTRAL-MAIN'];
const PRICE_TIERS = ['Standard', 'Wholesale', 'VIP', 'Clearance'] as const;

export function generateMockRecord(index: number): InventoryRecord {
  const catObj = faker.helpers.arrayElement(CATEGORIES);
  const category = catObj.name;
  const subcategory = faker.helpers.arrayElement(catObj.subs);
  const qtyOnHand = faker.number.int({ min: 0, max: 2500 });
  const qtyReserved = faker.number.int({ min: 0, max: Math.min(qtyOnHand, 400) });
  const reorderPoint = faker.number.int({ min: 50, max: 300 });

  let status: StockStatus = 'HEALTHY';
  if (qtyOnHand === 0 || qtyOnHand <= reorderPoint) {
    status = 'LOW_STOCK';
  } else if (qtyOnHand > 1800) {
    status = 'OVERSTOCK';
  } else if (faker.number.int({ min: 1, max: 100 }) > 95) {
    status = 'DISCONTINUED';
  }

  const unitCost = Number(faker.commerce.price({ min: 2, max: 800, dec: 2 }));
  const markupMultiplier = faker.number.float({ min: 1.2, max: 2.2 });
  const listPrice = Number((unitCost * markupMultiplier).toFixed(2));
  const salePrice = faker.datatype.boolean(0.3)
    ? Number((listPrice * faker.number.float({ min: 0.8, max: 0.95 })).toFixed(2))
    : listPrice;

  const sku = `SKU-${faker.string.alphanumeric({ length: 3, casing: 'upper' })}-${faker.string.numeric(5)}`;
  const name = `${faker.company.name()} ${faker.commerce.productName()}`;
  const barcode = faker.string.numeric(12);
  const warehouse = faker.helpers.arrayElement(WAREHOUSES);

  const qtyAvailable = qtyOnHand - qtyReserved;
  const marginPercent = Number((((listPrice - unitCost) / listPrice) * 100).toFixed(1));
  const totalStockValue = Number((qtyOnHand * unitCost).toFixed(2));
  const daysOfSupply = Math.max(1, Math.round(qtyOnHand / faker.number.int({ min: 5, max: 40 })));

  return {
    id: `rec_${index + 1}_${faker.string.alphanumeric(8)}`,
    sku,
    name,
    barcode,
    category,
    subcategory,
    brand: faker.company.name(),
    tags: [category.toLowerCase(), subcategory.toLowerCase(), warehouse.toLowerCase()],
    variant: faker.helpers.arrayElement(['Standard', 'Heavy Duty', 'Compact', 'Pro', 'Enterprise']),
    unit: faker.helpers.arrayElement(['pcs', 'box', 'kg', 'm', 'set', 'roll']),

    warehouse,
    qtyOnHand,
    qtyReserved,
    qtyAvailable,
    reorderPoint,
    reorderQty: faker.number.int({ min: 20, max: 500 }),
    binLocation: `${faker.string.alpha({ length: 1, casing: 'upper' })}-${faker.number.int({ min: 1, max: 40 })}-${faker.number.int({ min: 1, max: 10 })}`,

    unitCost,
    listPrice,
    salePrice,
    marginPercent,
    taxRate: faker.helpers.arrayElement([0, 5, 12, 18]),
    discountPercent: salePrice < listPrice ? Number((((listPrice - salePrice) / listPrice) * 100).toFixed(1)) : 0,
    priceTier: faker.helpers.arrayElement(PRICE_TIERS),

    supplierId: `SUP-${faker.string.numeric(4)}`,
    supplierName: `${faker.company.name()} Supplies Ltd`,
    supplierSku: `SUP-SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
    leadTimeDays: faker.number.int({ min: 2, max: 30 }),
    minOrderQty: faker.number.int({ min: 10, max: 100 }),
    lastPurchaseDate: faker.date.recent({ days: 120 }).toISOString().split('T')[0],

    status,
    isPerishable: faker.datatype.boolean(0.15),
    expiryDate: faker.datatype.boolean(0.15) ? faker.date.future({ years: 1 }).toISOString().split('T')[0] : null,
    weightKg: Number(faker.number.float({ min: 0.1, max: 45, fractionDigits: 2 })),
    dimensionsCm: `${faker.number.int({ min: 5, max: 100 })}x${faker.number.int({ min: 5, max: 80 })}x${faker.number.int({ min: 2, max: 50 })}`,
    isFragile: faker.datatype.boolean(0.1),
    hazardClass: faker.helpers.arrayElement(['None', 'Class 3 Flammable', 'Class 8 Corrosive', 'None', 'None']),

    bayNumber: `B-${faker.number.int({ min: 1, max: 50 })}`,
    shelfNumber: `S-${faker.number.int({ min: 1, max: 10 })}`,
    countryOfOrigin: faker.helpers.arrayElement(['USA', 'Germany', 'Japan', 'China', 'Taiwan', 'Mexico']),
    hsCode: `${faker.string.numeric(4)}.${faker.string.numeric(2)}.${faker.string.numeric(2)}`,
    warrantyMonths: faker.helpers.arrayElement([0, 6, 12, 24, 36]),
    packageType: faker.helpers.arrayElement(['Box', 'Crate', 'Pallet', 'Bag', 'Drum']),
    handlingInstructions: faker.helpers.arrayElement(['Store dry', 'Keep upright', 'Handle with care', 'Temperature controlled', 'Standard handling']),
    isReturnable: faker.datatype.boolean(0.85),
    minStorageTempC: faker.number.int({ min: -20, max: 10 }),
    maxStorageTempC: faker.number.int({ min: 25, max: 50 }),

    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    createdBy: faker.person.fullName(),
    updatedBy: faker.person.fullName(),
    lastSoldAt: faker.date.recent({ days: 60 }).toISOString(),
    syncStatus: faker.helpers.arrayElement(['Synced', 'Synced', 'Synced', 'Pending']),

    totalStockValue,
    daysOfSupply,
    isLowStock: qtyOnHand <= reorderPoint,
  };
}

if (typeof self !== 'undefined' && 'addEventListener' in self) {
  self.addEventListener('message', (e: MessageEvent) => {
    if (e.data?.type === 'GENERATE_MOCK_DATA') {
      const count = e.data.count || 50000;
      const records: InventoryRecord[] = new Array(count);
      for (let i = 0; i < count; i++) {
        records[i] = generateMockRecord(i);
      }
      self.postMessage({ type: 'MOCK_DATA_GENERATED', records });
    }
  });
}
