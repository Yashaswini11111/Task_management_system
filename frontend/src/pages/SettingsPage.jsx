import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import { Settings, Bell, Palette, Globe, Shield, Save } from 'lucide-react';

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [themeMode, setThemeMode] = useState('dark');
  const { addToast } = useToast();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Preferences saved successfully!', 'success');
  };

  return (
    <div>
      <Navbar title="System Settings" />

      <div className="glass-panel" style={{ padding: '28px', maxWidth: '700px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Settings style={{ color: 'var(--primary-accent)', width: '26px', height: '26px' }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Application Preferences</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customize your workspace notifications and interface appearance</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell style={{ width: '18px', height: '18px', color: '#818cf8' }} /> Notifications & Alerts
            </h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email Deadline Reminders</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Receive email alerts 24 hours prior to task due dates</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Browser Toast Notifications</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Show popup toasts for task creation and status changes</p>
              </div>
              <input
                type="checkbox"
                checked={taskReminders}
                onChange={(e) => setTaskReminders(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette style={{ width: '18px', height: '18px', color: '#c084fc' }} /> UI Theme & Aesthetics
            </h4>

            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value)}
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
              <option value="dark">Dark Glassmorphism (Default)</option>
              <option value="midnight">Deep Midnight Blue</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            <Save style={{ width: '16px', height: '16px' }} /> Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
