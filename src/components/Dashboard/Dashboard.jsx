import { Sidebar } from "./Sidebar";
import OrdersView from "./OrdersList/OrdersView"; // ✅ updated import
import OrderDetails from "./OrderDetail/OrderDetails";
import { Navigate, Route, Routes } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="orders" element={<OrdersView />} />{" "}
          {/* ✅ updated component */}
          <Route path="order-detail" element={<OrderDetails />} />
          <Route path="*" element={<Navigate to="orders" replace />} />
        </Routes>
      </div>
    </div>
  );
}
