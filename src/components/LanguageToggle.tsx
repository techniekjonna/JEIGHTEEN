import { useLanguage } from '../i18n/LanguageContext';

/** Shows the active language (NL / EN); a tap switches to the other one. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      type="button"
      className={`lang-toggle ${className}`.trim()}
      onClick={toggleLanguage}
      title={language === 'en' ? 'Bekijk in het Nederlands' : 'View in English'}
      aria-label={language === 'en' ? 'Language: English. Switch to Dutch' : 'Taal: Nederlands. Wissel naar Engels'}
    >
      <span aria-hidden="true">{language === 'en' ? 'EN' : 'NL'}</span>
    </button>
  );
}
