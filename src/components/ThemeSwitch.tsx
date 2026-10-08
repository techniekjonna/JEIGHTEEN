import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

/** Day / night toggle. Lives in the menu drawer. */
export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-switch" role="group" aria-label="Appearance">
      <button type="button" aria-pressed={theme === 'day'} onClick={() => setTheme('day')}>
        <Sun size={16} strokeWidth={1.25} />
        Day
      </button>
      <button type="button" aria-pressed={theme === 'night'} onClick={() => setTheme('night')}>
        <Moon size={16} strokeWidth={1.25} />
        Night
      </button>
    </div>
  );
}
