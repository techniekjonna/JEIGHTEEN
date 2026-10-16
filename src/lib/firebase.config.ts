/**
 * Firebase web config. These values are public by design: access is guarded by
 * firestore.rules and storage.rules, not by hiding this config.
 * Fill them in from Firebase console > Project settings > Your apps > Web app,
 * or set VITE_FIREBASE_* in Vercel. Project: jeighteen-4150b. apiKey comes only from VITE_FIREBASE_API_KEY (Vercel).
 * While apiKey/projectId are empty the site runs in demo mode.
 */
const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? 'jeighteen-4150b.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? 'jeighteen-4150b',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? 'jeighteen-4150b.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '220367517835',
  appId: env.VITE_FIREBASE_APP_ID ?? '1:220367517835:web:94db978f3c3f26d0c5bc8e',
};
