import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [role, setRole]           = useState(null);
  const [enrolledClass, setEnrolledClass] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Step 1: Set a skeleton user immediately so the app knows someone is logged in
        const skeletonUser = {
          uid:    firebaseUser.uid,
          email:  firebaseUser.email,
          name:   firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          role:   'student',
        };

        // Step 2: Fetch role + profile from Firestore
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

          // Step 3: If student, try to fetch enrolled class
          if (resolvedRole === 'student') {
            try {
              const classQ    = query(collection(db, 'classes'), where('studentUids', 'array-contains', firebaseUser.uid));
              const classSnap = await getDocs(classQ);
              if (!classSnap.empty) {
                setEnrolledClass({ id: classSnap.docs[0].id, ...classSnap.docs[0].data() });
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
      }

      // authReady flips ONLY after both auth + role are resolved
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
