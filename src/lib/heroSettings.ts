import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firebase, firebaseReady } from './firebase';
import { friendlyError } from './store';

/**
 * The four media blocks on /atelier, each set in the ATELIER dashboard (Collectie, Voorpagina):
 * hero = Main (top of the page), second, third and closing (the 4th, last block before the footer).
 * Firestore: atelier_settings/<slot>. Without Firebase: localStorage (demo mode).
 */
export type BannerSlot = 'hero' | 'second' | 'third' | 'closing';

export const bannerSlots: { slot: BannerSlot; name: string; hint: string }[] = [
  { slot: 'hero', name: 'Main', hint: 'Het grote beeld bovenaan de pagina.' },
  { slot: 'second', name: 'Second', hint: 'Breed beeld onder je collectie.' },
  { slot: 'third', name: 'Third', hint: 'Half beeld met tekst ernaast.' },
  { slot: 'closing', name: 'Closing', hint: 'Het laatste beeld, net boven de onderkant.' },
];

export interface HeroSettings {
  type: 'video' | 'image';
  /** URL of the film or photo. Empty = the dark placeholder. */
  media?: string;
  labelEn: string;
  labelNl: string;
  titleEn: string;
  titleNl: string;
  /** Optional short text under the title (not shown on Main). */
  textEn?: string;
  textNl?: string;
  ctaEn: string;
  ctaNl: string;
  /** Optional. Empty = the button scrolls down to the collection. */
  link?: string;
  /** false = this block is hidden on the site. */
  visible?: boolean;
  updatedAt?: number;
}

export const bannerDefaults: Record<BannerSlot, HeroSettings> = {
  hero: {
    type: 'video',
    media: '',
    labelEn: 'New',
    labelNl: 'Nieuw',
    titleEn: 'Atelier Collection',
    titleNl: 'Atelier Collectie',
    ctaEn: 'Discover the Collection',
    ctaNl: 'Ontdek de collectie',
    link: '',
    visible: true,
  },
  second: {
    type: 'image',
    media: '',
    labelEn: 'The Atelier',
    labelNl: 'Het atelier',
    titleEn: 'Made by Hand, in Small Editions',
    titleNl: 'Met de hand gemaakt, in kleine oplage',
    textEn: '',
    textNl: '',
    ctaEn: 'Discover the Collection',
    ctaNl: 'Ontdek de collectie',
    link: '',
    visible: true,
  },
  third: {
    type: 'image',
    media: '',
    labelEn: 'Art',
    labelNl: 'Kunst',
    titleEn: 'Original Works and Prints',
    titleNl: 'Originele werken en prints',
    textEn: 'Every piece starts in the studio, the same place the music is made. Originals are one of a kind, prints come in numbered editions.',
    textNl: 'Elk stuk begint in de studio, dezelfde plek waar de muziek ontstaat. Originelen zijn uniek, prints verschijnen in genummerde oplage.',
    ctaEn: 'Explore the Art',
    ctaNl: 'Bekijk de kunst',
    link: '',
    visible: true,
  },
  closing: {
    type: 'image',
    media: '',
    labelEn: 'JEIGHTEEN MUSIC',
    labelNl: 'JEIGHTEEN MUSIC',
    titleEn: 'Hear the Sound Behind the Atelier',
    titleNl: 'Hoor het geluid achter het atelier',
    textEn: '',
    textNl: '',
    ctaEn: 'Go to JEIGHTEEN MUSIC',
    ctaNl: 'Naar JEIGHTEEN MUSIC',
    link: '/music',
    visible: true,
  },
};

/** Kept for the top block. */
export const defaultHero = bannerDefaults.hero;

const DEMO_EVENT = 'jeighteen-demo-hero';
const demoKey = (slot: BannerSlot) => `jeighteen-demo:atelier_${slot}`;

function readDemo(slot: BannerSlot): HeroSettings {
  try {
    const raw = localStorage.getItem(demoKey(slot));
    if (raw) return { ...bannerDefaults[slot], ...(JSON.parse(raw) as Partial<HeroSettings>) };
  } catch {
    // fall back to the defaults
  }
  return bannerDefaults[slot];
}

/** Live settings of one block. Returns an unsubscribe. */
export function listenBanner(slot: BannerSlot, onData: (banner: HeroSettings) => void, onError?: (message: string) => void): () => void {
  const fallback = bannerDefaults[slot];
  if (!firebaseReady) {
    const emit = () => onData(readDemo(slot));
    const onStorage = (e: StorageEvent) => e.key === demoKey(slot) && emit();
    emit();
    window.addEventListener(DEMO_EVENT, emit);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(DEMO_EVENT, emit);
      window.removeEventListener('storage', onStorage);
    };
  }
  return onSnapshot(
    doc(firebase().db, 'atelier_settings', slot),
    (snap) => onData(snap.exists() ? { ...fallback, ...(snap.data() as Partial<HeroSettings>) } : fallback),
    (err) => {
      onData(fallback);
      onError?.(friendlyError(err));
    }
  );
}

export async function saveBanner(slot: BannerSlot, banner: HeroSettings): Promise<void> {
  // JSON round-trip drops undefined fields, which Firestore refuses.
  const data = JSON.parse(JSON.stringify({ ...banner, updatedAt: Date.now() })) as HeroSettings;
  if (!firebaseReady) {
    try {
      localStorage.setItem(demoKey(slot), JSON.stringify(data));
    } catch {
      throw new Error('De proefopslag in deze browser is vol. Koppel Firebase om echt op te slaan.');
    }
    window.dispatchEvent(new Event(DEMO_EVENT));
    return;
  }
  await setDoc(doc(firebase().db, 'atelier_settings', slot), data);
}
