import { useState, useEffect } from "react";
import { Edit, Package, Search, Filter } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { showToast } from "../../Common/Toaster";

export default function OrderList({
  filteredOrders,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  updateOrderStatus,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ✅ Calculate orders to show
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // ✅ Reset page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const statusOptions = ["processing", "shipped", "delivered", "cancelled"];

  function openModal(order) {
    setEditingOrder(order);
    setNewStatus(order.status);
    setModalOpen(true);
  }

  function closeModal() {
    setEditingOrder(null);
    setModalOpen(false);
  }

  function saveStatus() {
    updateOrderStatus(editingOrder.id, newStatus);

    showToast(
      `Order No #${editingOrder.order_number} changed to ${newStatus}`,
      "success"
    );

    closeModal();
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No orders found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <Th>Order</Th>
                    <Th>Customer</Th>
                    <Th>Items</Th>
                    <Th>Total</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {currentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <Td className="font-semibold text-slate-900 whitespace-nowrap">
                        {order.order_number}
                      </Td>
                      <Td>
                        <div className="text-sm font-medium text-slate-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {order.customer_email}
                        </div>
                      </Td>
                      <Td className="whitespace-nowrap text-sm text-slate-900">
                        {order.items_count}
                      </Td>
                      <Td className="whitespace-nowrap text-sm font-semibold text-slate-900">
                        ${order.total_amount.toFixed(2)}
                      </Td>
                      <Td className="whitespace-nowrap text-sm text-slate-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </Td>
                      <Td className="whitespace-nowrap text-sm">
                        <StatusBadge status={order.status} />
                      </Td>
                      <Td>
                        <button
                          onClick={() => openModal(order)}
                          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ✅ Pagination */}
              {filteredOrders.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === index + 1
                          ? "bg-slate-900 text-white"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === totalPages
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ✅ Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[360px] p-6 shadow-xl relative">
            <h3 className="text-lg font-semibold mb-4">
              Update Status – {editingOrder?.order_number}
            </h3>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                Select New Status
              </label>

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveStatus}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({ children, className }) {
  return <td className={`px-6 py-4 ${className || ""}`}>{children}</td>;
}
