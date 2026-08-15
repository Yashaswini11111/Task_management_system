import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, ShieldCheck, CheckCircle2, Zap, BarChart3, Users, Lock, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Layers style={{ color: '#ffffff', width: '22px', height: '22px' }} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">
            TaskFlow
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
            Get Started <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '60px 20px 80px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '9999px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
          <Zap style={{ width: '16px', height: '16px' }} /> Enterprise MERN Stack Task Engine
        </div>

        <h1 style={{ fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }} className="gradient-text">
          Master Your Workflow with Intelligent Task Management
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '36px' }}>
          TaskFlow gives individuals and organizations complete clarity over project deadlines, task analytics, priority matrices, and admin oversight.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1rem' }}>
            Access Demo Accounts <ChevronRight style={{ width: '18px', height: '18px' }} />
          </Link>
          <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1rem' }}>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div className="grid-cards">
          <div className="glass-panel" style={{ padding: '28px' }}>
            <BarChart3 style={{ color: '#818cf8', width: '32px', height: '32px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Real-time Analytics</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Track completed tasks, in-progress workloads, and productivity rates dynamically using visual charts.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <Lock style={{ color: '#c084fc', width: '32px', height: '32px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>JWT & Bcrypt Security</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Enterprise-grade authentication with salted password hashing and role-based route permissions.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <Users style={{ color: '#34d399', width: '32px', height: '32px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Admin Management</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Dedicated administrative portal to manage users, override system-wide tasks, and audit activity.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '30px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© TaskFlow Task Management System • Built with React, Express & MongoDB</p>
      </footer>
    </div>
  );
};

export default LandingPage;
