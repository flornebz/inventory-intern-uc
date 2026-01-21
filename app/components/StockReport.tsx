import { useRef } from "react";
import { FileDown, Printer } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { StationeryItem, RetrievalOrder } from "../page";

interface StockReportProps {
  stationeryItems: StationeryItem[];
  retrievalsOrders: RetrievalOrder[];
}

export default function StockReport({
  stationeryItems,
  retrievalsOrders,
}: StockReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Stock-Report-${new Date().toLocaleDateString()}`,
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Stationery Inventory Report", 14, 22);

    doc.setFontSize(11);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      14,
      30,
    );

    // Summary Statistics
    doc.setFontSize(14);
    doc.text("Summary Statistics", 14, 42);

    const totalItems = stationeryItems.length;
    const totalStock = stationeryItems.reduce(
      (sum, item) => sum + item.availableStock,
      0,
    );
    const opStockItems = stationeryItems.filter(
      (i) => i.category === "OP Stock",
    );
    const opNonStockItems = stationeryItems.filter(
      (i) => i.category === "OP Non-Stock",
    );

    doc.setFontSize(10);
    doc.text(`Total Items: ${totalItems}`, 14, 50);
    doc.text(`Total Available Stock: ${totalStock} units`, 14, 56);
    doc.text(`OP Stock Items: ${opStockItems.length}`, 14, 62);
    doc.text(`OP Non-Stock Items: ${opNonStockItems.length}`, 14, 68);

    // Detailed Inventory Table
    doc.setFontSize(14);
    doc.text("Detailed Inventory", 14, 80);

    const tableData = stationeryItems.map((item) => [
      item.name,
      item.category,
      item.totalStock.toString(),
      item.availableStock.toString(),
      item.unit,
      ((item.availableStock / item.totalStock) * 100).toFixed(1) + "%",
    ]);

    autoTable(doc, {
      startY: 85,
      head: [
        [
          "Item Name",
          "Category",
          "Total Stock",
          "Available",
          "Unit",
          "% Available",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [249, 115, 22] }, // Orange color
      styles: { fontSize: 9 },
    });

    // Category Breakdown
    const finalY = (doc as any).lastAutoTable.finalY || 85;

    doc.setFontSize(14);
    doc.text("Stock by Category", 14, finalY + 15);

    const opStockTotal = opStockItems.reduce(
      (sum, item) => sum + item.availableStock,
      0,
    );
    const opNonStockTotal = opNonStockItems.reduce(
      (sum, item) => sum + item.availableStock,
      0,
    );

    const categoryData = [
      ["OP Stock", opStockItems.length.toString(), opStockTotal.toString()],
      [
        "OP Non-Stock",
        opNonStockItems.length.toString(),
        opNonStockTotal.toString(),
      ],
    ];

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Category", "Number of Items", "Total Available Stock"]],
      body: categoryData,
      theme: "striped",
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 10 },
    });

    doc.save(`Stock-Report-${new Date().toLocaleDateString()}.pdf`);
  };

  // Calculate statistics
  const totalItems = stationeryItems.length;
  const totalStock = stationeryItems.reduce(
    (sum, item) => sum + item.availableStock,
    0,
  );
  const opStockItems = stationeryItems.filter((i) => i.category === "OP Stock");
  const opNonStockItems = stationeryItems.filter(
    (i) => i.category === "OP Non-Stock",
  );

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="border-gray-300"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>
        <Button
          onClick={handleExportPDF}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
      </div>

      {/* Report Content */}
      <div
        ref={reportRef}
        className="bg-white p-8 rounded-lg border border-gray-200"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Stationery Inventory Report
          </h2>
          <p className="text-gray-600">
            Generated on {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
            Summary Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">OP Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {opStockItems.length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">OP Non-Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {opNonStockItems.length}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Inventory */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
            Detailed Inventory
          </h3>
        {/* OP STOCK */}
<div className="mb-10">
  <h4 className="font-semibold text-blue-800 mb-3">OP Stock</h4>

  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-orange-50">
          <TableHead>Item Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Total Stock</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead className="text-right">% Available</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {opStockItems.map((item) => {
          const percentAvailable =
            (item.availableStock / item.totalStock) * 100;

          return (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>

              <TableCell>
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  OP Stock
                </span>
              </TableCell>


              <TableCell className="text-right">
                {item.unitPrice
                  ? item.unitPrice.toLocaleString("id-ID")
                  : "-"}
              </TableCell>

              <TableCell className="text-right">{item.totalStock}</TableCell>

              <TableCell className="text-right font-semibold">
                {item.availableStock}
              </TableCell>

              <TableCell>{item.unit}</TableCell>

              <TableCell className="text-right">
                <span
                  className={`font-medium ${
                    percentAvailable < 20
                      ? "text-red-600"
                      : percentAvailable < 50
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  {percentAvailable.toFixed(1)}%
                </span>
              </TableCell>
            </TableRow>
          );
        })}

        {opStockItems.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-gray-500">
              Tidak ada data OP Stock
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>

        {/* OP NON-STOCK */}
        {/* OP NON-STOCK */}
<div>
  <h4 className="font-semibold text-purple-800 mb-3">OP Non-Stock</h4>

  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-orange-50">
          <TableHead>Item Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Merek</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Total Stock</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead className="text-right">% Available</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {opNonStockItems.map((item) => {
          const percentAvailable =
            (item.availableStock / item.totalStock) * 100;

          return (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>

              <TableCell>
                <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                  OP Non-Stock
                </span>
              </TableCell>

              <TableCell>{item.brand ?? "-"}</TableCell>

              <TableCell className="text-right">
                {item.unitPrice
                  ? item.unitPrice.toLocaleString("id-ID")
                  : "-"}
              </TableCell>

              <TableCell className="text-right">{item.totalStock}</TableCell>

              <TableCell className="text-right font-semibold">
                {item.availableStock}
              </TableCell>

              <TableCell>{item.unit}</TableCell>

              <TableCell className="text-right">
                <span
                  className={`font-medium ${
                    percentAvailable < 20
                      ? "text-red-600"
                      : percentAvailable < 50
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  {percentAvailable.toFixed(1)}%
                </span>
              </TableCell>
            </TableRow>
          );
        })}

        {opNonStockItems.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-gray-500">
              Tidak ada data OP Non-Stock
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>

        </div>

        {/* Category Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
            Stock by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">OP Stock</h4>
              <p className="text-sm text-gray-600">
                Number of Items:{" "}
                <span className="font-semibold">{opStockItems.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total Available:{" "}
                <span className="font-semibold">
                  {opStockItems.reduce(
                    (sum, item) => sum + item.availableStock,
                    0,
                  )}
                </span>
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">
                OP Non-Stock
              </h4>
              <p className="text-sm text-gray-600">
                Number of Items:{" "}
                <span className="font-semibold">{opNonStockItems.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total Available:{" "}
                <span className="font-semibold">
                  {opNonStockItems.reduce(
                    (sum, item) => sum + item.availableStock,
                    0,
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
