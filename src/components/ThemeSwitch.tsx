import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useT } from '../i18n/LanguageContext';

/** Day / night toggle. Lives in the menu drawer. */
export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const t = useT();
  return (
    <div className="theme-switch" role="group" aria-label={t('Appearance', 'Weergave')}>
      <button type="button" aria-pressed={theme === 'day'} onClick={() => setTheme('day')}>
        <Sun size={16} strokeWidth={1.25} />
        {t('Day', 'Dag')}
      </button>
      <button type="button" aria-pressed={theme === 'night'} onClick={() => setTheme('night')}>
        <Moon size={16} strokeWidth={1.25} />
        {t('Night', 'Nacht')}
      </button>
    </div>
  );
}
