import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from '../TeacherDashboard';

export default function TeacherDashboardView() {
  const { user, setUser, logout } = useAuth();
  return (
    <TeacherDashboard
      user={user}
      onLogout={logout}
      onUpdate={(updatedUser) => setUser(updatedUser)}
    />
  );
}
