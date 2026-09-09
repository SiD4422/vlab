import admin from 'firebase-admin';

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
      const serviceAccount = require('../vlab-4946a-59fe76ca16b4.json');
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
