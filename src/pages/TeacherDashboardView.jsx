import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from '../TeacherDashboard';
import ExperimentSession from './ExperimentSession';
import { EXPERIMENTS } from '../data/experiments';

export default function TeacherDashboardView() {
  const { user, setUser, logout } = useAuth();

  const params = new URLSearchParams(window.location.search);
  const isBroadcast = params.get('broadcast') === 'true';
  const expId = params.get('expId');
  const classId = params.get('classId');

  if (isBroadcast && expId && classId) {
    const exp = EXPERIMENTS.find(e => e.id === expId);
    return (
      <ExperimentSession 
         exp={exp} 
         student={user}
         classId={classId}
         isBroadcaster={true}
         onBack={() => { window.location.href = '/teacher'; }}
      />
    );
  }

  return (
    <TeacherDashboard
      user={user}
      onLogout={logout}
      onUpdate={(updatedUser) => setUser(updatedUser)}
    />
  );
}
