"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import type { StationeryItem, RetrievalOrder } from "../page";

interface RetrievalOrderFormProps {
  type: "retrieval" | "order";
  userEmail: string;
  stationeryItems: StationeryItem[];
  onSubmit: (order: Omit<RetrievalOrder, "id" | "date" | "status">) => void;
}

export default function RetrievalOrderForm({
  type,
  userEmail,
  stationeryItems,
  onSubmit,
}: RetrievalOrderFormProps) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const selectedItem = stationeryItems.find(
    (item) => item.id === selectedItemId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!selectedItemId) {
      toast.error("Item Required", {
        description: "Please select a stationery item",
      });
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error("Quantity Required", {
        description: "Please enter a valid quantity",
      });
      return;
    }

    if (!notes.trim()) {
      toast.error("Notes Required", {
        description: "Please provide notes for this " + type,
      });
      return;
    }

    const quantityNum = parseFloat(quantity);

    // Check if quantity exceeds available stock for retrievals
    if (type === "retrieval" && selectedItem) {
      if (quantityNum > selectedItem.availableStock) {
        toast.error("Insufficient Stock", {
          description: `Only ${selectedItem.availableStock} ${selectedItem.unit} available. Cannot retrieve ${quantityNum} ${selectedItem.unit}.`,
        });
        return;
      }
    }

    // Submit the form
    onSubmit({
      type,
      userEmail,
      itemId: selectedItemId,
      itemName: selectedItem?.name || "",
      quantity: quantityNum,
      notes: notes.trim(),
    });

    toast.success(
      type === "retrieval" ? "Retrieval Submitted" : "Order Submitted",
      {
        description: `Successfully submitted ${type} for ${selectedItem?.name}`,
      },
    );

    // Reset form
    setSelectedItemId("");
    setQuantity("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="item" className="text-sm font-medium">
          Select Item <span className="text-red-500">*</span>
        </Label>
        <Select value={selectedItemId} onValueChange={setSelectedItemId}>
          <SelectTrigger id="item" className="bg-gray-50">
            <SelectValue placeholder="Choose a stationery item" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            {stationeryItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} - {item.availableStock} {item.unit} available
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedItem && (
          <p className="text-sm text-gray-600">
            Available:{" "}
            <span className="font-semibold text-orange-600">
              {selectedItem.availableStock}
            </span>{" "}
            {selectedItem.unit} | Category:{" "}
            <span className="font-semibold">{selectedItem.category}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium">
          Quantity <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          className="bg-gray-50"
          required
        />
        {type === "retrieval" &&
          selectedItem &&
          quantity &&
          parseFloat(quantity) > selectedItem.availableStock && (
            <p className="text-sm text-red-600 font-medium">
              ⚠️ Quantity exceeds available stock ({selectedItem.availableStock}{" "}
              {selectedItem.unit})
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={`Enter purpose or notes for this ${type}...`}
          className="bg-gray-50 min-h-[100px]"
          required
        />
        <p className="text-xs text-gray-500">
          Please provide a reason or description for this {type}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
      >
        Submit {type === "retrieval" ? "Retrieval" : "Order"}
      </Button>
    </form>
  );
}
