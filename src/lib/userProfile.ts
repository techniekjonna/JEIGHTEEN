import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebase, firebaseReady } from './firebase';

/**
 * Every account gets its own document users/{uid}, made automatically on the first sign-in.
 * It holds the name, e-mail, wishlist, role ('user' or 'admin') and when the account was made / last used.
 * Only the account itself may read and change it (see firestore.rules).
 */
export interface UserProfile {
  email: string | null;
  name: string;
  wishlist: string[];
  /** 'user' for everyone; change it to 'admin' in the Firebase console (Firestore, users) to open the dashboard. */
  role: string;
  createdAt?: unknown;
  lastLogin?: unknown;
}

const ref = (uid: string) => doc(firebase().db, 'users', uid);

/** Creates users/{uid} when it does not exist yet, otherwise only updates the last sign-in. */
export async function ensureUserProfile(user: User) {
  if (!firebaseReady) return;
  try {
    const snap = await getDoc(ref(user.uid));
    if (snap.exists()) {
      const extra = snap.data()?.role ? {} : { role: 'user' };
      await setDoc(ref(user.uid), { lastLogin: serverTimestamp(), email: user.email, ...extra }, { merge: true });
    } else {
      await setDoc(ref(user.uid), {
        email: user.email,
        name: user.displayName ?? '',
        wishlist: [],
        role: 'user',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    }
  } catch {
    // No database or rules yet: the site keeps working without a profile.
  }
}

export function saveUserProfile(uid: string, data: Partial<Pick<UserProfile, 'name' | 'wishlist'>>) {
  return setDoc(ref(uid), data, { merge: true });
}

/** Live profile of the signed-in account (null while loading or when there is none). */
export function useUserProfile(uid: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    if (!firebaseReady || !uid) {
      setProfile(null);
      return;
    }
    return onSnapshot(
      ref(uid),
      (snap) => {
        const d = snap.data();
        setProfile(
          d ? { email: d.email ?? null, name: d.name ?? '', wishlist: Array.isArray(d.wishlist) ? d.wishlist : [], role: d.role ?? 'user' } : null
        );
      },
      () => setProfile(null)
    );
  }, [uid]);
  return profile;
}
