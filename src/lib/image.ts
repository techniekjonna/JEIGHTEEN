/**
 * Photo handling in the browser, before upload:
 * - HEIC/HEIF (iPhone photos) is converted first, so it works in every browser.
 * - The photo is scaled down so the shop stays fast.
 * - It is saved as JPG, or as PNG when the photo has a transparent background.
 */

const HEIC_EXT = /\.(heic|heif)$/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|bmp|heic|heif)$/i;

export const isHeic = (file: File) => /image\/hei[cf]/i.test(file.type) || HEIC_EXT.test(file.name);

/** Windows often gives HEIC files no type at all, so the name counts too. */
export const isImageFile = (file: File) => file.type.startsWith('image/') || IMAGE_EXT.test(file.name);

/** What the file pickers accept. HEIC is named explicitly, otherwise some computers hide those files. */
export const IMAGE_ACCEPT = 'image/*,.heic,.heif';

async function heicToJpeg(file: File): Promise<Blob> {
  try {
    const { default: heic2any } = await import('heic2any');
    const out = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    return Array.isArray(out) ? out[0] : out;
  } catch {
    throw new Error(`"${file.name}" kon niet worden omgezet. Probeer de foto als JPG te bewaren of te delen.`);
  }
}

async function decode(file: File): Promise<ImageBitmap> {
  // Safari reads HEIC itself; other browsers need the converter.
  try {
    return await createImageBitmap(file);
  } catch {
    if (!isHeic(file)) throw new Error(`"${file.name}" kan niet als foto worden gelezen. Kies een JPG, PNG, WEBP of HEIC.`);
  }
  return createImageBitmap(await heicToJpeg(file));
}

function hasTransparency(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let i = 3; i < data.length; i += 4 * 7) if (data[i] < 250) return true;
  return false;
}

/** Scales a photo down and returns a JPG (or PNG when transparent). */
export async function shrinkImage(file: File, maxSide: number, quality: number): Promise<Blob> {
  const bitmap = await decode(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Kon de foto niet verwerken in deze browser.');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const mayBeTransparent = /png|webp|gif|avif/i.test(file.type) && hasTransparency(ctx, canvas.width, canvas.height);
  if (!mayBeTransparent) {
    // JPG has no transparency: put a white background under it.
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const type = mayBeTransparent ? 'image/png' : 'image/jpeg';
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Kon de foto niet verwerken.'))), type, quality)
  );
}

/** "IMG_4021.HEIC" -> "IMG_4021", used to keep the original name in the cloud. */
export const baseName = (file: File) =>
  file.name.replace(/\.[^.]+$/, '').replace(/[^\w\- ]+/g, ' ').replace(/\s+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'foto';

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
