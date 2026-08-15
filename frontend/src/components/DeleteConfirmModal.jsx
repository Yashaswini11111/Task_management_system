import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Confirm Deletion', message = 'Are you sure you want to delete this item? This action cannot be undone.' }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 16px'
          }}
        >
          <AlertTriangle style={{ width: '26px', height: '26px' }} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Trash2 style={{ width: '16px', height: '16px' }} /> Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
