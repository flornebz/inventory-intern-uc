'use client';

import { useState } from 'react';
import { Pencil, Check, X, Package } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { toast } from 'sonner';
import type { StationeryItem } from '../page';

interface InventoryManagementProps {
  stationeryItems: StationeryItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
}

export default function InventoryManagement({
  stationeryItems,
  onUpdateStock,
}: InventoryManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  /* =======================
     HANDLERS
  ======================= */
  const handleEdit = (item: StationeryItem) => {
    setEditingId(item.id);
    setEditValue(item.availableStock.toString());
  };

  const handleSave = (item: StationeryItem) => {
    const newStock = parseFloat(editValue);

    if (isNaN(newStock) || newStock < 0) {
      toast.error('Invalid Stock Value', {
        description: 'Please enter a valid positive number',
      });
      return;
    }

    if (newStock > item.totalStock) {
      toast.error('Stock Exceeds Total', {
        description: `Available stock cannot exceed total stock (${item.totalStock})`,
      });
      return;
    }

    onUpdateStock(item.id, newStock);
    toast.success('Stock Updated', {
      description: `${item.name} stock updated to ${newStock} ${item.unit}`,
    });

    setEditingId(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  /* =======================
     DATA SPLIT
  ======================= */
  const opStockItems = stationeryItems.filter(
    (item) => item.category === 'OP Stock'
  );

  const opNonStockItems = stationeryItems.filter(
    (item) => item.category === 'OP Non-Stock'
  );

  /* =======================
     ROW RENDERERS
  ======================= */
  const renderActions = (item: StationeryItem) => {
    const isEditing = editingId === item.id;

    return isEditing ? (
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          onClick={() => handleSave(item)}
          className="h-8 w-8 p-0 bg-green-500"
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    ) : (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleEdit(item)}
        className="h-8 px-3"
      >
        <Pencil className="w-3 h-3 mr-1" />
        Edit
      </Button>
    );
  };

  const renderStockCell = (item: StationeryItem) => {
    const isEditing = editingId === item.id;
    const percentAvailable =
      (item.availableStock / item.totalStock) * 100;

    if (isEditing) {
      return (
        <Input
          type="number"
          min="0"
          max={item.totalStock}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-24 h-8 text-right"
          autoFocus
        />
      );
    }

    return (
      <span
        className={`font-semibold ${
          percentAvailable < 20
            ? 'text-red-600'
            : percentAvailable < 50
              ? 'text-orange-600'
              : 'text-green-600'
        }`}
      >
        {item.availableStock}
      </span>
    );
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="space-y-6">
      {/* INFO */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Package className="w-5 h-5 text-blue-600" />
        <p className="text-sm text-blue-900">
          Click edit to update available stock. Available stock cannot exceed total stock.
        </p>
      </div>

      {/* ================= OP STOCK ================= */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <h3 className="px-4 py-2 font-semibold text-blue-800 bg-blue-50">
          OP Stock
        </h3>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Item Name</TableHead>
              <TableHead className="text-right">Total Stock</TableHead>
              <TableHead className="text-right">Available Stock</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {opStockItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Tidak ada data OP Stock
                </TableCell>
              </TableRow>
            ) : (
              opStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.totalStock}</TableCell>
                  <TableCell className="text-right">
                    {renderStockCell(item)}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-center">
                    {renderActions(item)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ================= OP NON-STOCK ================= */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <h3 className="px-4 py-2 font-semibold text-purple-800 bg-purple-50">
          OP Non-Stock
        </h3>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Item Name</TableHead>
              <TableHead>Merek</TableHead>
              <TableHead className="text-right">Total Stock</TableHead>
              <TableHead className="text-right">Available Stock</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {opNonStockItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Tidak ada data OP Non-Stock
                </TableCell>
              </TableRow>
            ) : (
              opNonStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.brand ?? '-'}</TableCell>
                  <TableCell className="text-right">{item.totalStock}</TableCell>
                  <TableCell className="text-right">
                    {renderStockCell(item)}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-center">
                    {renderActions(item)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
