import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
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
let microsoftProviderService;
let firestoreDb;
let realtimeDb;

try {
  console.log("Firebase Config being used:", firebaseConfig);
  app = initializeApp(firebaseConfig);
  authService = getAuth(app);
  googleProviderService = new GoogleAuthProvider();
  googleProviderService.setCustomParameters({ prompt: 'select_account' });
  microsoftProviderService = new OAuthProvider('microsoft.com');
  microsoftProviderService.setCustomParameters({ prompt: 'select_account' });
  realtimeDb = getDatabase(app);
  firestoreDb = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization skipped or failed. Using mock mode.", error);
}

export const auth = authService;
export const googleProvider = googleProviderService;
export const microsoftProvider = microsoftProviderService;
export const db = firestoreDb;
export const rtdb = realtimeDb;

