import { useEffect, useState } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebase, firebaseReady } from '../../lib/firebase';
import type { Brand } from '../../lib/store';

export type AdminStatus = 'loading' | 'signed-out' | 'denied' | 'ok';

/**
 * Who may manage which brand lives in Firestore: admins/{uid} = { brands: ['atelier', 'music'] }.
 * An account with only 'atelier' cannot open the music dashboard, and the other way round.
 */
export function useAdmin(brand: Brand) {
  const [state, setState] = useState<{ status: AdminStatus; email: string | null }>(() => ({
    status: firebaseReady ? 'loading' : 'ok',
    email: null,
  }));

  useEffect(() => {
    if (!firebaseReady) return;
    const { auth, db } = firebase();
    let active = true;
    const stop = onAuthStateChanged(auth, async (user) => {
      if (!user) return setState({ status: 'signed-out', email: null });
      setState({ status: 'loading', email: user.email });
      try {
        const brands = (await getDoc(doc(db, 'admins', user.uid))).data()?.brands;
        if (active) setState({ status: Array.isArray(brands) && brands.includes(brand) ? 'ok' : 'denied', email: user.email });
      } catch {
        if (active) setState({ status: 'denied', email: user.email });
      }
    });
    return () => {
      active = false;
      stop();
    };
  }, [brand]);

  return state;
}

export async function adminSignIn(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(firebase().auth, email.trim(), password);
  } catch (err) {
    const code = (err as { code?: string }).code ?? '';
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
      throw new Error('E-mailadres of wachtwoord klopt niet.');
    if (code.includes('operation-not-allowed'))
      throw new Error('Inloggen met e-mail en wachtwoord staat nog uit in Firebase (Authentication, Sign-in method).');
    if (code.includes('api-key') || code.includes('configuration-not-found'))
      throw new Error('De Firebase-koppeling is nog niet compleet. Controleer de sleutel in Vercel en publiceer opnieuw.');
    if (code.includes('too-many-requests')) throw new Error('Te veel pogingen. Wacht even en probeer het opnieuw.');
    throw new Error('Inloggen lukte niet. Probeer het opnieuw.');
  }
}

export const adminSignOut = () => (firebaseReady ? signOut(firebase().auth) : Promise.resolve());
export const adminResetPassword = (email: string) => sendPasswordResetEmail(firebase().auth, email.trim());
