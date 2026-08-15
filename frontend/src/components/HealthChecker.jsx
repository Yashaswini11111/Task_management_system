import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Server, Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const HealthChecker = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();
    try {
      const response = await axios.get('/api/health');
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setHealthData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data : 'Backend server unreachable. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Server style={{ color: 'var(--primary-accent)', width: '28px', height: '28px' }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Express API Health Monitor</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Communicating via Axios to http://localhost:5000/api/health</p>
          </div>
        </div>
        <button className="btn-secondary" onClick={fetchHealthStatus} disabled={loading}>
          <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Pinging...' : 'Refresh Status'}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Activity style={{ animation: 'pulseGlow 1s infinite ease-in-out', marginBottom: '8px' }} />
          <p>Contacting backend API server...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
            <AlertCircle style={{ width: '20px', height: '20px' }} /> Backend Server Offline or Port Mismatch
          </div>
          <p style={{ fontSize: '0.85rem' }}>{typeof error === 'string' ? error : JSON.stringify(error)}</p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Backend Status</span>
              <div style={{ marginTop: '6px' }}>
                <span className="badge badge-success">
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Online (200 OK)
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Latency</span>
              <p style={{ marginTop: '4px', fontSize: '1.1rem', fontWeight: 'bold', color: '#60a5fa' }}>{latency} ms</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage Prompt Verified</span>
              <p style={{ marginTop: '4px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{healthData.stage}</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Environment</span>
              <p style={{ marginTop: '4px', fontSize: '0.95rem', fontWeight: 600, color: '#c084fc' }}>{healthData.environment}</p>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Raw JSON Response from /api/health:</span>
            <pre>{JSON.stringify(healthData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthChecker;
