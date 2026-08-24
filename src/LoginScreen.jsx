import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, googleProvider, db } from './services/firebase';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student'); // Default role
  const [registrationNo, setRegistrationNo] = useState('');
  const [department, setDepartment] = useState('');
  const [section, setSection] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        
        // ── Validate invite code & resolve org_id ──────────────────────────
        const trimmedCode = inviteCode.trim().toUpperCase();
        let resolvedOrgId = 'srm_univ'; // Fallback for SRM users without a code

        if (trimmedCode) {
          const codeRef = doc(db, 'invite_codes', trimmedCode);
          let codeData;
          try {
            // Atomic transaction: validates + increments in one operation
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

        // Write user document to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: fullName,
          email: userCredential.user.email,
          role: role,
          org_id: resolvedOrgId,
          ...(role === 'student' ? {
            registrationNo,
            department,
            section
          } : {
            department
          })
        });

        // Navigate — AuthContext onAuthStateChanged will pick up the new user
        navigate(role === 'teacher' ? '/teacher' : '/student');
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Fetch role from Firestore to navigate to the right dashboard
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const userRole = userDoc.exists() ? userDoc.data().role : 'student';
        // Navigate — AuthContext onAuthStateChanged will populate the user state
        navigate(userRole === 'teacher' ? '/teacher' : '/student');
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Check if user document exists
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let currentRole = role;
      if (!userDoc.exists()) {
        // If they don't exist, create them with the currently selected role
        // For Google Auth, if they sign in without clicking sign up first, they default to student unless we add a role picker
        // We will just use the currently selected `role` state
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          email: userCredential.user.email,
          role: currentRole,
          ...(currentRole === 'student' ? {
            registrationNo: '',
            department: '',
            section: ''
          } : {
            department: ''
          })
        });
      } else {
        currentRole = userDoc.data().role;
      }

      // Navigate — AuthContext onAuthStateChanged will populate the user state
      navigate(currentRole === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'var(--ink)', overflow: 'hidden' }}>
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="login-bg-video"
      >
        <source src="/bg-video-trimmed.mp4" type="video/mp4" />
      </video>
      <div className="login-bg-overlay"></div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <div className="login-container">
          <div className="login-heading">{isSignUp ? "Create Account" : "Sign In"}</div>
          
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
                color: role === 'student' ? '#0f766e' : '#64748b',
                fontWeight: 700, fontSize: 14, transition: 'all 0.3s', position: 'relative', zIndex: 1
              }}>
              I am a Student
            </button>
            <button 
              type="button"
              onClick={() => setRole('teacher')}
              style={{ 
                flex: 1, padding: '10px 0', borderRadius: 999, cursor: 'pointer', border: 'none', background: 'transparent',
                color: role === 'teacher' ? '#0f766e' : '#64748b',
                fontWeight: 700, fontSize: 14, transition: 'all 0.3s', position: 'relative', zIndex: 1
              }}>
              I am a Teacher
            </button>
          </div>

          {error && <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 15, textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="login-input" required />
          )}
          {isSignUp && role === 'student' && (
            <>
              <input type="text" placeholder="Registration Number" value={registrationNo} onChange={e => setRegistrationNo(e.target.value)} className="login-input" required />
              <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} className="login-input" required />
              <input type="text" placeholder="Section" value={section} onChange={e => setSection(e.target.value)} className="login-input" required />
            </>
          )}
          {isSignUp && role === 'teacher' && (
            <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} className="login-input" required />
          )}
          {isSignUp && (
            <input
              type="text"
              placeholder="Invite Code (required for other colleges)"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value.toUpperCase())}
              className="login-input"
              style={{ letterSpacing: inviteCode ? 3 : 0, fontFamily: inviteCode ? 'monospace' : 'inherit' }}
            />
          )}
          <input 
            required 
            className="login-input" 
            type="email" 
            name="email" 
            id="email" 
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            required 
            className="login-input" 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Password"
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isSignUp && <span className="forgot-password"><a href="#">Forgot Password ?</a></span>}
          <input className="login-button" type="submit" value={loading ? "Authenticating..." : (isSignUp ? "Sign Up" : "Sign In")} disabled={loading} />
        </form>
          <div className="social-account-container">
            <span className="title">Or {isSignUp ? "Sign up" : "Sign in"} with</span>
            <div className="social-accounts">
              <button type="button" aria-label="Sign in with Google" onClick={handleGoogleSignIn} className="social-button google">
                <svg className="svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" /><path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" /><path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" /><path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" /></svg>
              </button>
              <button aria-label="Sign in with Apple" className="social-button apple">
                <svg className="svg" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
              </button>
              <button aria-label="Sign in with Twitter" className="social-button twitter">
                <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div style={{ marginTop: 25, textAlign: 'center', fontSize: 14 }}>
            <span style={{ color: '#64748b', fontWeight: 500 }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
              style={{ background: 'none', border: 'none', color: '#0d9488', fontWeight: 700, marginLeft: 8, cursor: 'pointer', fontSize: 14 }}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
          
          <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid rgba(148, 163, 184, 0.2)', textAlign: 'center' }}>
            <button 
              type="button" 
              onClick={() => navigate('/pricing')}
              style={{ background: 'rgba(15, 118, 110, 0.1)', border: '1px solid rgba(15, 118, 110, 0.2)', color: '#0f766e', fontWeight: 700, borderRadius: 999, padding: '8px 20px', cursor: 'pointer', fontSize: 12, transition: 'all 0.2s', letterSpacing: 0.5 }}
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
