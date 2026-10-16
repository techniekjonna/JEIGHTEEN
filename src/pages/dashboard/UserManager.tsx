import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Loader2, Search, ShieldCheck, User as UserIcon } from 'lucide-react';
import { firebase, firebaseReady } from '../../lib/firebase';
import { TESTFASE } from '../../lib/testfase';

type Role = 'user' | 'admin';

interface Account {
  uid: string;
  email: string;
  name: string;
  role: Role;
  lastLogin: Date | null;
  createdAt: Date | null;
}

const ROLES: { value: Role; label: string }[] = [
  { value: 'user', label: 'Gebruiker' },
  { value: 'admin', label: 'Beheerder' },
];

const toDate = (v: unknown): Date | null => {
  const ts = v as { toDate?: () => Date } | null | undefined;
  return ts && typeof ts.toDate === 'function' ? ts.toDate() : null;
};

const formatDate = (d: Date | null) =>
  d ? d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'onbekend';

/** User manager: every account (users/{uid}) with its role. Admins change roles here instead of in the Firebase console. */
export function UserManager() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const me = firebaseReady ? firebase().auth.currentUser?.uid ?? null : null;

  useEffect(() => {
    if (!firebaseReady) return;
    return onSnapshot(
      collection(firebase().db, 'users'),
      (snap) => {
        setError('');
        setAccounts(
          snap.docs
            .map((d) => {
              const x = d.data();
              return {
                uid: d.id,
                email: x.email ?? '',
                name: x.name ?? '',
                role: x.role === 'admin' ? 'admin' : 'user',
                lastLogin: toDate(x.lastLogin),
                createdAt: toDate(x.createdAt),
              } as Account;
            })
            .sort((a, b) => (a.role === b.role ? a.email.localeCompare(b.email) : a.role === 'admin' ? -1 : 1))
        );
      },
      () => {
        setAccounts([]);
        setError('De accounts konden niet geladen worden. Controleer of de Firestore-regels gepubliceerd zijn.');
      }
    );
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!accounts) return [];
    return q ? accounts.filter((a) => a.email.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)) : accounts;
  }, [accounts, query]);

  const admins = accounts?.filter((a) => a.role === 'admin').length ?? 0;

  const changeRole = async (account: Account, role: Role) => {
    if (role === account.role) return;
    setMessage(null);
    setBusy(account.uid);
    try {
      await updateDoc(doc(firebase().db, 'users', account.uid), { role });
      setMessage({ ok: true, text: `${account.email || account.name} is nu ${role === 'admin' ? 'beheerder' : 'gebruiker'}.` });
    } catch {
      setMessage({ ok: false, text: 'Rol wijzigen lukte niet. Alleen een beheerder mag rollen aanpassen.' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="dhero dusers" aria-labelledby="dusers-title">
      <div className="dlist__head">
        <div>
          <h1 id="dusers-title" className="dlist__title">Gebruikers</h1>
          <p className="dlist__count">
            {accounts ? `${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'}, waarvan ${admins} ${admins === 1 ? 'beheerder' : 'beheerders'}.` : 'Accounts laden…'}{' '}
            Een beheerder kan in dit dashboard.
          </p>
        </div>
        {accounts && accounts.length > 5 && (
          <label className="dinput dinput--affix dusers__search">
            <Search size={16} strokeWidth={1.25} aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op naam of e-mail" aria-label="Zoek gebruiker" />
          </label>
        )}
      </div>

      {TESTFASE && (
        <p className="dfield__hint dusers__note">
          Testfase staat aan: nu mag nog elk ingelogd account in het dashboard. De rollen die je hier zet, gelden zodra de testfase uit gaat.
        </p>
      )}

      {!firebaseReady ? (
        <p className="dlist__empty">Er is nog geen database gekoppeld, dus er zijn nog geen accounts.</p>
      ) : accounts === null ? (
        <p className="dlist__empty">
          <Loader2 className="spin" size={20} />
        </p>
      ) : error ? (
        <p className="dform__error" role="alert">{error}</p>
      ) : shown.length === 0 ? (
        <p className="dlist__empty">{query ? 'Geen account gevonden.' : 'Nog geen accounts.'}</p>
      ) : (
        <ul className="drows">
          {shown.map((a) => {
            const self = a.uid === me;
            return (
              <li key={a.uid} className="drow dusers__row">
                <span className="dusers__icon" aria-hidden="true">
                  {a.role === 'admin' ? <ShieldCheck size={20} strokeWidth={1.25} /> : <UserIcon size={20} strokeWidth={1.25} />}
                </span>
                <div className="drow__info">
                  <p className="drow__title">
                    {a.name || a.email || 'Naamloos account'}
                    {self && <span className="dusers__you"> (jij)</span>}
                  </p>
                  <p className="drow__meta">
                    {a.name && a.email ? `${a.email} · ` : ''}laatst ingelogd {formatDate(a.lastLogin)}
                  </p>
                </div>
                <div className="dusers__role">
                  {busy === a.uid && <Loader2 className="spin" size={16} />}
                  <select
                    className="dinput dusers__select"
                    value={a.role}
                    disabled={self || busy === a.uid}
                    onChange={(e) => changeRole(a, e.target.value as Role)}
                    aria-label={`Rol van ${a.email || a.name}`}
                    title={self ? 'Je eigen rol kun je niet aanpassen, zo sluit je jezelf nooit buiten.' : undefined}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {message && (
        <p className={message.ok ? 'dhero__ok dusers__msg' : 'dform__error dusers__msg'} role={message.ok ? 'status' : 'alert'}>
          {message.text}
        </p>
      )}
    </section>
  );
}
