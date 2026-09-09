import { useAuth } from '../contexts/AuthContext';
import { Clock, LogOut, Mail, ShieldCheck } from 'lucide-react';

export default function PendingApproval() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      fontFamily: "'Inter', sans-serif", padding: 24,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: '48px 40px', maxWidth: 480, width: '100%',
        textAlign: 'center', backdropFilter: 'blur(12px)',
      }}>
        {/* Animated clock icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))',
          border: '2px solid rgba(251,191,36,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px', animation: 'pulse 2s ease-in-out infinite',
        }}>
          <Clock size={36} color="#fbbf24" />
        </div>

        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 }}>
          Account Pending Approval
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          Your teacher account has been created successfully. An admin teacher will review and approve
          your registration shortly.
        </p>

        {/* User info card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '16px 20px',
          marginBottom: 28, textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {user?.avatar && (
              <img src={user.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(56,189,248,0.4)' }} />
            )}
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
            <ShieldCheck size={14} />
            Status: Pending Admin Approval
          </div>
        </div>

        {/* What to expect */}
        <div style={{
          background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 28, textAlign: 'left',
        }}>
          <div style={{ color: '#38bdf8', fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mail size={13} /> What happens next?
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.9 }}>
            <li>An admin teacher will review your registration</li>
            <li>Once approved, log in again to access the dashboard</li>
            <li>Contact your department coordinator if urgent</li>
          </ul>
        </div>

        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
            width: '100%', padding: '12px 20px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
            color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
        >
          <LogOut size={16} />
          Sign out and try a different account
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
      `}</style>
    </div>
  );
}
