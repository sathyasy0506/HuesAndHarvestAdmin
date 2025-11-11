import { ShoppingBag, LogOut, User, Package } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Sidebar() {
  const { getProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      if (data) setProfile(data);
    })();
  }, []);

  const activeTab = location.pathname.split("/").pop();

  const handleTabChange = (tab) => {
    navigate(`/dashboard/${tab}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : "Loading..."}
            </h3>
            <p className="text-[10px] text-slate-400">{profile?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <nav className="flex-1 p-4">
        <button
          onClick={() => handleTabChange("orders")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
            activeTab === "orders" ? "bg-blue-600" : "hover:bg-slate-700/50"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Orders</span>
        </button>

        <button
          onClick={() => handleTabChange("order-detail")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
            activeTab === "order-detail"
              ? "bg-blue-600"
              : "hover:bg-slate-700/50"
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Order Detail</span>
        </button>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-600/20 text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
