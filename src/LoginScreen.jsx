import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './services/firebase';
import './LoginScreen.css';

export default function LoginScreen({ onLogin }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        
        // Write user document to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: fullName,
          email: userCredential.user.email,
          role: role,
          ...(role === 'student' ? {
            registrationNo,
            department,
            section
          } : {
            department
          })
        });

        onLogin({
          email: userCredential.user.email,
          name: fullName,
          avatar: userCredential.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.email}`,
          uid: userCredential.user.uid,
          role: role
        });
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const userRole = userDoc.exists() ? userDoc.data().role : 'student';

        onLogin({
          email: userCredential.user.email,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          avatar: userCredential.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.email}`,
          uid: userCredential.user.uid,
          role: userRole
        });
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

      onLogin({
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        avatar: userCredential.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.email}`,
        uid: userCredential.user.uid,
        role: currentRole
      });
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
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'center' }}>
            <button 
              type="button"
              onClick={() => setRole('student')}
              style={{ 
                flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', border: '1px solid',
                background: role === 'student' ? 'var(--teal)' : 'var(--canvas)',
                borderColor: role === 'student' ? 'var(--teal)' : 'var(--border)',
                color: role === 'student' ? '#fff' : 'var(--muted)',
                fontWeight: 600, transition: 'all 0.2s'
              }}>
              I am a Student
            </button>
            <button 
              type="button"
              onClick={() => setRole('teacher')}
              style={{ 
                flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', border: '1px solid',
                background: role === 'teacher' ? 'var(--copper)' : 'var(--canvas)',
                borderColor: role === 'teacher' ? 'var(--copper)' : 'var(--border)',
                color: role === 'teacher' ? '#fff' : 'var(--muted)',
                fontWeight: 600, transition: 'all 0.2s'
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
              <button type="button" onClick={handleGoogleSignIn} className="social-button google">
                <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg></button>
              <button className="social-button apple">
                <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                </svg>
              </button>
              <button className="social-button twitter">
                <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div style={{ marginTop: 25, textAlign: 'center', fontSize: 13 }}>
            <span style={{ color: 'var(--muted)' }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
              style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, marginLeft: 6, cursor: 'pointer' }}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
      </div>
      </div>
    </div>
  );
}
