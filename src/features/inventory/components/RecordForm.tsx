// Tabbed collapsible form layout powered by React Hook Form and Zod record validation schema.
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { recordSchema, type RecordSchemaInput } from '../lib/recordSchema';
import { inventoryApi } from '../api/inventoryApi';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import type { StockStatus } from '../types/inventory.types';

export function RecordForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RecordSchemaInput>({
    resolver: zodResolver(recordSchema) as any,
    defaultValues: {
      sku: `SKU-W-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      category: 'Electronics',
      subcategory: 'Sensors',
      brand: 'ApexGear',
      tags: ['electronics', 'warehouse'],
      variant: 'Standard',
      unit: 'pcs',
      warehouse: 'WH-NORTH-01',
      qtyOnHand: 150,
      qtyReserved: 10,
      reorderPoint: 50,
      reorderQty: 200,
      binLocation: 'A-12-04',
      unitCost: 15.5,
      listPrice: 32.0,
      salePrice: 32.0,
      taxRate: 0,
      discountPercent: 0,
      priceTier: 'Standard',
      supplierId: 'SUP-901',
      supplierName: 'Apex Precision Logistics',
      supplierSku: 'SUP-SKU-901',
      leadTimeDays: 7,
      minOrderQty: 10,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
      status: 'HEALTHY',
      isPerishable: false,
      weightKg: 1.2,
      dimensionsCm: '20x15x10',
      isFragile: false,
      hazardClass: 'None',
      bayNumber: 'B-12',
      shelfNumber: 'S-04',
      countryOfOrigin: 'USA',
      hsCode: '8544.42.20',
      warrantyMonths: 12,
      packageType: 'Box',
      handlingInstructions: 'Standard handling',
      isReturnable: true,
      minStorageTempC: -10,
      maxStorageTempC: 40,
    },
  });

  const watchQtyOnHand = watch('qtyOnHand') || 0;
  const watchReorderPoint = watch('reorderPoint') || 0;

  // Live status preview badge computation
  const liveStatus: StockStatus = React.useMemo(() => {
    if (watchQtyOnHand === 0 || watchQtyOnHand <= watchReorderPoint) {
      return 'LOW_STOCK';
    }
    if (watchQtyOnHand > 1000) {
      return 'OVERSTOCK';
    }
    return 'HEALTHY';
  }, [watchQtyOnHand, watchReorderPoint]);

  const onSubmit = async (data: RecordSchemaInput) => {
    setIsSubmitting(true);
    try {
      await inventoryApi.createRecord({
        ...data,
        status: liveStatus,
      } as any);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      console.error('Create record error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Live Status Preview Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase text-slate-500">Live Stock Status Preview:</span>
          {liveStatus === 'LOW_STOCK' && <Badge variant="low">Low Stock Alert</Badge>}
          {liveStatus === 'HEALTHY' && <Badge variant="healthy">Healthy Stock</Badge>}
          {liveStatus === 'OVERSTOCK' && <Badge variant="overstock">Overstock</Badge>}
        </div>
        {submitSuccess && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-pulse">
            ✓ Record Created Successfully! Redirecting...
          </span>
        )}
      </div>

      {/* Section 1: Product Identity & Classification */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#ff6600] pb-1 border-b border-slate-100">
          1. Product Identity & Classification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">SKU *</label>
            <Input {...register('sku')} error={!!errors.sku} />
            {errors.sku && <p className="text-[11px] text-rose-500 mt-1">{errors.sku.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
            <Input {...register('name')} error={!!errors.name} placeholder="e.g. Barcode Labels" />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Barcode *</label>
            <Input {...register('barcode')} error={!!errors.barcode} />
            {errors.barcode && <p className="text-[11px] text-rose-500 mt-1">{errors.barcode.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
            <Select {...register('category')}>
              <option value="Electronics">Electronics</option>
              <option value="Industrial Hardware">Industrial Hardware</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Packaging Materials">Packaging Materials</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subcategory</label>
            <Input {...register('subcategory')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
            <Input {...register('brand')} />
          </div>
        </div>
      </div>

      {/* Section 2: Stock Levels & Warehouse Location */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#ff6600] pb-1 border-b border-slate-100">
          2. Inventory Stock & Bin Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Warehouse *</label>
            <Select {...register('warehouse')}>
              <option value="WH-NORTH-01">WH-NORTH-01</option>
              <option value="WH-SOUTH-02">WH-SOUTH-02</option>
              <option value="WH-EAST-05">WH-EAST-05</option>
              <option value="WH-WEST-09">WH-WEST-09</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Qty On Hand *</label>
            <Input type="number" {...register('qtyOnHand')} error={!!errors.qtyOnHand} />
            {errors.qtyOnHand && <p className="text-[11px] text-rose-500 mt-1">{errors.qtyOnHand.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Qty Reserved</label>
            <Input type="number" {...register('qtyReserved')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reorder Point *</label>
            <Input type="number" {...register('reorderPoint')} error={!!errors.reorderPoint} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reorder Qty</label>
            <Input type="number" {...register('reorderQty')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bin Location *</label>
            <Input {...register('binLocation')} placeholder="e.g. A-12-04" />
          </div>
        </div>
      </div>

      {/* Section 3: Pricing & Supplier */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#ff6600] pb-1 border-b border-slate-100">
          3. Pricing & Supplier Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Cost ($) *</label>
            <Input type="number" step="0.01" {...register('unitCost')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">List Price ($) *</label>
            <Input type="number" step="0.01" {...register('listPrice')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Name *</label>
            <Input {...register('supplierName')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Time (Days)</label>
            <Input type="number" {...register('leadTimeDays')} />
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting} className="bg-[#ff6600]">
          {isSubmitting ? 'Creating Record...' : 'Create Inventory Record'}
        </Button>
      </div>
    </form>
  );
}
