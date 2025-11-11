import { useEffect, useMemo, useState } from "react";
import StatusCards from "./StatusCard";
import OrderList from "./OrderList";
import { mockOrders } from "../../../../mockOrders";

export default function OrdersView() {
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      processing: orders.filter((o) => o.status === "processing").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
    };
  }, [orders]);

  function updateOrderStatus(id, newStatus) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  }

  // console.log("OrdersView updateOrderStatus function:", updateOrderStatus); // ✅ ADD HERE

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Orders Dashboard</h1>

      <StatusCards stats={stats} />

      <OrderList
        filteredOrders={filteredOrders}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        updateOrderStatus={updateOrderStatus}
      />
    </div>
  );
}
