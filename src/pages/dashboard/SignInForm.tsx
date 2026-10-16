import { useState, type FormEvent } from 'react';
import { useT } from '../../i18n/LanguageContext';
import { adminResetPassword, adminSignIn, adminSignUp } from './useAdmin';
import { TextField } from './fields';

/**
 * E-mail + password sign-in, with a switch to create a new account.
 * Used in the sign-in panel on the site and on the dashboard itself.
 * A new account gets users/{uid} with role 'user'; set role to 'admin' in Firestore for the dashboard.
 */
export function SignInForm({ title, sub }: { title?: string; sub?: string }) {
  const t = useT();
  const [mode, setMode] = useState<'in' | 'new'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const isNew = mode === 'new';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (isNew && password !== repeat) return setMessage(t('The passwords do not match.', 'De wachtwoorden zijn niet hetzelfde.'));
    setBusy(true);
    try {
      await (isNew ? adminSignUp(email, password) : adminSignIn(email, password));
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!email.trim()) return setMessage(t('Fill in your e-mail address first.', 'Vul eerst je e-mailadres in.'));
    try {
      await adminResetPassword(email);
      setMessage(t('If this address is known, an e-mail to reset your password is on its way.', 'Als dit adres bekend is, staat er een mail klaar om je wachtwoord te herstellen.'));
    } catch {
      setMessage(t('Sending the reset e-mail failed.', 'Herstelmail versturen lukte niet.'));
    }
  };

  const switchMode = () => {
    setMode(isNew ? 'in' : 'new');
    setMessage('');
    setRepeat('');
  };

  return (
    <form className="dauth" onSubmit={submit}>
      {title && <h1 className="dauth__title">{title}</h1>}
      <p className="dauth__sub">
        {isNew
          ? t('Create an account with your e-mail address.', 'Maak een account met je e-mailadres.')
          : sub ?? t('Sign in to continue.', 'Log in om verder te gaan.')}
      </p>
      <TextField label={t('E-mail address', 'E-mailadres')} type="email" value={email} onChange={setEmail} />
      <TextField label={t('Password', 'Wachtwoord')} type="password" value={password} onChange={setPassword} />
      {isNew && <TextField label={t('Repeat password', 'Herhaal wachtwoord')} type="password" value={repeat} onChange={setRepeat} />}
      {message && <p className="dform__error" role="alert">{message}</p>}
      <button type="submit" className="btn" disabled={busy || !email || !password || (isNew && !repeat)}>
        {busy ? t('Busy…', 'Bezig…') : isNew ? t('Create account', 'Account maken') : t('Sign in', 'Inloggen')}
      </button>
      {!isNew && (
        <button type="button" className="text-link dauth__reset" onClick={reset}>
          {t('Forgot password', 'Wachtwoord vergeten')}
        </button>
      )}
      <button type="button" className="text-link dauth__reset" onClick={switchMode}>
        {isNew ? t('I already have an account', 'Ik heb al een account') : t('Create an account', 'Account maken')}
      </button>
    </form>
  );
}
