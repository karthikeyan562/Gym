import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const type = toast.type || 'info';
        return (
          <div key={toast.id} className={`toast ${type}`}>
            {type === 'success' && <CheckCircle2 size={20} color="var(--success)" />}
            {type === 'error' && <AlertCircle size={20} color="var(--danger)" />}
            {type === 'info' && <Info size={20} color="var(--info)" />}
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button
              onClick={() => onClose(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
