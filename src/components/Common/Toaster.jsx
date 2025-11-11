import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

let showToastFn;

export const showToast = (message, type = "success", duration = 3000) => {
  if (typeof showToastFn === "function") {
    showToastFn({ message, type, duration });
  }
};

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToastFn = ({ message, type, duration }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };
    return () => {
      showToastFn = undefined;
    };
  }, []);

  const Icon = ({ type }) => {
    if (type === "success") return <CheckCircle className="w-5 h-5" />;
    if (type === "error") return <XCircle className="w-5 h-5" />;
    return null;
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            flex items-center gap-3
            bg-white/85 dark:bg-gray-900/85
            backdrop-blur-md shadow-xl
            rounded-xl px-5 py-3 border-l-4
            ${t.type === "success" ? "border-l-green-400" : "border-l-red-400"}
            opacity-0 animate-slide-in-fade
          `}
        >
          <span
            className={t.type === "success" ? "text-green-500" : "text-red-500"}
          >
            <Icon type={t.type} />
          </span>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {t.message}
          </p>
        </div>
      ))}
      <style>{`
        @keyframes slide-in-fade {
          0% { transform: translateX(50%) scale(0.95); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .animate-slide-in-fade { animation: slide-in-fade 0.35s forwards; }
      `}</style>
    </div>
  );
};

export default Toaster;
