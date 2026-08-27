import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, googleProvider, db } from './services/firebase';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase } from 'lucide-react';
import './LoginScreen.css';

// Inline spinner SVG for the Google button loading state
const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
    <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="3" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default function LoginScreen() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [registrationNo, setRegistrationNo] = useState('');
  const [department, setDepartment] = useState('');
  const [section, setSection] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleGoogleSignIn = async () => {
    if (isSignUp) {
      if (role === 'student' && (!registrationNo || !department || !section)) {
        setError('Please fill in your Registration No, Department, and Section to create your student profile.');
        return;
      }
      if (role === 'teacher' && !department) {
        setError('Please fill in your Department to create your teacher profile.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let currentRole = role;

      if (!userDoc.exists()) {
        if (!isSignUp) {
          await signOut(auth);
          setError("No V-Lab profile found for this Google account. Please click 'Sign Up' below to create one.");
          setLoading(false);
          return;
        }

        const trimmedCode = inviteCode.trim().toUpperCase();
        let resolvedOrgId = 'srm_univ';

        if (trimmedCode) {
          const codeRef = doc(db, 'invite_codes', trimmedCode);
          let codeData;
          try {
            await runTransaction(db, async (tx) => {
              const codeSnap = await tx.get(codeRef);
              if (!codeSnap.exists()) throw new Error('Invite code not found.');
              codeData = codeSnap.data();
              if (codeData.revoked) throw new Error('This invite code has been revoked.');
              const expires = codeData.expires_at?.toDate ? codeData.expires_at.toDate() : new Date(codeData.expires_at.seconds * 1000);
              if (expires < new Date()) throw new Error('This invite code has expired.');
              if (codeData.used_count >= codeData.max_uses) throw new Error('This invite code has reached its usage limit.');
              if (codeData.role !== role) throw new Error(`This code is only valid for ${codeData.role}s, not ${role}s.`);
              tx.update(codeRef, { used_count: codeData.used_count + 1 });
            });
            resolvedOrgId = codeData.org_id;
          } catch (txErr) {
            throw new Error(txErr.message);
          }
        }

        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          email: userCredential.user.email,
          role: currentRole,
          org_id: resolvedOrgId,
          ...(currentRole === 'student' ? {
            registrationNo,
            department,
            section
          } : {
            department
          })
        });
      } else {
        currentRole = userDoc.data().role;
      }

      navigate(currentRole === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      console.error("Google Auth Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: "'Inter', sans-serif", background: '#fff' }}>
      
      {/* LEFT PANEL: Branding & Value Prop */}
      <div className="animate-left-panel" style={{ 
        flex: 1.2, 
        background: '#0f172a', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 8%'
      }}>
        {/* Subtle grid background */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5
        }} />
        {/* Glow effect */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)'
        }} />
        
        {/* Logo */}
        <div style={{ position: 'absolute', top: 48, left: '8%', color: '#fff', fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(56,189,248,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          V-Lab Enterprise
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ color: '#fff', fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Empowering the<br/>
            <span style={{ color: '#38bdf8' }}>Next Generation</span><br/>
            of Engineers.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.6, maxWidth: 480, fontWeight: 400 }}>
            Deliver high-fidelity circuit simulations, automated Gemini AI grading, and robust anti-cheat analytics—all securely in your browser.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="animate-right-panel" style={{ 
        flex: 1, 
        background: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          
          <div className="animate-fade-up-1" style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>
              Sign in securely using your university Google account.
            </p>
          </div>
          
          {isSignUp && (
            <div className="animate-fade-up-1" style={{ display: 'flex', background: '#f8fafc', padding: 4, borderRadius: 10, marginBottom: 28, border: '1px solid #e2e8f0' }}>
              <button 
                type="button"
                onClick={() => setRole('student')}
                style={{ 
                  flex: 1, padding: '10px 0', borderRadius: 6, cursor: 'pointer', border: 'none', 
                  background: role === 'student' ? '#fff' : 'transparent',
                  color: role === 'student' ? '#0f172a' : '#64748b', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                  boxShadow: role === 'student' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}>
                <GraduationCap size={16} /> Student
              </button>
              <button 
                type="button"
                onClick={() => setRole('teacher')}
                style={{ 
                  flex: 1, padding: '10px 0', borderRadius: 6, cursor: 'pointer', border: 'none', 
                  background: role === 'teacher' ? '#fff' : 'transparent',
                  color: role === 'teacher' ? '#0f172a' : '#64748b', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                  boxShadow: role === 'teacher' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}>
                <Briefcase size={16} /> Teacher
              </button>
            </div>
          )}

          {error && (
            <div className="animate-fade-up-1" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
        
          <div className="animate-fade-up-2" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {isSignUp && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 4 }}>
                  Profile Details
                </div>
                {role === 'student' && (
                  <>
                    <input type="text" placeholder="Registration Number" value={registrationNo} onChange={e => setRegistrationNo(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e=>e.target.style.borderColor='#38bdf8'} onBlur={e=>e.target.style.borderColor='#cbd5e1'} />
                    <input type="text" placeholder="Department (e.g. ECE)" value={department} onChange={e => setDepartment(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e=>e.target.style.borderColor='#38bdf8'} onBlur={e=>e.target.style.borderColor='#cbd5e1'} />
                    <input type="text" placeholder="Section (e.g. A)" value={section} onChange={e => setSection(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e=>e.target.style.borderColor='#38bdf8'} onBlur={e=>e.target.style.borderColor='#cbd5e1'} />
                  </>
                )}
                {role === 'teacher' && (
                  <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e=>e.target.style.borderColor='#38bdf8'} onBlur={e=>e.target.style.borderColor='#cbd5e1'} />
                )}
                <input
                  type="text"
                  placeholder="Invite Code (Optional)"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', letterSpacing: inviteCode ? 2 : 0, fontFamily: inviteCode ? 'monospace' : 'inherit' }} onFocus={e=>e.target.style.borderColor='#38bdf8'} onBlur={e=>e.target.style.borderColor='#cbd5e1'}
                />
              </div>
            )}

            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: 8, background: '#fff', border: '1px solid #cbd5e1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer',
                fontSize: 15, fontWeight: 600, color: '#0f172a',
                transition: 'all 0.2s', opacity: loading ? 0.7 : 1, marginTop: 8
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              {loading ? (
                <><SpinnerIcon /> Authenticating...</>
              ) : (
                <>
                  <svg viewBox="0 0 48 48" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            
            <div style={{ textAlign: 'center', fontSize: 14, marginTop: 8 }}>
              <span style={{ color: '#64748b' }}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>
              <button 
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 600, cursor: 'pointer', paddingLeft: 6 }}
              >
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </div>
          </div>
          
          <div className="animate-fade-up-3" style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              type="button" 
              onClick={() => navigate('/pricing')}
              style={{ width: '100%', background: 'transparent', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, borderRadius: 8, padding: '10px', cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              Are you an Institution? View Pricing
            </button>
            
            <button 
              type="button"
              onClick={() => navigate('/about')}
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#94a3b8', fontWeight: 500, cursor: 'pointer', fontSize: 13, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#475569'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              Learn more about V-Lab Enterprise
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
