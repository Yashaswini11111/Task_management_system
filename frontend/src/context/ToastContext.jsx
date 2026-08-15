import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 500,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(12px)',
              background:
                toast.type === 'success'
                  ? 'rgba(16, 185, 129, 0.95)'
                  : toast.type === 'error'
                  ? 'rgba(239, 68, 68, 0.95)'
                  : toast.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.95)'
                  : 'rgba(99, 102, 241, 0.95)',
              minWidth: '280px',
              animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {toast.type === 'success' && <CheckCircle2 style={{ width: '18px', height: '18px' }} />}
            {toast.type === 'error' && <AlertCircle style={{ width: '18px', height: '18px' }} />}
            {toast.type === 'warning' && <AlertCircle style={{ width: '18px', height: '18px' }} />}
            {toast.type === 'info' && <Info style={{ width: '18px', height: '18px' }} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
