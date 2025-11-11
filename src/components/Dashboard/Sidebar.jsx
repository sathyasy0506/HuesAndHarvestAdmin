import { ShoppingBag, LogOut, User } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";

export function Sidebar({ activeTab, onTabChange }) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col h-screen shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm truncate">
              {profile?.full_name || "Admin User"}
            </h3>
            <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <button
          onClick={() => onTabChange("orders")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            activeTab === "orders"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/50"
              : "hover:bg-slate-700/50"
          }`}
        >
          <ShoppingBag
            className={`w-5 h-5 ${
              activeTab === "orders"
                ? ""
                : "group-hover:scale-110 transition-transform"
            }`}
          />
          <span className="font-medium">Orders</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
