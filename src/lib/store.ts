import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { demoProducts } from '../data/products';
import { firebase, firebaseReady } from './firebase';
import { baseName, blobToDataUrl, isImageFile, shrinkImage } from './image';
import { CloudNotSet, uploadToCloud } from './cloudUpload';

/**
 * Data layer for both dashboards. ATELIER and MUSIC are kept apart: each has its own
 * collection, its own image folder and its own admin right (see firestore.rules).
 * Without a Firebase config everything lives in localStorage (demo mode, this browser only).
 */
export type Brand = 'atelier' | 'music';
export type CollectionName = 'atelier_items' | 'music_releases';

export interface Entry {
  id: string;
  /** Visible on the public site. */
  published: boolean;
  createdAt: number;
}

const DEMO_EVENT = 'jeighteen-demo-change';
const demoKey = (c: CollectionName) => `jeighteen-demo:${c}`;
const newestFirst = (a: Entry, b: Entry) => b.createdAt - a.createdAt;

function readDemo<T extends Entry>(c: CollectionName): T[] {
  try {
    const raw = localStorage.getItem(demoKey(c));
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    // unreadable storage: start from the seed
  }
  return (c === 'atelier_items' ? demoProducts : []) as unknown as T[];
}

function writeDemo<T extends Entry>(c: CollectionName, items: T[]) {
  try {
    localStorage.setItem(demoKey(c), JSON.stringify(items));
  } catch {
    throw new Error('De proefopslag in deze browser is vol. Koppel Firebase om echt op te slaan.');
  }
  window.dispatchEvent(new Event(DEMO_EVENT));
}

export function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  if (code.includes('permission-denied') || code.includes('unauthorized')) return 'Geen toegang. Log opnieuw in met een beheerdersaccount.';
  if (code.includes('unavailable')) return 'Geen verbinding met de database. Probeer het zo nog eens.';
  return err instanceof Error ? err.message : 'Er ging iets mis.';
}

/** Live list of a collection, newest first. `publishedOnly` is what the public site uses. Returns an unsubscribe. */
export function listen<T extends Entry>(
  c: CollectionName,
  publishedOnly: boolean,
  onData: (items: T[]) => void,
  onError?: (message: string) => void
): () => void {
  if (!firebaseReady) {
    const emit = () => onData(readDemo<T>(c).filter((i) => !publishedOnly || i.published).sort(newestFirst));
    const onStorage = (e: StorageEvent) => e.key === demoKey(c) && emit();
    emit();
    window.addEventListener(DEMO_EVENT, emit);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(DEMO_EVENT, emit);
      window.removeEventListener('storage', onStorage);
    };
  }
  const base = collection(firebase().db, c);
  const q = publishedOnly ? query(base, where('published', '==', true)) : base;
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as T).sort(newestFirst)),
    (err) => onError?.(friendlyError(err))
  );
}

export function newId(c: CollectionName): string {
  if (firebaseReady) return doc(collection(firebase().db, c)).id;
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function saveEntry<T extends Entry>(c: CollectionName, item: T): Promise<void> {
  if (!firebaseReady) {
    const all = readDemo<T>(c).filter((x) => x.id !== item.id);
    writeDemo(c, [...all, item]);
    return;
  }
  const { id, ...data } = item;
  await setDoc(doc(firebase().db, c, id), data);
}

export async function removeEntry(c: CollectionName, id: string): Promise<void> {
  if (!firebaseReady) {
    writeDemo(c, readDemo(c).filter((x) => x.id !== id));
    return;
  }
  await deleteDoc(doc(firebase().db, c, id));
}

/** Converts (HEIC to JPG), shrinks the photo, stores it in ownCloud (or Firebase Storage as fallback) and returns a public URL. */
export async function uploadImage(brand: Brand, file: File, opts: { folder?: string; maxSize?: number } = {}): Promise<string> {
  if (!isImageFile(file)) throw new Error(`"${file.name}" is geen foto. Kies een JPG, PNG, WEBP of HEIC.`);
  const maxSize = opts.maxSize ?? 1800;
  if (!firebaseReady) return blobToDataUrl(await shrinkImage(file, Math.min(maxSize, 1200), 0.72));
  const blob = await shrinkImage(file, maxSize, 0.86);
  const ext = blob.type === 'image/png' ? 'png' : 'jpg';
  return storeFile(brand, blob, ext, opts.folder ?? 'Producten', baseName(file));
}

const MAX_VIDEO_MB = 200;

/** Uploads a film as it is (no re-encoding) to ownCloud, or Firebase Storage as fallback. */
export async function uploadVideo(brand: Brand, file: File, folder = 'Voorpagina'): Promise<string> {
  if (!file.type.startsWith('video/')) throw new Error('Kies een film (mp4 of webm).');
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) throw new Error(`Deze film is groter dan ${MAX_VIDEO_MB} MB. Maak hem korter of kleiner.`);
  if (!firebaseReady) {
    if (file.size > 3 * 1024 * 1024) throw new Error('In de proefmodus past alleen een film tot 3 MB. Op de live site kan het wel.');
    return blobToDataUrl(file);
  }
  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
  return storeFile(brand, file, ext, folder);
}

async function storeFile(brand: Brand, blob: Blob, ext: string, folder: string, name?: string): Promise<string> {
  const stamp = `${name ? `${name}-` : ''}${Date.now().toString(36)}`;
  try {
    // Preferred: the ownCloud at Internedata, via the server function (login stays on the server).
    return await uploadToCloud(brand, blob, `${stamp}.${ext}`, folder);
  } catch (err) {
    if (!(err instanceof CloudNotSet)) throw err;
  }
  // Fallback when ownCloud is not set in Vercel: Firebase Storage (needs the Blaze plan).
  const target = ref(firebase().storage, `${brand}/${folder.toLowerCase()}/${stamp}.${ext}`);
  await uploadBytes(target, blob, { contentType: blob.type, cacheControl: 'public,max-age=31536000' });
  return getDownloadURL(target);
}
