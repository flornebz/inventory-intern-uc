"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
import { Card } from "@/app/components/ui/card";
import { toast } from "sonner";
import type { StationeryItem, MissingReport } from "../page";

interface MissingReportFormProps {
  stationeryItems: StationeryItem[];
  reportedBy: string;

  onSubmit: (
    report: Omit<MissingReport, "id" | "date">
  ) => Promise<void>;

  missingReports: MissingReport[];
}


export default function MissingReportForm({
  stationeryItems,
  reportedBy,
  onSubmit,
  missingReports,
}: MissingReportFormProps) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const selectedItem = stationeryItems.find(
    (item) => item.id === selectedItemId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

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
      description: "Please provide notes about the missing item",
    });
    return;
  }

  try {
    await onSubmit({
      itemId: selectedItemId,
      itemName: selectedItem?.name || "",
      reportedBy,
      quantity: parseFloat(quantity),
      notes: notes.trim(),
    });

    toast.success("Report Submitted", {
      description: `Missing item report for ${selectedItem?.name} has been submitted`,
    });

    // Reset form
    setSelectedItemId("");
    setQuantity("");
    setNotes("");
  } catch (err: any) {
    toast.error("Failed to submit report", {
      description: err?.message ?? "Unknown error occurred",
    });
  }
};


  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="missing-item" className="text-sm font-medium">
            Select Missing Item <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedItemId} onValueChange={setSelectedItemId}>
            <SelectTrigger id="missing-item" className="bg-white">
              <SelectValue className="bg-white" placeholder="Choose a stationery item" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {stationeryItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="missing-quantity" className="text-sm font-medium">
            Quantity Missing <span className="text-red-500">*</span>
          </Label>
          <Input
            id="missing-quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="bg-gray-50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="missing-notes" className="text-sm font-medium">
            Notes / Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="missing-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the circumstances of the missing item..."
            className="bg-gray-50 min-h-[100px]"
            required
          />
          <p className="text-xs text-gray-500">
            Please provide details about when and how the item went missing
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white h-11"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Submit Missing Report
        </Button>
      </form>

      {/* Missing Reports List */}
      {missingReports.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">
            Recent Missing Reports
          </h3>
          <div className="space-y-3">
            {missingReports
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .slice(0, 5)
              .map((report) => (
                <Card
                  key={report.id}
                  className="p-4 border-l-4 border-l-red-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {report.itemName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity:{" "}
                        <span className="font-semibold">{report.quantity}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.notes}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Reported by: {report.reportedBy}</span>
                        <span>
                          {new Date(report.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
