import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import LoginScreen from "./LoginScreen";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PendingApproval from "./pages/PendingApproval";

// Lazy-load heavy route components — each becomes a separate JS chunk
const TeacherDashboardView = lazy(() => import("./pages/TeacherDashboardView"));
const StudentApp = lazy(() => import("./pages/StudentApp"));
const About = lazy(() => import("./pages/About"));
const SuperAdminDashboard = lazy(() => import("./pages/SuperAdminDashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));

/* ---------------------------------------------------------------
   DESIGN TOKENS — circuit-board palette
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

export default function App() {
  const { user, role, authReady } = useAuth();

  if (!authReady) return <FullScreenSpinner />;

  const isTeacher = role === 'teacher' || role === 'admin_teacher';

  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <Routes>
        {/* Public: Login page */}
        <Route
          path="/"
          element={
            (user && role !== null)
              ? (user.status === 'pending'
                  ? <Navigate to="/pending-approval" replace />
                  : <Navigate to={isTeacher ? '/teacher' : '/student'} replace />)
              : <LoginScreen />
          }
        />

        {/* Pending approval screen for unreviewed teachers */}
        <Route
          path="/pending-approval"
          element={user ? <PendingApproval /> : <Navigate to="/" replace />}
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

        {/* Protected: Teacher dashboard (also admin_teacher) */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardView />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin" element={user ? <SuperAdminDashboard /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
