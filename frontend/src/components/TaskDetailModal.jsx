import React from 'react';
import { X, Calendar, Tag, User, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

const TaskDetailModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

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
        zIndex: 999,
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className={`badge ${task.status === 'completed' ? 'badge-success' : task.status === 'in-progress' ? 'badge-info' : 'badge-warning'}`}>
            {task.status}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>{task.title}</h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
          {task.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Priority</span>
            <strong style={{ fontSize: '0.9rem', color: task.priority === 'high' ? '#f87171' : task.priority === 'medium' ? '#fbbf24' : '#34d399', textTransform: 'capitalize' }}>
              {task.priority} Priority
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</span>
            <strong style={{ fontSize: '0.9rem' }}>{task.category || 'Work'}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Due Date</span>
            <strong style={{ fontSize: '0.9rem' }}>{new Date(task.dueDate).toLocaleDateString()}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Created By</span>
            <strong style={{ fontSize: '0.9rem' }}>{task.createdBy?.name || 'User'}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
