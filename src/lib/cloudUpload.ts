import { firebase } from './firebase';
import type { Brand } from './store';

/**
 * Uploads a file to the ownCloud (Internedata) through our own /api/cloud-upload
 * server function. The ownCloud login only lives in Vercel, never in the browser.
 * Returns a direct public link. Throws CloudNotSet when ownCloud is not configured,
 * so the caller can fall back to Firebase Storage.
 */
const CHUNK = 3 * 1024 * 1024; // under Vercel's 4.5 MB request limit

export class CloudNotSet extends Error {}

async function call(params: Record<string, string | number>, token: string, body?: Blob) {
  const q = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const res = await fetch(`/api/cloud-upload?${q}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/octet-stream' },
    body: body ?? null,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 503) throw new CloudNotSet(data.error || 'ownCloud niet ingesteld');
    if (res.status === 404 || res.status === 501) {
      throw new Error('Foto uploaden naar ownCloud werkt alleen op de live site (na Publiceren), niet in de preview.');
    }
    throw new Error(data.error || `Upload mislukt (${res.status})`);
  }
  return data;
}

export async function uploadToCloud(brand: Brand, file: Blob, name: string, folder = 'Producten'): Promise<string> {
  const user = firebase().auth.currentUser;
  if (!user) throw new Error('Log eerst in als beheerder.');
  const token = await user.getIdToken();
  const transfer = `web${Date.now()}${Math.random().toString(36).slice(2, 10)}`;

  const started = await call({ stap: 'start', brand, folder, name, transfer }, token);
  const finalName: string = started.name;

  const count = Math.max(1, Math.ceil(file.size / CHUNK));
  let result: { url?: string } = {};
  for (let i = 0; i < count; i++) {
    const part = file.slice(i * CHUNK, Math.min(file.size, (i + 1) * CHUNK));
    result = await call({ stap: 'chunk', brand, folder, name: finalName, transfer, index: i, count }, token, part);
  }
  if (!result.url) throw new Error('Geen fotolink ontvangen van ownCloud.');
  return result.url;
}
