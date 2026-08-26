import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

let app;
let authService;
let googleProviderService;
let firestoreDb;
let realtimeDb;

try {
  app = initializeApp(firebaseConfig);
  authService = getAuth(app);
  googleProviderService = new GoogleAuthProvider();
  googleProviderService.setCustomParameters({ prompt: 'select_account' });
  realtimeDb = getDatabase(app);
  
  // Force long-polling to bypass WebSocket blocks (common cause of infinite hangs)
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const auth = authService;
export const googleProvider = googleProviderService;
export const db = firestoreDb;
export const rtdb = realtimeDb;

