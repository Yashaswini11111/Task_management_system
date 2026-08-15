import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Shield, Users, CheckSquare, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';

const AdminDashboardPage = () => {
  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deletion targets
  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const { addToast } = useToast();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, tasksRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/tasks')
      ]);

      setAdminStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setAllTasks(tasksRes.data.tasks);
    } catch (err) {
      addToast(err.response?.data?.message || 'Admin portal authorization failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await API.delete(`/admin/users/${deletingUser._id}`);
      addToast(`User ${deletingUser.name} and associated tasks removed`, 'success');
      fetchAdminData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeletingUser(null);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await API.delete(`/admin/tasks/${deletingTask._id}`);
      addToast(`System task removed`, 'success');
      fetchAdminData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete system task', 'error');
    } finally {
      setDeletingTask(null);
    }
  };

  return (
    <div>
      <Navbar title="Administrator Portal" />

      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Loading administrative controls & user database...</p>
        </div>
      ) : (
        <>
          {/* Admin Stats Overview */}
          <div className="grid-cards" style={{ marginBottom: '28px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registered Users</span>
                <Users style={{ color: '#818cf8', width: '22px', height: '22px' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800 }}>{adminStats?.totalUsers || 0}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {adminStats?.adminCount || 0} Admins • {adminStats?.standardUserCount || 0} Standard Users
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>System Tasks</span>
                <CheckSquare style={{ color: '#34d399', width: '22px', height: '22px' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800 }}>{adminStats?.totalTasks || 0}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Across all user accounts</span>
            </div>
          </div>

          {/* User Management Section */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Registered Users Management</h3>
              <button className="btn-secondary" onClick={fetchAdminData}>
                <RefreshCw style={{ width: '16px', height: '16px' }} /> Refresh Table
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>User Name</th>
                    <th style={{ padding: '12px' }}>Email Address</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Joined Date</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={u.role === 'admin' ? 'badge badge-warning' : 'badge badge-info'}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setDeletingUser(u)}
                            style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Tasks Monitoring Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>System-Wide Tasks Audit</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Task Title</th>
                    <th style={{ padding: '12px' }}>Created By</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Priority</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Admin Override</th>
                  </tr>
                </thead>
                <tbody>
                  {allTasks.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{t.title}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{t.createdBy?.name || 'User'}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${t.status === 'completed' ? 'badge-success' : t.status === 'in-progress' ? 'badge-info' : 'badge-warning'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textTransform: 'capitalize' }}>{t.priority}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => setDeletingTask(t)}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete User Dialog */}
      <DeleteConfirmModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to delete user account '${deletingUser?.name}' (${deletingUser?.email})? All associated tasks will also be removed.`}
      />

      {/* Delete Task Dialog */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        title="Admin Remove System Task"
        message={`Are you sure you want to force delete task '${deletingTask?.title}'?`}
      />
    </div>
  );
};

export default AdminDashboardPage;
