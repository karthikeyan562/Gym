import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 style={{ color: isDanger ? 'var(--danger)' : '#fff' }}>
            <AlertTriangle size={22} color={isDanger ? 'var(--danger)' : 'var(--warning)'} />
            {title || 'Confirm Action'}
          </h2>
          <button className="modal-close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {message || 'Are you sure you want to proceed with this operation? This action cannot be undone.'}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
