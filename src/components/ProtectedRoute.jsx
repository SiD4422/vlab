import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute
 * 
 * Wraps a route and enforces:
 *   1. Wait for authReady (both Firebase auth + Firestore role fetch complete)
 *   2. Redirect to "/" if not logged in
 *   3. Redirect to "/" if logged in but wrong role
 * 
 * Usage:
 *   <ProtectedRoute role="teacher"><TeacherDashboardView /></ProtectedRoute>
 *   <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ role, children }) {
  const { user, role: userRole, authReady } = useAuth();

  // State 1: Auth + role not yet resolved — show a full-screen spinner
  // Do NOT redirect here — it would flash wrong content
  if (!authReady) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f1724',
        flexDirection: 'column',
        gap: 16,
      }}>
        <Loader2
          size={36}
          color="#0d9488"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>
          Verifying session…
        </div>
      </div>
    );
  }

  // State 2: Not logged in at all
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // State 3: Logged in but wrong role (e.g. student tries /teacher)
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // State 4: All checks passed — render the protected page
  return children;
}
