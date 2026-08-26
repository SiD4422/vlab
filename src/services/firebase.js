import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCli8_QsZSqt-LURHpgjNMV91wV5nYHFec",
  authDomain: "vlab-4946a.firebaseapp.com",
  projectId: "vlab-4946a",
  storageBucket: "vlab-4946a.firebasestorage.app",
  messagingSenderId: "106401534256",
  appId: "1:106401534256:web:5f702801a7973ad54af8f5",
  measurementId: "G-NPBN867CS0",
  databaseURL: "https://vlab-4946a-default-rtdb.firebaseio.com"
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

