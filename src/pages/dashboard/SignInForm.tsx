import { useState, type FormEvent } from 'react';
import { useT } from '../../i18n/LanguageContext';
import { adminResetPassword, adminSignIn } from './useAdmin';
import { TextField } from './fields';

/** E-mail + password sign-in. Used in the sign-in panel on the site and on the dashboard itself. */
export function SignInForm({ title, sub }: { title?: string; sub?: string }) {
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await adminSignIn(email, password);
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

  return (
    <form className="dauth" onSubmit={submit}>
      {title && <h1 className="dauth__title">{title}</h1>}
      <p className="dauth__sub">{sub ?? t('Sign in to continue.', 'Log in om verder te gaan.')}</p>
      <TextField label={t('E-mail address', 'E-mailadres')} type="email" value={email} onChange={setEmail} />
      <TextField label={t('Password', 'Wachtwoord')} type="password" value={password} onChange={setPassword} />
      {message && <p className="dform__error" role="alert">{message}</p>}
      <button type="submit" className="btn" disabled={busy || !email || !password}>
        {busy ? t('Signing in…', 'Bezig…') : t('Sign in', 'Inloggen')}
      </button>
      <button type="button" className="text-link dauth__reset" onClick={reset}>
        {t('Forgot password', 'Wachtwoord vergeten')}
      </button>
    </form>
  );
}
