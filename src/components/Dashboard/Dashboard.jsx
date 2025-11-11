import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { OrdersView } from "./OrdersView";


export function Dashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "orders" && <OrdersView />}
    </div>
  );
}
