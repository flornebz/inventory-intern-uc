"use client";

import { useState } from "react";
import { Package, LogOut, Plus, History, Info } from "lucide-react";
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
import RetrievalOrderForm from "@/app/components/RetrievalOrderForm";
import HistoryList from "@/app/components/HistoryList";
import type { User, StationeryItem, RetrievalOrder } from "../page";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

interface LecturerDashboardProps {
  user: User;
  onLogout: () => void;
  stationeryItems: StationeryItem[];
  userRetrievalsOrders: RetrievalOrder[];
  onAddRetrievalOrder: (
    order: Omit<RetrievalOrder, "id" | "date" | "status">,
  ) => void;
  onAddStationeryItem: (
    item: Omit<StationeryItem, "id">
  ) => Promise<void>;
}

export default function LecturerDashboard({
  user,
  onLogout,
  stationeryItems,
  userRetrievalsOrders,
  onAddRetrievalOrder,
}: LecturerDashboardProps) {
  const [activeTab, setActiveTab] = useState("retrieve");

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
                <p className="text-xs text-gray-500">Lecturer Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Lecturer</p>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border border-gray-200 p-1">
            <TabsTrigger
              value="retrieve"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Retrieve
            </TabsTrigger>
            <TabsTrigger
              value="order"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Order
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="retrieve" className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-900 ml-2">
                <strong>Retrieve Section:</strong> This section is specifically
                for retrieving stationery items from the current available
                inventory. Please select the items you need, specify the
                quantity, and provide any relevant notes for record-keeping
                purposes. Ensure that you only request quantities within the
                available stock limits.
              </AlertDescription>
            </Alert>

            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                <CardTitle className="text-orange-900">
                  Retrieve Stationery
                </CardTitle>
                <CardDescription>
                  Select items to retrieve from current inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RetrievalOrderForm
                  type="retrieval"
                  userEmail={user.email}
                  stationeryItems={stationeryItems}
                  onSubmit={onAddRetrievalOrder}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="order" className="space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                <CardTitle className="text-orange-900">
                  Order Stationery
                </CardTitle>
                <CardDescription>
                  Submit a request to order new stationery items
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RetrievalOrderForm
                  type="order"
                  userEmail={user.email}
                  stationeryItems={stationeryItems}
                  onSubmit={onAddRetrievalOrder}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                <CardTitle className="text-orange-900">Your History</CardTitle>
                <CardDescription>
                  View your retrieval and order history
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <HistoryList retrievalsOrders={userRetrievalsOrders} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
