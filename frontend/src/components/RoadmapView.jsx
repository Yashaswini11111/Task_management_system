import React from 'react';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, Database, Key, Layout, ListTodo, BarChart3, Search, UserCheck, User, Lock, Sparkles, TestTube2, FileText } from 'lucide-react';

const stages = [
  { id: 1, name: 'Stage 1 - Project Setup', desc: 'MERN project structure, Express server, CORS, Dotenv, Health API & Vite setup', status: 'completed', icon: ShieldCheck },
  { id: 2, name: 'Stage 2 - Database Setup', desc: 'MongoDB & Mongoose connection, User and Task schemas with validation', status: 'next', icon: Database },
  { id: 3, name: 'Stage 3 - User Registration & Auth', desc: 'Password hashing with bcrypt, JWT authentication & role-based middleware', status: 'pending', icon: Key },
  { id: 4, name: 'Stage 4 - Task CRUD APIs', desc: 'RESTful endpoints for creating, reading, updating, deleting & status updates', status: 'pending', icon: ListTodo },
  { id: 5, name: 'Stage 5 - Frontend Auth UI', desc: 'Login & Register pages, protected client routes & auth state management', status: 'pending', icon: Lock },
  { id: 6, name: 'Stage 6 - Task Management Frontend', desc: 'Interactive task boards, modals, forms & status updates using Axios', status: 'pending', icon: Layout },
  { id: 7, name: 'Stage 7 - Analytics Dashboard', desc: 'User metrics, task breakdown, high priority tracking & Chart.js integration', status: 'pending', icon: BarChart3 },
  { id: 8, name: 'Stage 8 - Search, Filter & Sort', desc: 'Dynamic query filtering by status, priority, category & multi-column sorting', status: 'pending', icon: Search },
  { id: 9, name: 'Stage 9 - Admin Module', desc: 'Admin dashboard, user management, system-wide task overrides & security', status: 'pending', icon: UserCheck },
  { id: 10, name: 'Stage 10 - User Profile', desc: 'Profile updates, password change with bcrypt verification & token renewal', status: 'pending', icon: User },
  { id: 11, name: 'Stage 11 - Security & Validation', desc: 'Express validator, sanitization, CORS hardening & centralized error handling', status: 'pending', icon: ShieldCheck },
  { id: 12, name: 'Stage 12 - UI/UX Polishing', desc: 'Toast notifications, skeleton loaders, responsive polish & micro-interactions', status: 'pending', icon: Sparkles },
  { id: 13, name: 'Stage 13 - End-to-End Testing', desc: 'Integration test suites, bug fixes, permission validation & workflow checks', status: 'pending', icon: TestTube2 },
  { id: 14, name: 'Stage 14 - Documentation', desc: 'Complete README.md, API specification & architecture walkthroughs', status: 'pending', icon: FileText },
];

const RoadmapView = () => {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '6px' }}>Project Development Roadmap</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          14-Stage Full Stack MERN Internship Roadmap loaded from <code style={{ color: 'var(--primary-accent)' }}>Task_Management_System_Antigravity_Stage_Prompts.docx</code>
        </p>
      </div>

      <div className="grid-cards">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isCompleted = stage.status === 'completed';
          const isNext = stage.status === 'next';

          return (
            <div
              key={stage.id}
              style={{
                background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : isNext ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: isCompleted
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : isNext
                  ? '1px solid rgba(99, 102, 241, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                position: 'relative',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon style={{ color: isCompleted ? '#34d399' : isNext ? '#818cf8' : 'var(--text-muted)', width: '20px', height: '20px' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{stage.name}</span>
                </div>
                {isCompleted ? (
                  <span className="badge badge-success">Done</span>
                ) : isNext ? (
                  <span className="badge badge-warning">Up Next</span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</span>
                )}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{stage.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapView;
