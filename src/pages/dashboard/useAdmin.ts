import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebase, firebaseReady } from '../../lib/firebase';
import type { Brand } from '../../lib/store';
import { ensureUserProfile } from '../../lib/userProfile';
import { TESTFASE } from '../../lib/testfase';

export type AdminStatus = 'loading' | 'signed-out' | 'denied' | 'ok';

/**
 * Like the JonnaRincon site: every account has users/{uid} with a field role.
 * role 'admin' opens the dashboard; everyone else is 'user'. Change the role in the Firebase console.
 */
export function useAdmin(brand: Brand) {
  const [state, setState] = useState<{ status: AdminStatus; email: string | null; uid: string | null }>(() => ({
    status: firebaseReady ? 'loading' : 'ok',
    email: null,
    uid: null,
  }));

  useEffect(() => {
    if (!firebaseReady) return;
    const { auth, db } = firebase();
    let active = true;
    const stop = onAuthStateChanged(auth, async (user) => {
      if (!user) return setState({ status: 'signed-out', email: null, uid: null });
      setState({ status: 'loading', email: user.email, uid: user.uid });
      await ensureUserProfile(user);
      try {
        const role = (await getDoc(doc(db, 'users', user.uid))).data()?.role;
        if (active) setState({ status: TESTFASE || role === 'admin' ? 'ok' : 'denied', email: user.email, uid: user.uid });
      } catch {
        if (active) setState({ status: TESTFASE ? 'ok' : 'denied', email: user.email, uid: user.uid });
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
    if (code.includes('unauthorized-domain')) throw new Error('Dit webadres staat nog niet bij Authorized domains in Firebase.');
    if (code.includes('too-many-requests')) throw new Error('Te veel pogingen. Wacht even en probeer het opnieuw.');
    throw new Error('Inloggen lukte niet. Probeer het opnieuw.');
  }
}

/** New account (e-mail + password). Its users/{uid} profile (role 'user') is made automatically. */
export async function adminSignUp(email: string, password: string) {
  try {
    await createUserWithEmailAndPassword(firebase().auth, email.trim(), password);
  } catch (err) {
    const code = (err as { code?: string }).code ?? '';
    if (code.includes('email-already-in-use')) throw new Error('Er bestaat al een account met dit e-mailadres. Log in of kies Wachtwoord vergeten.');
    if (code.includes('invalid-email')) throw new Error('Dit e-mailadres klopt niet.');
    if (code.includes('weak-password')) throw new Error('Kies een wachtwoord van minstens 6 tekens.');
    if (code.includes('operation-not-allowed'))
      throw new Error('Account maken met e-mail en wachtwoord staat nog uit in Firebase (Authentication, Sign-in method).');
    if (code.includes('api-key') || code.includes('configuration-not-found'))
      throw new Error('De Firebase-koppeling is nog niet compleet. Controleer de sleutel in Vercel en publiceer opnieuw.');
    if (code.includes('unauthorized-domain')) throw new Error('Dit webadres staat nog niet bij Authorized domains in Firebase.');
    throw new Error('Account maken lukte niet. Probeer het opnieuw.');
  }
}

export const adminSignOut = () => (firebaseReady ? signOut(firebase().auth) : Promise.resolve());
export const adminResetPassword = (email: string) => sendPasswordResetEmail(firebase().auth, email.trim());
