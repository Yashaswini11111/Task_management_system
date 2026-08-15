import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, PlusCircle, BarChart2, User, Shield, Settings, LogOut, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    background: isActive ? 'var(--primary-gradient)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.92rem',
    transition: 'var(--transition)',
    marginBottom: '4px'
  });

  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        minHeight: 'calc(100vh - 40px)',
        margin: '20px 0 20px 20px',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between'
      }}
    >
      <div>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers style={{ color: '#ffffff', width: '22px', height: '22px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }} className="gradient-text">
              TaskFlow
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Management Suite
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px 8px', display: 'block' }}>
            Main Workspace
          </span>

          <NavLink to="/dashboard" style={navItemStyle}>
            <LayoutDashboard style={{ width: '18px', height: '18px' }} />
            Dashboard
          </NavLink>

          <NavLink to="/tasks" style={navItemStyle}>
            <CheckSquare style={{ width: '18px', height: '18px' }} />
            My Tasks
          </NavLink>

          <NavLink to="/tasks/new" style={navItemStyle}>
            <PlusCircle style={{ width: '18px', height: '18px' }} />
            Create Task
          </NavLink>

          <NavLink to="/analytics" style={navItemStyle}>
            <BarChart2 style={{ width: '18px', height: '18px' }} />
            Analytics
          </NavLink>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 8px 8px', display: 'block' }}>
            User Account
          </span>

          <NavLink to="/profile" style={navItemStyle}>
            <User style={{ width: '18px', height: '18px' }} />
            My Profile
          </NavLink>

          <NavLink to="/settings" style={navItemStyle}>
            <Settings style={{ width: '18px', height: '18px' }} />
            Settings
          </NavLink>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <span style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 8px 8px', display: 'block' }}>
                Administrator
              </span>

              <NavLink to="/admin" style={navItemStyle}>
                <Shield style={{ width: '18px', height: '18px', color: '#c084fc' }} />
                Admin Portal
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* User Card & Logout */}
      <div>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#ffffff'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <span className={user?.role === 'admin' ? 'badge badge-warning' : 'badge badge-info'} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <LogOut style={{ width: '16px', height: '16px' }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
