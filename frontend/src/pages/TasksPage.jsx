import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Search, Filter, Plus, ArrowUpDown, LayoutGrid, List } from 'lucide-react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const { addToast } = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await API.get(`/tasks?${params.toString()}`);
      setTasks(response.data.tasks);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, taskData);
        addToast('Task updated successfully!', 'success');
      } else {
        await API.post('/tasks', taskData);
        addToast('Task created successfully!', 'success');
      }
      fetchTasks();
      setEditingTask(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save task', 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchTasks();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;
    try {
      await API.delete(`/tasks/${deletingTaskId}`);
      addToast('Task deleted successfully', 'success');
      fetchTasks();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete task', 'error');
    } finally {
      setDeletingTaskId(null);
    }
  };

  return (
    <div>
      <Navbar title="Task Management" />

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Tasks ({tasks.length})</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage, filter, and organize your tasks</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} /> Create New Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--bg-card-border)',
                color: '#ffffff',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#1e293b',
              border: '1px solid var(--bg-card-border)',
              color: '#ffffff',
              fontSize: '0.88rem'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#1e293b',
              border: '1px solid var(--bg-card-border)',
              color: '#ffffff',
              fontSize: '0.88rem'
            }}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#1e293b',
              border: '1px solid var(--bg-card-border)',
              color: '#ffffff',
              fontSize: '0.88rem'
            }}
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Personal">Personal</option>
            <option value="Project">Project</option>
            <option value="Design">Design</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="Documentation">Documentation</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#1e293b',
              border: '1px solid var(--bg-card-border)',
              color: '#ffffff',
              fontSize: '0.88rem'
            }}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>
      </div>

      {/* Task List / Grid Display */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Loading tasks from database...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3>No tasks match your criteria</h3>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>Try clearing filters or create a new task!</p>
        </div>
      ) : (
        <div className="grid-cards">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => {
                setEditingTask(t);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setDeletingTaskId(id)}
              onStatusChange={handleStatusChange}
              onView={(t) => setViewingTask(t)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialTask={editingTask}
        titleText={editingTask ? 'Edit Task Details' : 'Create New Task'}
      />

      {/* View Details Modal */}
      <TaskDetailModal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? It will be permanently removed."
      />
    </div>
  );
};

export default TasksPage;
