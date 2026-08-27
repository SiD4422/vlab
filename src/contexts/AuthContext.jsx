import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize state from cache to enable instant loading (Optimistic UI)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('vlab_user')) || null);
  const [role, setRole] = useState(() => localStorage.getItem('vlab_role') || null);
  const [enrolledClass, setEnrolledClass] = useState(() => JSON.parse(localStorage.getItem('vlab_class')) || null);
  // Persist experiment progress across page refreshes
  const [completedExperiments, setCompletedExperiments] = useState(
    () => JSON.parse(localStorage.getItem('vlab_completed')) || []
  );

  // If we have a cached user, we can consider auth "ready" immediately
  const [authReady, setAuthReady] = useState(() => !!localStorage.getItem('vlab_user'));

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const skeletonUser = {
          uid:    firebaseUser.uid,
          email:  firebaseUser.email,
          name:   firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          role:   'student',
        };

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let resolvedRole = 'student';
          let resolvedName = skeletonUser.name;
          let resolvedAvatar = skeletonUser.avatar;

          if (userDoc.exists()) {
            const data = userDoc.data();
            resolvedRole   = data.role   || 'student';
            resolvedName   = data.name   || resolvedName;
            resolvedAvatar = data.avatar || resolvedAvatar;
          }

          const fullUser = { ...skeletonUser, role: resolvedRole, name: resolvedName, avatar: resolvedAvatar };

          setUser(fullUser);
          setRole(resolvedRole);
          localStorage.setItem('vlab_user', JSON.stringify(fullUser));
          localStorage.setItem('vlab_role', resolvedRole);

          // Fetch completed experiments from Firestore
          try {
            const completed = userDoc.exists() ? (userDoc.data().completedExperiments || []) : [];
            setCompletedExperiments(completed);
            localStorage.setItem('vlab_completed', JSON.stringify(completed));
          } catch (e) {
            console.error('Error fetching completedExperiments:', e);
          }

          if (resolvedRole === 'student') {
            try {
              const classQ    = query(collection(db, 'classes'), where('studentUids', 'array-contains', firebaseUser.uid));
              const classSnap = await getDocs(classQ);
              if (!classSnap.empty) {
                const classData = { id: classSnap.docs[0].id, ...classSnap.docs[0].data() };
                setEnrolledClass(classData);
                localStorage.setItem('vlab_class', JSON.stringify(classData));
              } else if (firebaseUser.email) {
                // Auto-enroll via CSV Bulk Upload (pendingEmails)
                const pendingQ = query(collection(db, 'classes'), where('pendingEmails', 'array-contains', firebaseUser.email.toLowerCase()));
                const pendingSnap = await getDocs(pendingQ);
                
                if (!pendingSnap.empty) {
                  const targetClassDoc = pendingSnap.docs[0];
                  const targetClass = targetClassDoc.data();
                  
                  // Add user to studentUids and remove from pendingEmails
                  const updatedUids = [...(targetClass.studentUids || []), firebaseUser.uid];
                  const updatedPending = (targetClass.pendingEmails || []).filter(e => e !== firebaseUser.email.toLowerCase());
                  
                  // Also update visual roster status
                  const updatedRoster = (targetClass.roster || []).map(r => 
                    r.email.toLowerCase() === firebaseUser.email.toLowerCase() 
                      ? { ...r, status: 'Joined' } 
                      : r
                  );

                  // Using dynamic import of updateDoc to avoid needing to mess with top-level imports if it wasn't exported here
                  const { updateDoc } = await import('firebase/firestore');
                  await updateDoc(targetClassDoc.ref, {
                    studentUids: updatedUids,
                    pendingEmails: updatedPending,
                    roster: updatedRoster
                  });

                  const classData = { id: targetClassDoc.id, ...targetClass, studentUids: updatedUids };
                  setEnrolledClass(classData);
                  localStorage.setItem('vlab_class', JSON.stringify(classData));
                }
              }
            } catch (e) {
              console.error('Error fetching enrolled class:', e);
            }
          }
        } catch (e) {
          console.error('Error fetching user profile:', e);
          setUser(skeletonUser);
          setRole('student');
        }
      } else {
        setUser(null);
        setRole(null);
        setEnrolledClass(null);
        setCompletedExperiments([]);
        localStorage.removeItem('vlab_user');
        localStorage.removeItem('vlab_role');
        localStorage.removeItem('vlab_class');
        localStorage.removeItem('vlab_completed');
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  // Persists a completed experiment ID to both state, localStorage, and Firestore
  const markExperimentComplete = async (experimentId) => {
    if (completedExperiments.includes(experimentId)) return;
    const updated = [...completedExperiments, experimentId];
    setCompletedExperiments(updated);
    localStorage.setItem('vlab_completed', JSON.stringify(updated));
    if (user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          completedExperiments: arrayUnion(experimentId)
        });
      } catch (e) {
        console.error('Failed to persist completed experiment:', e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, authReady, enrolledClass, setEnrolledClass, logout, completedExperiments, markExperimentComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
