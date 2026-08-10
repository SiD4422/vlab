import { Loader2 } from "lucide-react";
import LoginScreen from "./LoginScreen";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherDashboardView from "./pages/TeacherDashboardView";
import StudentApp from "./pages/StudentApp";
import About from "./pages/About";

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
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#0f1724', flexDirection: 'column', gap: 16 }}>
        <Loader2 size={36} color="#0d9488" style={{ animation: 'spin 1s linear infinite' }} />
        <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Loading V-Lab…</div>
      </div>
    );
  }

  return (
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

      {/* Catch-all: redirect to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
