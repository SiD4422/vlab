import React, { useState } from 'react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, User, Hash, GraduationCap, Users } from 'lucide-react';

export default function ProfileOnboardingModal() {
  const { user, setUser } = useAuth();
  
  if (!user || user.detailsFilled === true) return null;

  const [name, setName] = useState(user.name || '');
  const [registrationNo, setRegistrationNo] = useState(user.registrationNo || '');
  const [department, setDepartment] = useState(user.department || '');
  const [section, setSection] = useState(user.section || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Name is required.');
      return;
    }
    if (user.role === 'student' && (!registrationNo || !department || !section)) {
      setError('All fields are required.');
      return;
    }
    if ((user.role === 'teacher' || user.role === 'admin_teacher') && !department) {
      setError('Department is required.');
      return;
    }

    setLoading(true);
    setError('');

    const updates = (user.role === 'student')
      ? { name, registrationNo, regNo: registrationNo, department, dept: department, section, detailsFilled: true }
      : { name, department, dept: department, detailsFilled: true };

    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      // Only dismiss the modal if the DB write succeeded
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('vlab_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError(`Failed to save: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      
      {/* Background Ornaments */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div className="animate-fade-up-1" style={{ background: '#fff', borderRadius: 24, padding: '40px 32px', width: '100%', maxWidth: 440, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <User size={24} color="#0ea5e9" />
        </div>

        <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Complete your profile</h2>
        <p style={{ margin: '0 0 32px', color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>
          Welcome to V-Lab! Let's get your account set up so you can access the dashboard.
        </p>
        
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div style={{ position: 'relative' }}>
            <User size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" placeholder="Full Name" 
              value={name} onChange={e => { setName(e.target.value); setError(''); }} 
              style={{ width: '100%', padding: '14px 16px 14px 42px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} 
              onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.15), inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#f8fafc'; }}
            />
          </div>

          {user.role === 'student' && (
            <div style={{ position: 'relative' }}>
              <Hash size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" placeholder="Registration Number (e.g. RA211104...)" 
                value={registrationNo} onChange={e => { setRegistrationNo(e.target.value); setError(''); }} 
                style={{ width: '100%', padding: '14px 16px 14px 42px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} 
                onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.15), inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <GraduationCap size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" placeholder="Department (e.g. ECE)" 
              value={department} onChange={e => { setDepartment(e.target.value); setError(''); }} 
              style={{ width: '100%', padding: '14px 16px 14px 42px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} 
              onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.15), inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#f8fafc'; }}
            />
          </div>

          {user.role === 'student' && (
            <div style={{ position: 'relative' }}>
              <Users size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" placeholder="Section (e.g. A)" 
                value={section} onChange={e => { setSection(e.target.value); setError(''); }} 
                style={{ width: '100%', padding: '14px 16px 14px 42px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} 
                onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.15), inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            style={{ 
              width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', 
              color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, 
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', 
              alignItems: 'center', gap: 8, marginTop: 12,
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
              transition: 'transform 0.1s, box-shadow 0.2s'
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? <Loader2 size={18} className="spin" /> : 'Launch Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}