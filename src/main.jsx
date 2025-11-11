import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./Contexts/AuthContext.jsx"; // ✅ ADD THIS

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {" "}
      {/* ✅ WRAP APP */}
      <App />
    </AuthProvider>
  </StrictMode>
);
