import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { BarChart3, TrendingUp, CheckCircle, Flame, Clock } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          API.get('/tasks/stats/summary'),
          API.get('/tasks')
        ]);
        setStats(statsRes.data.stats);
        setTasks(tasksRes.data.tasks);
      } catch (err) {
        addToast('Failed to load analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Compute category breakdown
  const categoryCounts = tasks.reduce((acc, task) => {
    const cat = task.category || 'Work';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Tasks Count per Category',
        data: Object.values(categoryCounts),
        backgroundColor: '#6366f1',
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Tasks Distribution by Category', color: '#94a3b8' }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div>
      <Navbar title="Productivity Analytics" />

      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Analyzing task performance data...</p>
        </div>
      ) : (
        <>
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <TrendingUp style={{ color: 'var(--primary-accent)', width: '28px', height: '28px' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Overall Velocity & Task Completion Rate</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Performance analytics generated from live user records</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Task Completion Progress</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{stats?.completionRate || 0}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${stats?.completionRate || 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                    borderRadius: '9999px',
                    transition: 'width 0.8s ease-in-out'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bar Chart Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ height: '300px' }}>
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
