import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NavbarProfile({ onProfileClick }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleProfileClick = () => {
    setIsOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const effectiveRole = role || user.role || 'student';
  const isStudent = effectiveRole === 'student';
  
  const theme = {
    bg: 'rgba(18, 24, 38, 0.95)',
    border: 'rgba(255,255,255,0.1)',
    shadow: '0 20px 40px rgba(0,0,0,0.5)',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    separator: 'rgba(255,255,255,0.08)',
    btnText: '#cbd5e1',
    btnHoverBg: 'rgba(255,255,255,0.06)',
    btnHoverText: '#fff',
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: isOpen ? 'scale(1.05)' : 'scale(1)' }}
      >
        <img 
          src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
          alt="Profile" 
          style={{ width: 40, height: 40, borderRadius: '50%', border: isStudent ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(99,102,241,0.5)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
        />
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 230, 
          background: theme.bg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 20, border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          padding: 16, zIndex: 1000, color: theme.text, display: 'flex', flexDirection: 'column'
        }}>
          {/* Header Area */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <img 
              src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
              alt="Profile" 
              style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${theme.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} 
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</div>
              <div style={{ display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, padding: '2px 8px', borderRadius: 12, background: isStudent ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: isStudent ? '#38bdf8' : '#fbbf24', border: isStudent ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)' }}>
                {user.role === 'admin_teacher' ? 'Admin' : user.role || 'Student'}
              </div>
            </div>
          </div>
          
          <div style={{ height: 1, background: theme.separator, margin: '0 -16px 16px -16px' }} />

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button 
              onClick={handleProfileClick}
              style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: '1px solid transparent', borderRadius: 12, color: theme.btnText, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = theme.btnHoverBg; e.currentTarget.style.color = theme.btnHoverText; e.currentTarget.style.borderColor = theme.border; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.btnText; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <User size={18} /> My Profile
            </button>

            <button 
              onClick={() => { setIsOpen(false); logout(); }}
              style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: '1px solid transparent', borderRadius: 12, color: '#f87171', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}