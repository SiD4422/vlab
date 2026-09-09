import fs from 'fs';
import path from 'path';

let appInitialized = false;

export async function getAdmin() {
  // Use dynamic imports to completely bypass Vercel's CJS transpiler bugs
  const { initializeApp, cert, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { getAuth } = await import('firebase-admin/auth');

  if (!appInitialized && !getApps().length) {
    let credential;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = cert(serviceAccount);
      } catch (e) {
        throw new Error("JSON Parse Error in FIREBASE_SERVICE_ACCOUNT: " + e.message);
      }
    } else {
      try {
        const filePath = path.resolve(process.cwd(), 'vlab-4946a-firebase-adminsdk-fbsvc-bbb9c3e6a4.json');
        const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        credential = cert(serviceAccount);
      } catch (e) {
        throw new Error("Failed to load local service account JSON: " + e.message);
      }
    }

    try {
      initializeApp({ credential });
      appInitialized = true;
    } catch (e) {
      throw new Error("initializeApp failed: " + e.message);
    }
  }

  return {
    db: getFirestore(),
    auth: getAuth()
  };
}
