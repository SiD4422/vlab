import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { ADMIN_TEACHER_EMAILS } from '../config/admins';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('vlab_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('vlab_role'));
  const [authReady, setAuthReady] = useState(() => {
    return !!localStorage.getItem('vlab_user');
  });
  const [enrolledClass, setEnrolledClass] = useState(() => {
    const cached = localStorage.getItem('vlab_class');
    return cached ? JSON.parse(cached) : null;
  });
  const [completedExperiments, setCompletedExperiments] = useState(() => {
    const cached = localStorage.getItem('vlab_completed');
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    if (enrolledClass) localStorage.setItem('vlab_class', JSON.stringify(enrolledClass));
    else localStorage.removeItem('vlab_class');
  }, [enrolledClass]);

  useEffect(() => {
    localStorage.setItem('vlab_completed', JSON.stringify(completedExperiments));
  }, [completedExperiments]);

  useEffect(() => {
    let unsubDoc = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (firebaseUser) {
        const skeletonUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL || null,
          emailVerified: firebaseUser.emailVerified,
          org_id: 'srm_univ', // default; will be overwritten by Firestore data if present
        };

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        unsubDoc = onSnapshot(userDocRef, async (userDoc) => {
          let resolvedRole = 'student';
          let fullUser = { ...skeletonUser };
          
          if (userDoc.exists()) {
            const data = userDoc.data();

            // Rejected teacher: sign them out cleanly, leave a message for LoginScreen
            if (data.status === 'rejected') {
              localStorage.setItem('vlab_auth_error', 'Your teacher registration was declined. Please contact your administrator.');
              await signOut(auth);
              setAuthReady(true);
              return;
            }

            resolvedRole = data.role || 'student';
            Object.assign(fullUser, data);
            if (!fullUser.org_id) fullUser.org_id = 'srm_univ';

          } else {
            // No Firestore doc: user is mid-registration
            resolvedRole = null;
          }
          
          setUser(fullUser);
          setRole(resolvedRole);
          localStorage.setItem('vlab_user', JSON.stringify(fullUser));
          localStorage.setItem('vlab_role', resolvedRole);

          // Fetch enrolled class if present in Firestore
          if (fullUser.lastJoinedClassId) {
            try {
              const classDoc = await getDoc(doc(db, 'classes', fullUser.lastJoinedClassId));
              if (classDoc.exists()) {
                const classData = { id: classDoc.id, ...classDoc.data() };
                setEnrolledClass(classData);
                localStorage.setItem('vlab_class', JSON.stringify(classData));
              }
            } catch (err) {
              console.error('Failed to fetch enrolled class on login:', err);
            }
          }

          try {
            const completed = fullUser.completedExperiments || [];
            setCompletedExperiments(completed);
            localStorage.setItem('vlab_completed', JSON.stringify(completed));
          } catch (e) {
            console.error('Error fetching completedExperiments:', e);
          }
          
          setAuthReady(true);
        }, (err) => {
          console.error('Error in onSnapshot user profile:', err);
          setUser(null);
          setRole(null);
          localStorage.removeItem('vlab_user');
          localStorage.removeItem('vlab_role');
          setAuthReady(true);
        });

      } else {
        setUser(null);
        setRole(null);
        setEnrolledClass(null);
        setCompletedExperiments([]);
        localStorage.removeItem('vlab_user');
        localStorage.removeItem('vlab_role');
        localStorage.removeItem('vlab_class');
        localStorage.removeItem('vlab_completed');
        setAuthReady(true);
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch(err) {
      console.warn("Firebase signout error:", err);
    }
    setUser(null);
    setRole(null);
    setEnrolledClass(null);
    setCompletedExperiments([]);
    localStorage.clear();
    window.location.href = "/";
  };

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
    <AuthContext.Provider value={{ user, setUser, role, setRole, authReady, enrolledClass, setEnrolledClass, logout, completedExperiments, markExperimentComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}