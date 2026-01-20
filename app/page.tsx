'use client';

import { useEffect, useState } from 'react';
import Login from '@/app/components/Login';
import LecturerDashboard from '@/app/components/LecturerDashboard';
import StaffDashboard from '@/app/components/StaffDashboard';
import { Toaster } from '@/app/components/ui/sonner';
import supabase from './lib/client';

/* ======================
   INTERFACES (MATCH DB)
====================== */

export interface User {
  email: string;
  role: 'lecturer' | 'staff';
}

export interface StationeryItem {
  id: string;
  name: string;
  category: 'OP Stock' | 'OP Non-Stock';
  totalStock: number;
  availableStock: number;
  unit: string;
}

export interface RetrievalOrder {
  id: string;
  type: 'retrieval' | 'order';
  userEmail: string;
  itemId: string;
  itemName: string;
  quantity: number;
  notes: string | null;
  date: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface MissingReport {
  id: string;
  itemId: string;
  itemName: string;
  reportedBy: string;
  quantity: number;
  notes: string | null;
  date: string;
}

/* ======================
   APP COMPONENT
====================== */

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [stationeryItems, setStationeryItems] = useState<StationeryItem[]>([]);
  const [retrievalsOrders, setRetrievalsOrders] = useState<RetrievalOrder[]>([]);
  const [missingReports, setMissingReports] = useState<MissingReport[]>([]);

  /* ======================
     FETCH FUNCTIONS
  ====================== */
const handleAddStationeryItem = async (
  item: Omit<StationeryItem, 'id'>
) => {
  if (item.availableStock > item.totalStock) {
    throw new Error('Available stock cannot exceed total stock');
  }

  const { error } = await supabase
    .from('stationery_items')
    .insert({
      id: crypto.randomUUID(),
      name: item.name,
      category: item.category,
      total_stock: item.totalStock,
      available_stock: item.availableStock,
      unit: item.unit,
    });

  if (error) throw error;

  await fetchStationery();
};

const handleDeleteStationeryItem = async (itemId: string) => {
  const confirm = window.confirm(
    'Are you sure you want to delete this item? This action cannot be undone.'
  );

  if (!confirm) return;

  const { error } = await supabase
    .from('stationery_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    // Biasanya error karena FK: item sudah dipakai di retrieval_orders / missing_reports
    alert(
      error.message.includes('foreign key')
        ? 'Cannot delete this item because it is already used in orders or reports.'
        : `Failed to delete item: ${error.message}`
    );
    return;
  }

  await fetchStationery();
};



  const fetchStationery = async () => {
    const { data, error } = await supabase
      .from('stationery_items')
      .select('id, name, category, total_stock, available_stock, unit')
      .order('name');

    if (error) throw error;

    const items: StationeryItem[] = data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      totalStock: item.total_stock,
      availableStock: item.available_stock,
      unit: item.unit,
    }));

    setStationeryItems(items);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('retrieval_orders')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    const orders: RetrievalOrder[] = data.map(o => ({
      id: o.id,
      type: o.type,
      userEmail: o.user_email,
      itemId: o.item_id,
      itemName: o.item_name,
      quantity: o.quantity,
      notes: o.notes,
      date: o.date,
      status: o.status,
    }));

    setRetrievalsOrders(orders);
  };

  const fetchMissingReports = async () => {
    const { data, error } = await supabase
      .from('missing_reports')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    const reports: MissingReport[] = data.map(r => ({
      id: r.id,
      itemId: r.item_id,
      itemName: r.item_name,
      reportedBy: r.reported_by,
      quantity: r.quantity,
      notes: r.notes,
      date: r.date,
    }));

    setMissingReports(reports);
  };

  /* ======================
     INITIAL LOAD
  ====================== */

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchStationery(),
          fetchOrders(),
          fetchMissingReports(),
        ]);
      } catch (err) {
        console.error('Initial load error:', err);
      }
    };

    loadInitialData();
  }, []);

  /* ======================
     ACTION HANDLERS
  ====================== */

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddRetrievalOrder = async (
    order: Omit<RetrievalOrder, 'id' | 'date' | 'status'>
  ) => {
    const { error } = await supabase
      .from('retrieval_orders')
      .insert({
        id: crypto.randomUUID(),
        type: order.type,
        user_email: order.userEmail,
        item_id: order.itemId,
        item_name: order.itemName,
        quantity: order.quantity,
        notes: order.notes,
        // date & status pakai DEFAULT
      });

    if (error) throw error;

    await Promise.all([fetchOrders(), fetchStationery()]);
  };

  const handleAddMissingReport = async (
    report: Omit<MissingReport, 'id' | 'date'>
  ) => {
    const { error } = await supabase
      .from('missing_reports')
      .insert({
        id: crypto.randomUUID(),
        item_id: report.itemId,
        item_name: report.itemName,
        reported_by: report.reportedBy,
        quantity: report.quantity,
        notes: report.notes,
      });

    if (error) throw error;

    await fetchMissingReports();
  };

  const handleUpdateStock = async (itemId: string, newStock: number) => {
    const { error } = await supabase
      .from('stationery_items')
      .update({ available_stock: newStock })
      .eq('id', itemId);

    if (error) throw error;

    await fetchStationery();
  };

  /* ======================
     RENDER
  ====================== */

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {user.role === 'lecturer' ? (
        <LecturerDashboard
          user={user}
          onLogout={handleLogout}
          stationeryItems={stationeryItems}
          userRetrievalsOrders={retrievalsOrders.filter(
            r => r.userEmail === user.email
          )}
          onAddRetrievalOrder={handleAddRetrievalOrder}
          onAddStationeryItem={handleAddStationeryItem}
        />
      ) : (
        <StaffDashboard
          user={user}
          onLogout={handleLogout}
          stationeryItems={stationeryItems}
          retrievalsOrders={retrievalsOrders}
          missingReports={missingReports}
          onAddMissingReport={handleAddMissingReport}
          onUpdateStock={handleUpdateStock}
          onAddStationeryItem={handleAddStationeryItem}
        />
      )}
      <Toaster />
    </>
  );
}
