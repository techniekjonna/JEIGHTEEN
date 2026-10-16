import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './firebase.config';

/** False until the Firebase config is filled in. Everything then falls back to demo mode (localStorage). */
export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

interface Services {
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

let services: Services | null = null;

export function firebase(): Services {
  if (!firebaseReady) throw new Error('Firebase is not configured');
  if (!services) {
    const app = initializeApp(firebaseConfig);
    services = {
      auth: getAuth(app),
      db: initializeFirestore(app, { ignoreUndefinedProperties: true }),
      storage: getStorage(app),
    };
  }
  return services;
}
