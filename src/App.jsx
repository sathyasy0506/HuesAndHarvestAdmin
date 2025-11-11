import { useAuth } from "./Contexts/AuthContext";
import { LoginPage } from "./components/Dashboard/LoginPage";
import { Dashboard } from "./components/Dashboard/Dashboard";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

export default App;
