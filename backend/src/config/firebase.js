import admin from 'firebase-admin';
import { env } from './env.js';

if (!admin.apps.length && env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey
    })
  });
}

export const auth = admin.apps.length ? admin.auth() : null;
export const db = admin.apps.length ? admin.firestore() : null;
