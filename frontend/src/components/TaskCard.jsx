import React from 'react';
import { Calendar, Tag, Edit, Trash2, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onView }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      case 'medium':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', class: 'badge-success', icon: CheckCircle };
      case 'in-progress':
        return { label: 'In Progress', class: 'badge-info', icon: Clock };
      default:
        return { label: 'To Do', class: 'badge-warning', icon: AlertTriangle };
    }
  };

  const pStyle = getPriorityStyle(task.priority);
  const statusInfo = getStatusBadge(task.status);
  const StatusIcon = statusInfo.icon;

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No Date';

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        transition: 'var(--transition)',
        position: 'relative'
      }}
    >
      <div>
        {/* Priority & Category Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: pStyle.bg,
              color: pStyle.color,
              border: `1px solid ${pStyle.border}`
            }}
          >
            {task.priority} Priority
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <Tag style={{ width: '12px', height: '12px' }} /> {task.category || 'General'}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onView && onView(task)}
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '8px',
            cursor: 'pointer',
            lineHeight: 1.3
          }}
        >
          {task.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {task.description}
        </p>
      </div>

      <div>
        {/* Status Dropdown & Due Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar style={{ width: '14px', height: '14px', color: '#818cf8' }} /> {formattedDate}
          </div>

          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: task.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : task.status === 'in-progress' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: task.status === 'completed' ? '#34d399' : task.status === 'in-progress' ? '#60a5fa' : '#fbbf24',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="todo" style={{ background: '#1e293b', color: '#ffffff' }}>To Do</option>
            <option value="in-progress" style={{ background: '#1e293b', color: '#ffffff' }}>In Progress</option>
            <option value="completed" style={{ background: '#1e293b', color: '#ffffff' }}>Completed</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={() => onView(task)}
            title="View Details"
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-main)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Eye style={{ width: '15px', height: '15px' }} />
          </button>
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            style={{ background: 'rgba(99, 102, 241, 0.15)', border: 'none', color: '#818cf8', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Edit style={{ width: '15px', height: '15px' }} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            title="Delete Task"
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#f87171', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Trash2 style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
