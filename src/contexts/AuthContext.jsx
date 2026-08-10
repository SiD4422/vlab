import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize state from cache to enable instant loading (Optimistic UI)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('vlab_user')) || null);
  const [role, setRole] = useState(() => localStorage.getItem('vlab_role') || null);
  const [enrolledClass, setEnrolledClass] = useState(() => JSON.parse(localStorage.getItem('vlab_class')) || null);
  
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

          if (resolvedRole === 'student') {
            try {
              const classQ    = query(collection(db, 'classes'), where('studentUids', 'array-contains', firebaseUser.uid));
              const classSnap = await getDocs(classQ);
              if (!classSnap.empty) {
                const classData = { id: classSnap.docs[0].id, ...classSnap.docs[0].data() };
                setEnrolledClass(classData);
                localStorage.setItem('vlab_class', JSON.stringify(classData));
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
        localStorage.removeItem('vlab_user');
        localStorage.removeItem('vlab_role');
        localStorage.removeItem('vlab_class');
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, setUser, role, authReady, enrolledClass, setEnrolledClass, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
