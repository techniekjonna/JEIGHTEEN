import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'nl';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const STORAGE_KEY = 'jeighteen-language';
const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Saved choice first, otherwise the browser language (Dutch browser = NL, everything else = EN). */
function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'nl' || stored === 'en') return stored;
  } catch {
    // storage blocked
  }
  return navigator.language?.toLowerCase().startsWith('nl') ? 'nl' : 'en';
}

/** NL / EN switch, same idea as the Jonna Rincon site: every text carries both versions inline via t(en, nl). */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // the choice just won't persist
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => setLanguageState(next), []);
  const toggleLanguage = useCallback(() => setLanguageState((l) => (l === 'en' ? 'nl' : 'en')), []);

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage }), [language, setLanguage, toggleLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

export type TFn = (en: string, nl: string) => string;

/** t('Bag', 'Tas'): picks the text for the active language. */
// eslint-disable-next-line react-refresh/only-export-components
export function useT(): TFn {
  const { language } = useLanguage();
  return useCallback((en: string, nl: string) => (language === 'nl' ? nl : en), [language]);
}
