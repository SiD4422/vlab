import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

// Protect against multiple initializations in serverless environments
if (!getApps().length) {
  try {
    let credential;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Vercel Prod: Parse the JSON string from the environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = cert(serviceAccount);
    } else {
      // Local Dev Fallback: Try loading the local json file
      const filePath = path.resolve(process.cwd(), 'vlab-4946a-firebase-adminsdk-fbsvc-bbb9c3e6a4.json');
      const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      credential = cert(serviceAccount);
    }

    initializeApp({
      credential,
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

export const db = getFirestore();
export const auth = getAuth();
