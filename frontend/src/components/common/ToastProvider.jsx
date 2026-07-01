import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext(null);

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = "info" }) => {
      const id = createId();
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      window.setTimeout(() => removeToast(id), 4200);
    },
    [removeToast],
  );

  const toast = useMemo(
    () => ({
      success: (message) => addToast({ message, type: "success" }),
      error: (message) => addToast({ message, type: "error" }),
      info: (message) => addToast({ message, type: "info" }),
    }),
    [addToast],
  );

  const icon = (type) => {
    if (type === "success") return <FaCheckCircle className="w-5 h-5 text-emerald-400" />;
    if (type === "error") return <FaExclamationCircle className="w-5 h-5 text-rose-400" />;
    return <FaInfoCircle className="w-5 h-5 text-sky-400" />;
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 items-end">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className="flex w-full max-w-sm items-start gap-3 rounded-3xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl text-white ring-1 ring-slate-700"
          >
            <div className="mt-0.5">{icon(type)}</div>
            <div className="flex-1 leading-5 text-sm">{message}</div>
            <button
              type="button"
              onClick={() => removeToast(id)}
              className="rounded-full p-1 text-slate-400 transition hover:text-white"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export default ToastProvider;
