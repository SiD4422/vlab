import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, fetchSignInMethodsForEmail, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, googleProvider, microsoftProvider } from './services/firebase';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ADMIN_TEACHER_EMAILS, ALLOWED_EMAIL_DOMAIN } from './config/admins';
import { Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const { setRole: setCtxRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Read any deferred error message set by AuthContext (e.g. rejected mid-session)
  useEffect(() => {
    const deferred = localStorage.getItem('vlab_auth_error');
    if (deferred) {
      setError(deferred);
      localStorage.removeItem('vlab_auth_error');
    }
  }, []);

  // Google "Complete Profile" pending state
  const [googlePendingCred, setGooglePendingCred] = useState(null);

  // Local role selection state - defaults to 'student' so it is never null
  const [selectedRole, setSelectedRole] = useState('student');

  // Manual Auth State
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [regNoInput, setRegNoInput] = useState('');
  const [deptInput, setDeptInput] = useState('');
  const [sectionInput, setSectionInput] = useState('');

  const processUserAuth = async (userCredential, extraDetails = {}) => {
    const email = userCredential.user.email;
    const normalizedEmail = email.toLowerCase();
    const userDocRef = doc(db, 'users', userCredential.user.uid);

    // ── Domain / whitelist enforcement ─────────────────────────────────────
    const isAdminWhitelisted = ADMIN_TEACHER_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail);
    if (!isAdminWhitelisted && !normalizedEmail.endsWith(ALLOWED_EMAIL_DOMAIN.toLowerCase()) && !normalizedEmail.endsWith('@gmail.com')) {
      // Delete the Firebase Auth account so it doesn't accumulate as an orphan
      try { await userCredential.user.delete(); } catch (_) { /* best-effort */ }
      await signOut(auth);
      setError(`Only ${ALLOWED_EMAIL_DOMAIN} and @gmail.com accounts are allowed for now.`);
      setLoading(false);
      return;
    }

    let currentRole = extraDetails.role || selectedRole || 'student';
    let existingData = null;

    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        existingData = userDoc.data();
      }
    } catch (docErr) {
      console.warn('Could not read user profile:', docErr);
    }

    if (existingData) {
      // ── Existing user: check account status before routing ────────────────
      if (existingData.status === 'rejected') {
        await signOut(auth);
        setError('Your teacher registration was declined. Please contact your administrator.');
        setLoading(false);
        return;
      }
      if (existingData.status === 'pending') {
        // Keep signed in — App.jsx routes user.status === 'pending' to /pending-approval
        setCtxRole(existingData.role);
        navigate('/pending-approval');
        return;
      }
      // Active existing user: use saved role
      currentRole = existingData.role || currentRole;
    } else {
      // ── New user: create their document ────────────────────────────────────
      // For Google sign-in, pause and show the Complete Profile form
      if (!extraDetails.name && !extraDetails.department) {
        setGooglePendingCred(userCredential);
        setLoading(false);
        return;
      }

      const isAdminTeacher = isAdminWhitelisted;
      const resolvedRole   = isAdminTeacher ? 'admin_teacher' : currentRole;
      const resolvedStatus = isAdminTeacher ? 'active' : 'pending';

      const newUserData = {
        uid: userCredential.user.uid,
        name: extraDetails.name || userCredential.user.displayName || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: resolvedRole,
        status: resolvedStatus,
        org_id: 'srm_univ',
        authProvider: extraDetails.authProvider || userCredential.providerId || (userCredential.user.providerData[0]?.providerId) || 'password',
        detailsFilled: extraDetails.detailsFilled !== undefined ? extraDetails.detailsFilled : false,
        createdAt: new Date().toISOString(),
        ...(extraDetails.department     ? { department: extraDetails.department } : {}),
        ...(extraDetails.registrationNo ? { registrationNo: extraDetails.registrationNo } : {}),
        ...(extraDetails.section        ? { section: extraDetails.section } : {}),
      };

      try {
        await setDoc(userDocRef, newUserData, { merge: true });
      } catch (setErr) {
        console.warn('Failed to create user document:', setErr);
      }

      currentRole = resolvedRole;

      if (resolvedStatus === 'pending') {
        navigate('/pending-approval');
        return;
      }
    }

    setCtxRole(currentRole);
    navigate(['teacher', 'admin_teacher'].includes(currentRole) ? '/teacher' : '/student');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      if (!auth) throw new Error('auth-missing');
      const userCredential = await signInWithPopup(auth, googleProvider);
      await processUserAuth(userCredential);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('Your browser blocked the Google sign-in popup. Please allow popups or use the manual login below.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase: ', ''));
      }
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      if (!auth) throw new Error('auth-missing');
      const userCredential = await signInWithPopup(auth, microsoftProvider);
      await processUserAuth(userCredential);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('Your browser blocked the Microsoft sign-in popup. Please allow popups or use the manual login below.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase: ', ''));
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!emailInput) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const methods = await fetchSignInMethodsForEmail(auth, emailInput);
      if (methods.includes('password')) {
        await sendPasswordResetEmail(auth, emailInput);
        setError('Password reset email sent. Check your inbox.');
      } else if (methods.length > 0) {
        setError(`This email uses ${methods[0]}. You cannot reset a password for a social login.`);
      } else {
        setError('No account found with this email.');
      }
    } catch (err) {
      console.warn(err);
      setError('Failed to send reset email. Make sure the email is correct.');
    }
    setLoading(false);
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (authMode === 'signup') {
      if (!nameInput || !deptInput || (selectedRole === 'student' && (!regNoInput || !sectionInput))) {
        setError("Please fill all the profile details to create an account.");
        setLoading(false);
        return;
      }
    } else {
      // Pre-check for sign-in method to route properly and prevent mismatch errors
      try {
        const methods = await fetchSignInMethodsForEmail(auth, emailInput);
        if (methods.length > 0 && !methods.includes('password')) {
          setError(`This email is registered with ${methods[0]}. Please use the correct sign-in button above.`);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('fetchSignInMethodsForEmail check failed:', err);
      }
    }

    try {
      if (!auth) throw new Error('auth-missing');
      
      let userCredential;
      let extraDetails = {};
      
      if (authMode === 'signup') {
        userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        
        // Send verification email on signup
        try { await sendEmailVerification(userCredential.user); } catch (e) { console.warn(e); }

        extraDetails = {
          name: nameInput,
          department: deptInput,
          registrationNo: regNoInput,
          section: sectionInput,
          detailsFilled: true,
          role: selectedRole,
          authProvider: 'password'
        };
      } else {
        userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      }
      await processUserAuth(userCredential, extraDetails);
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
      setLoading(false);
    }
  };

  // Handles profile completion form for new Google sign-in users
  const handleGoogleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!nameInput || !deptInput || (selectedRole === 'student' && (!regNoInput || !sectionInput))) {
      setError('Please fill all fields to complete your profile.');
      return;
    }
    setLoading(true);
    setError('');
    await processUserAuth(googlePendingCred, {
      name: nameInput,
      department: deptInput,
      registrationNo: regNoInput,
      section: sectionInput,
      detailsFilled: true,
      role: selectedRole,
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#fff', fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      {/* LEFT PANEL */}
      <div className="login-left-panel" style={{ 
        flex: 1.2, 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: 48, left: '8%', color: '#fff', fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(56,189,248,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          V-Lab Enterprise
        </div>

        {/* RIGHT PANEL — Complete Profile overlay for new Google users */}
        {googlePendingCred ? (
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700, marginBottom: 12, letterSpacing: '0.05em' }}>GOOGLE SIGN-IN</div>
            <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
              One last step —<br/>
              <span style={{ color: '#38bdf8' }}>complete your profile.</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6, maxWidth: 440 }}>
              We need a few more details to set up your V-Lab account. This is a one-time step.
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ color: '#fff', fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Empowering the<br/>
            <span style={{ color: '#38bdf8' }}>Next Generation</span><br/>
            of Engineers.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.6, maxWidth: 480 }}>
            Join SRM's premier virtual laboratory platform. Run real-time circuit simulations, analyze data, and prepare for vivas with our AI assistant.
          </p>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {googlePendingCred ? (
            /* ── Complete Profile form (new Google users) ── */
            <div>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Complete Your Profile</h2>
                <p style={{ color: '#64748b', fontSize: 14 }}>Signed in as <b>{googlePendingCred.user.email}</b></p>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 20 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', background: '#f1f5f9', padding: 6, borderRadius: 12, marginBottom: 24 }}>
                {['student', 'teacher'].map(r => (
                  <button key={r} onClick={() => setSelectedRole(r)} style={{ flex: 1, padding: '10px', fontSize: 14, fontWeight: 600, background: selectedRole === r ? '#fff' : 'transparent', color: selectedRole === r ? '#0f172a' : '#64748b', border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: selectedRole === r ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                    {r === 'student' ? "I'm a Student" : "I'm a Teacher"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleGoogleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Full Name', val: nameInput, set: setNameInput, ph: 'John Doe' },
                  ...(selectedRole === 'student' ? [{ label: 'Registration Number', val: regNoInput, set: setRegNoInput, ph: 'RA21110...' }] : []),
                  { label: 'Department', val: deptInput, set: setDeptInput, ph: 'e.g. ECE' },
                  ...(selectedRole === 'student' ? [{ label: 'Section', val: sectionInput, set: setSectionInput, ph: 'e.g. A' }] : []),
                ].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>{label}</label>
                    <input type="text" value={val} onChange={e => { set(e.target.value); setError(''); }} placeholder={ph} required
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: 14 }}
                      onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.background = '#fff'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading} style={{ marginTop: 8, width: '100%', padding: '13px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? <Loader2 size={18} className="spin" /> : 'Save & Enter V-Lab'}
                </button>
              </form>
            </div>
          ) : (
            /* ── Normal login / signup form ── */
            <div>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>Welcome back</h2>
                <p style={{ color: '#64748b', fontSize: 16 }}>Select your role to continue</p>
              </div>

              {/* Role Toggle */}
              <div style={{ display: 'flex', background: '#f1f5f9', padding: 6, borderRadius: 12, marginBottom: 32 }}>
                <button onClick={() => setSelectedRole('student')} style={{ flex: 1, padding: '12px', fontSize: 15, fontWeight: 600, background: selectedRole === 'student' ? '#fff' : 'transparent', color: selectedRole === 'student' ? '#0f172a' : '#64748b', border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: selectedRole === 'student' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                  I'm a Student
                </button>
                <button onClick={() => setSelectedRole('teacher')} style={{ flex: 1, padding: '12px', fontSize: 15, fontWeight: 600, background: selectedRole === 'teacher' ? '#fff' : 'transparent', color: selectedRole === 'teacher' ? '#0f172a' : '#64748b', border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: selectedRole === 'teacher' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                  I'm a Teacher
                </button>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleManualAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                {authMode === 'signup' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>Full Name</label>
                      <input type="text" value={nameInput} onChange={e => { setNameInput(e.target.value); setError(''); }} placeholder="John Doe" required style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: 15, transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }} />
                    </div>
                    {selectedRole === 'student' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>Registration Number</label>
                        <input type="text" value={regNoInput} onChange={e => { setRegNoInput(e.target.value); setError(''); }} placeholder="RA21110..." required style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: 15, transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }} />
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>Department</label>
                      <input type="text" value={deptInput} onChange={e => { setDeptInput(e.target.value); setError(''); }} placeholder="e.g. ECE" required style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: 15, transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }} />
                    </div>
                    {selectedRole === 'student' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>Section</label>
                        <input type="text" value={sectionInput} onChange={e => { setSectionInput(e.target.value); setError(''); }} placeholder="e.g. A" required style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: 15, transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }} />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input type="email" value={emailInput} onChange={e => { 
                      const val = e.target.value; 
                      setEmailInput(val); 
                      setError(''); 
                      if (authMode === 'signup' && !regNoInput && val.includes('@')) {
                        const prefix = val.split('@')[0].toUpperCase();
                        if (prefix.match(/^[A-Z0-9]+$/)) setRegNoInput(prefix);
                      }
                    }} placeholder="you@srmist.edu.in" required style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: 15, transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.15)'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#f8fafc'; }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                    <span>Password</span>
                    {authMode === 'login' && <span onClick={handleForgotPassword} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}>Forgot?</span>}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type="password" value={passwordInput} onChange={e => { setPasswordInput(e.target.value); setError(''); }} placeholder="********" required style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: 15, transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={e => { e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.15)'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; e.target.style.background = '#f8fafc'; }} />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)', transition: 'transform 0.1s, box-shadow 0.2s' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}>
                  {loading ? <Loader2 size={18} className="spin" /> : (authMode === 'login' ? 'Sign In Securely' : 'Create Account')}
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '24px' }}>
                <button onClick={handleGoogleSignIn} disabled={loading} style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '600', color: '#0f172a', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseEnter={e => !loading && (e.currentTarget.style.background = '#f8fafc')} onMouseLeave={e => !loading && (e.currentTarget.style.background = '#fff')}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Sign in with Google
                </button>

                <button onClick={handleMicrosoftSignIn} disabled={loading} style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '600', color: '#0f172a', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseEnter={e => !loading && (e.currentTarget.style.background = '#f8fafc')} onMouseLeave={e => !loading && (e.currentTarget.style.background = '#fff')}>
                  <svg width="20" height="20" viewBox="0 0 21 21"><path fill="#f35325" d="M1 1h9v9H1z"/><path fill="#81bc06" d="M11 1h9v9h-9z"/><path fill="#05a6f0" d="M1 11h9v9H1z"/><path fill="#ffba08" d="M11 11h9v9h-9z"/></svg>
                  Sign in with Microsoft
                </button>
              </div>

              <div style={{ marginTop: 28, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
                {authMode === 'login' ? (
                  <>Don't have an account? <button onClick={() => { setAuthMode('signup'); setError(''); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, fontSize: 14, padding: 0 }}>Sign up</button></>
                ) : (
                  <>Already have an account? <button onClick={() => { setAuthMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, fontSize: 14, padding: 0 }}>Sign in</button></>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}