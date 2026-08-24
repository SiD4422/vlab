import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import LoginScreen from "./LoginScreen";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-load heavy route components — each becomes a separate JS chunk
const TeacherDashboardView = lazy(() => import("./pages/TeacherDashboardView"));
const StudentApp = lazy(() => import("./pages/StudentApp"));
const About = lazy(() => import("./pages/About"));
const SuperAdminDashboard = lazy(() => import("./pages/SuperAdminDashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));

/* ---------------------------------------------------------------
   DESIGN TOKENS — circuit-board palette: ink navy shell, copper
   accent (component/trace color), teal secondary, warm paper canvas
--------------------------------------------------------------- */
export const C = {
  shell: "var(--shell)",
  shellSoft: "var(--shellSoft)",
  canvas: "var(--canvas)",
  card: "var(--card)",
  copper: "var(--copper)",
  copperDark: "var(--copperDark)",
  teal: "var(--teal)",
  ink: "var(--ink)",
  muted: "var(--muted)",
  border: "var(--border)",
};

function FullScreenSpinner() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#0f1724', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={36} color="#0d9488" style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Loading V-Lab…</div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ROUTER SHELL — the real default export
   Replaces the old conditional render (if !user / if teacher / else student)
   with proper react-router-dom routes + ProtectedRoute guards
--------------------------------------------------------------- */
export default function App() {
  const { user, role, authReady } = useAuth();

  // While Firebase + Firestore role are resolving, show a full-screen spinner.
  // This prevents ANY flash of wrong content.
  if (!authReady) {
    return <FullScreenSpinner />;
  }

  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <Routes>
        {/* Public: Login page */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={role === 'teacher' ? '/teacher' : '/student'} replace />
              : <LoginScreen />
          }
        />

        {/* Protected: Student app shell */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentApp />
            </ProtectedRoute>
          }
        />

        {/* Protected: Teacher dashboard */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardView />
            </ProtectedRoute>
          }
        />

        {/* Public: About page */}
        <Route path="/about" element={<About />} />

        {/* Public: Pricing page */}
        <Route path="/pricing" element={<Pricing />} />

        {/* Super Admin: protected inside the component itself by UID check */}
        <Route path="/admin" element={user ? <SuperAdminDashboard /> : <Navigate to="/" replace />} />

        {/* Catch-all: redirect to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
