import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Contexts/AuthContext";
import { LoginPage } from "./components/Auth/LoginPage";
import { DashboardLayout } from "./components/Dashboard/Dashboard";
import Toaster from "./components/Common/Toaster";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="/login" element={<LoginPage />} />
        ) : (
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        )}
        <Route
          path="*"
          element={
            <Navigate to={user ? "/dashboard/orders" : "/login"} replace />
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
