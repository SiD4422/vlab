import firebaseAdmin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Handle Vercel esbuild CJS interop for default exports
const admin = firebaseAdmin.default || firebaseAdmin;

// Protect against multiple initializations in serverless environments
if (!admin.apps.length) {
  try {
    let credential;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Vercel Prod: Parse the JSON string from the environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = admin.credential.cert(serviceAccount);
    } else {
      // Local Dev Fallback: Try loading the local json file
      const filePath = path.resolve(process.cwd(), 'vlab-4946a-firebase-adminsdk-fbsvc-bbb9c3e6a4.json');
      const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    }

    admin.initializeApp({
      credential,
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
