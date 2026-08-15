import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, Clock, AlertTriangle, CheckCircle2, Flame, Plus, ArrowRight, Calendar, Tag } from 'lucide-react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, tasksRes] = await Promise.all([
        API.get('/tasks/stats/summary'),
        API.get('/tasks?sortBy=newest')
      ]);

      setStats(statsRes.data.stats);
      setRecentTasks(tasksRes.data.tasks.slice(0, 5));

      // Calculate upcoming deadlines (next 7 days, excluding completed)
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = tasksRes.data.tasks.filter((t) => {
        if (t.status === 'completed') return false;
        const d = new Date(t.dueDate);
        return d >= now && d <= nextWeek;
      });
      setUpcomingDeadlines(upcoming);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [stats?.todoTasks || 0, stats?.inProgressTasks || 0, stats?.completedTasks || 0],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
        borderColor: ['rgba(245, 158, 11, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  return (
    <div>
      <Navbar title="Dashboard Overview" />

      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Loading real-time task analytics...</p>
        </div>
      ) : (
        <>
          {/* Quick Actions & Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Productivity Snapshot</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calculated dynamically from MongoDB database records</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/tasks" className="btn-secondary" style={{ textDecoration: 'none' }}>
                <CheckSquare style={{ width: '16px', height: '16px' }} /> View All Tasks
              </Link>
              <Link to="/tasks/new" className="btn-primary" style={{ textDecoration: 'none' }}>
                <Plus style={{ width: '16px', height: '16px' }} /> Quick Create Task
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid-cards" style={{ marginBottom: '28px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Tasks</span>
                <CheckSquare style={{ color: '#818cf8', width: '22px', height: '22px' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalTasks || 0}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active in system</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>To Do</span>
                <AlertTriangle style={{ color: '#fbbf24', width: '22px', height: '22px' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{stats?.todoTasks || 0}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending execution</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</span>
                <Clock style={{ color: '#60a5fa', width: '22px', height: '22px' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#60a5fa' }}>{stats?.inProgressTasks || 0}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Under development</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed</span>
                <CheckCircle2 style={{ color: '#34d399', width: '22px', height: '22px' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{stats?.completedTasks || 0}</p>
              <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                {stats?.completionRate || 0}% Completion Rate
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>High Priority</span>
                <Flame style={{ color: '#f87171', width: '22px', height: '22px' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>{stats?.highPriorityTasks || 0}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Urgent tasks</span>
            </div>
          </div>

          {/* Charts & Deadlines Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {/* Task Status Chart */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Task Status Distribution</h3>
              <div style={{ height: '230px', position: 'relative' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Deadlines (Next 7 Days)</h3>
                <span className="badge badge-warning">{upcomingDeadlines.length} Due Soon</span>
              </div>

              {upcomingDeadlines.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Calendar style={{ width: '32px', height: '32px', marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.9rem' }}>No upcoming deadlines in the next 7 days.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {upcomingDeadlines.map((t) => (
                    <div
                      key={t._id}
                      style={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '4px' }}>{t.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Due: {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`badge ${t.priority === 'high' ? 'badge-warning' : 'badge-info'}`}>
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Tasks List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Tasks</h3>
              <Link to="/tasks" style={{ color: 'var(--primary-accent)', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                View All Tasks <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentTasks.map((t) => (
                <div
                  key={t._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '4px' }}>{t.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span>Category: {t.category || 'Work'}</span> • <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <span className={`badge ${t.status === 'completed' ? 'badge-success' : t.status === 'in-progress' ? 'badge-info' : 'badge-warning'}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
