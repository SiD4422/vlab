import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, googleProvider, db } from './services/firebase';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase } from 'lucide-react';
import './LoginScreen.css';

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
    <div style={{ position: 'relative', display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'var(--ink)', overflow: 'hidden' }}>
      <video autoPlay loop muted playsInline className="login-bg-video">
        <source src="/bg-video-trimmed.mp4" type="video/mp4" />
      </video>
      <div className="login-bg-overlay"></div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <div className="login-container" style={{ padding: '40px', maxWidth: 450 }}>
          <div className="login-heading" style={{ marginBottom: 12 }}>{isSignUp ? "Create Account" : "Welcome Back"}</div>
          <div style={{ textAlign: 'center', color: '#64748b', marginBottom: 32, fontSize: 14 }}>
            Sign in securely using your university Google Account.
          </div>
          
          {isSignUp && (
            <div style={{ position: 'relative', display: 'flex', background: 'rgba(148, 163, 184, 0.1)', padding: 4, borderRadius: 999, marginBottom: 24, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ 
                position: 'absolute', top: 4, bottom: 4, left: role === 'student' ? 4 : '50%', width: 'calc(50% - 4px)', 
                background: '#fff', borderRadius: 999, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)'
              }} />
              <button 
                type="button"
                onClick={() => setRole('student')}
                style={{ 
                  flex: 1, padding: '10px 0', borderRadius: 999, cursor: 'pointer', border: 'none', background: 'transparent',
                  color: role === 'student' ? '#0f766e' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontWeight: 700, fontSize: 14, transition: 'all 0.3s', position: 'relative', zIndex: 1
                }}>
                <GraduationCap size={16} /> Student
              </button>
              <button 
                type="button"
                onClick={() => setRole('teacher')}
                style={{ 
                  flex: 1, padding: '10px 0', borderRadius: 999, cursor: 'pointer', border: 'none', background: 'transparent',
                  color: role === 'teacher' ? '#0f766e' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontWeight: 700, fontSize: 14, transition: 'all 0.3s', position: 'relative', zIndex: 1
                }}>
                <Briefcase size={16} /> Teacher
              </button>
            </div>
          )}

          {error && <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 24, textAlign: 'center' }}>{error}</div>}
        
          <div className="login-form">
            {isSignUp && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>Registration Details:</div>
                {role === 'student' && (
                  <>
                    <input type="text" placeholder="Registration Number" value={registrationNo} onChange={e => setRegistrationNo(e.target.value)} className="login-input" />
                    <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} className="login-input" />
                    <input type="text" placeholder="Section" value={section} onChange={e => setSection(e.target.value)} className="login-input" />
                  </>
                )}
                {role === 'teacher' && (
                  <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} className="login-input" />
                )}
                <input
                  type="text"
                  placeholder="Invite Code (Optional)"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase())}
                  className="login-input"
                  style={{ letterSpacing: inviteCode ? 3 : 0, fontFamily: inviteCode ? 'monospace' : 'inherit' }}
                />
              </div>
            )}
            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer',
                fontSize: 16, fontWeight: 700, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s', opacity: loading ? 0.7 : 1, marginBottom: 24
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
            >
              <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
                <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
                <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
                <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
              </svg>
              {loading ? "Authenticating..." : "Continue with Google"}
            </button>
            <div style={{ marginTop: 25, textAlign: 'center', fontSize: 14, marginBottom: 20 }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>
              <button 
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                style={{ background: 'none', border: 'none', color: '#0f766e', fontWeight: 800, cursor: 'pointer', paddingLeft: 8 }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => navigate('/pricing')}
              style={{ width: '100%', background: 'rgba(15, 118, 110, 0.1)', border: '1px solid rgba(15, 118, 110, 0.2)', color: '#0f766e', fontWeight: 700, borderRadius: 999, padding: '8px 20px', cursor: 'pointer', fontSize: 12, transition: 'all 0.2s', letterSpacing: 0.5 }}
            >
              Are you an Institution? View Pricing
            </button>
          </div>
          <div style={{ marginTop: 20, textAlign: 'center', borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: 16 }}>
            <button 
              type="button"
              onClick={() => navigate('/about')}
              style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 500, cursor: 'pointer', fontSize: 13, transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
            >
              Learn more about V-Lab
            </button>
          </div>
      </div>
      </div>
    </div>
  );
}
