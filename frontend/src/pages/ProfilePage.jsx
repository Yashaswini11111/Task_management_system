import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Shield, Key, Save, Lock } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile(name, email);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New password and confirm password do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters long', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      addToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div>
      <Navbar title="My Profile Settings" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* User Card & General Information */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 auto 12px'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            <div style={{ marginTop: '10px' }}>
              <span className={user?.role === 'admin' ? 'badge badge-warning' : 'badge badge-info'}>
                Role: {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Personal Details</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={updatingProfile} style={{ width: '100%', justifyContent: 'center' }}>
              <Save style={{ width: '16px', height: '16px' }} />
              {updatingProfile ? 'Saving...' : 'Update Details'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Key style={{ color: '#c084fc', width: '22px', height: '22px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Security & Password</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            All passwords are protected using bcrypt hashing algorithms
          </p>

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--bg-card-border)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={updatingPassword} style={{ width: '100%', justifyContent: 'center' }}>
              <Lock style={{ width: '16px', height: '16px' }} />
              {updatingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
