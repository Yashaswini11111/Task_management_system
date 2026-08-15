import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Bell, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="glass-panel"
      style={{
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{title || 'Dashboard'}</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Welcome back, <strong style={{ color: 'var(--text-main)' }}>{user?.name}</strong> 👋
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--bg-card-border)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem'
          }}
        >
          <div className="pulse-dot" />
          <span style={{ color: 'var(--text-muted)' }}>System API Active</span>
        </div>

        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            transition: 'var(--transition)'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
