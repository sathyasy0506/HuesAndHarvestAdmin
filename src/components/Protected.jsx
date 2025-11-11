import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

// Protects children. Shows spinner while AuthContext boots/validates.
export default function Protected({ children }) {
  const { loading, user, validate } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (loading) {
        setChecking(true);
        return;
      }
      if (!user) {
        setChecking(false); // App will show login when no user
        return;
      }
      // Optional: soft validate current access token
      const ok = await validate().catch(() => false);
      if (mounted) setChecking(false);
      if (!ok) {
        // AuthContext will refresh automatically if scheduled; App handles gating
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loading, user, validate]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user exists, App will render Dashboard; otherwise App shows Login
  return children;
}
