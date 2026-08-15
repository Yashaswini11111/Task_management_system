import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, User, Mail, Lock, ArrowRight, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      addToast(`Account created! Welcome to TaskFlow, ${user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
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
          maxWidth: '460px',
          padding: '36px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '12px', borderRadius: '16px', display: 'inline-flex', marginBottom: '12px' }}>
            <Layers style={{ color: '#ffffff', width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Account</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Join TaskFlow to organize tasks and boost productivity
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '12px', top: '12px', width: '18px', height: '18px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '12px', width: '18px', height: '18px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '12px', width: '18px', height: '18px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: '#1e293b',
                border: '1px solid var(--bg-card-border)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            >
              <option value="user">Standard User</option>
              <option value="admin">Administrator (Admin privileges)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'} <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
