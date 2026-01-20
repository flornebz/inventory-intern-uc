'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface Props {
  onAddItem: (item: {
    name: string;
    category: 'OP Stock' | 'OP Non-Stock';
    totalStock: number;
    availableStock: number;
    unit: string;
  }) => Promise<void>;
}

export default function AddStationeryForm({ onAddItem }: Props) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'OP Stock' | 'OP Non-Stock'>('OP Stock');
  const [totalStock, setTotalStock] = useState(0);
  const [availableStock, setAvailableStock] = useState(0);
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInvalid =
    !name ||
    !unit ||
    totalStock < 0 ||
    availableStock < 0 ||
    availableStock > totalStock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !unit) {
      setError('Item name and unit are required');
      return;
    }

    if (availableStock > totalStock) {
      setError('Available stock cannot exceed total stock');
      return;
    }

    try {
      setLoading(true);

      await onAddItem({
        name,
        category,
        totalStock,
        availableStock,
        unit,
      });

      // reset form & close
      setName('');
      setCategory('OP Stock');
      setTotalStock(0);
      setAvailableStock(0);
      setUnit('');
      setOpen(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      {/* Header clickable */}
      <CardHeader
        className="cursor-pointer select-none flex flex-row items-center justify-between"
        onClick={() => setOpen(prev => !prev)}
      >
        <CardTitle>Add New Stationery Item</CardTitle>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </CardHeader>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1">Item Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={category}
                onChange={e =>
                  setCategory(e.target.value as 'OP Stock' | 'OP Non-Stock')
                }
              >
                <option value="OP Stock">OP Stock</option>
                <option value="OP Non-Stock">OP Non-Stock</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Total Stock</label>
                <Input
                  type="number"
                  min={0}
                  value={totalStock}
                  onChange={e => setTotalStock(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Available Stock</label>
                <Input
                  type="number"
                  min={0}
                  value={availableStock}
                  onChange={e => setAvailableStock(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <Input value={unit} onChange={e => setUnit(e.target.value)} />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" disabled={loading || isInvalid}>
              {loading ? 'Saving...' : 'Add Item'}
            </Button>
          </form>
        </CardContent>
      </div>
    </Card>
  );
}
