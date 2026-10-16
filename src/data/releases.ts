import type { Entry } from '../lib/store';

export const releaseTypes = ['Single', 'EP', 'Album', 'Remix', 'Mix'] as const;

export interface Release extends Entry {
  title: string;
  type: string;
  /** YYYY-MM-DD */
  date: string;
  cover?: string;
  description?: string;
  spotify?: string;
  youtube?: string;
  soundcloud?: string;
}
