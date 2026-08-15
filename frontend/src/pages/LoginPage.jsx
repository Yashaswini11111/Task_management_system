import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid login credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick login helper
  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    try {
      const user = await login(demoEmail, demoPassword);
      addToast(`Logged in as ${user.name} (${user.role})`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '12px', borderRadius: '16px', display: 'inline-flex', marginBottom: '12px' }}>
            <Layers style={{ color: '#ffffff', width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Sign In to TaskFlow</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enter your email and password to access your dashboard
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ 1-Click Demo Accounts
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('john@taskflow.com', 'user123')}
              style={{
                padding: '8px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '4px'
              }}
            >
              <UserCheck style={{ width: '14px', height: '14px' }} /> Demo User
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin@taskflow.com', 'admin123')}
              style={{
                padding: '8px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck style={{ width: '14px', height: '14px' }} /> Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '12px', width: '18px', height: '18px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@taskflow.com"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '12px', width: '18px', height: '18px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-accent)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
