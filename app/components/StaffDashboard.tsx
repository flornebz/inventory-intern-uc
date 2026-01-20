"use client";

import { useState } from "react";
import {
  Package,
  LogOut,
  FileText,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import StockReport from "@/app/components/StockReport";
import InventoryManagement from "@/app/components/InventoryManagement";
import MissingReportForm from "@/app/components/MissingReportForm";
import HistoryList from "@/app/components/HistoryList";
import AddStationeryForm from "./AddStationeryForm";
import type {
  User,
  StationeryItem,
  RetrievalOrder,
  MissingReport,
} from "../page";

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
  stationeryItems: StationeryItem[];
  retrievalsOrders: RetrievalOrder[];
  missingReports: MissingReport[];
  onAddMissingReport: (
    report: Omit<MissingReport, "id" | "date">
  ) => Promise<void>;
  onUpdateStock: (itemId: string, newStock: number) => Promise<void>;
  onAddStationeryItem: (
    item: Omit<StationeryItem, "id">
  ) => Promise<void>;
}


export default function StaffDashboard({
  user,
  onLogout,
  stationeryItems,
  retrievalsOrders,
  missingReports,
  onAddMissingReport,
  onUpdateStock,
  onAddStationeryItem,
}: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState("report");

  // Calculate statistics
  const totalItems = stationeryItems.length;
  const totalStock = stationeryItems.reduce(
    (sum, item) => sum + item.availableStock,
    0,
  );
  const lowStockItems = stationeryItems.filter(
    (item) => item.availableStock < item.totalStock * 0.2,
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Stationery Inventory
                </h1>
                <p className="text-xs text-gray-500">
                  Academic Support Staff Portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Academic Support Staff</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-gray-300 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gray-200 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Items
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {totalItems}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Stock
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {totalStock}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Low Stock Items
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {lowStockItems}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-white border border-gray-200 p-1">
            <TabsTrigger
              value="report"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <FileText className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <ClipboardList className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Package className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger
              value="missing"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <AlertTriangle className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Missing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                <CardTitle className="text-orange-900">Stock Report</CardTitle>
                <CardDescription className="text-black">
                  Generate and export detailed stock reports
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <StockReport
                  stationeryItems={stationeryItems}
                  retrievalsOrders={retrievalsOrders}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                
                <CardTitle className="text-orange-900">
                  Inventory Management
                </CardTitle>
                <CardDescription>
                  Update and manage stationery inventory levels
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <AddStationeryForm onAddItem={onAddStationeryItem} />
                <InventoryManagement
                  stationeryItems={stationeryItems}
                  onUpdateStock={onUpdateStock}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                <CardTitle className="text-orange-900">
                  Retrieval History
                </CardTitle>
                <CardDescription>
                  View all retrieval and order history
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <HistoryList
                  retrievalsOrders={retrievalsOrders}
                  showUserEmail
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missing" className="space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                <CardTitle className="text-orange-900">
                  Report Missing Stationery
                </CardTitle>
                <CardDescription>
                  Report missing or damaged stationery items
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <MissingReportForm
                  stationeryItems={stationeryItems}
                  reportedBy={user.email}
                  onSubmit={onAddMissingReport}
                  missingReports={missingReports}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
