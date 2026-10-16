import { Link } from 'react-router-dom';
import { ArrowUpRight, Loader2, LogOut } from 'lucide-react';
import { Drawer } from '../../components/Drawer';
import { firebaseReady } from '../../lib/firebase';
import { useT } from '../../i18n/LanguageContext';
import { adminSignOut, useAdmin } from '../dashboard/useAdmin';
import { SignInForm } from '../dashboard/SignInForm';
import { MyAccount } from './MyAccount';

/**
 * Sign-in panel, slides in from the left (the menu and bag come from the right).
 * Signed out: the login form. Signed in: My account (name, wishlist); ATELIER admins also get the dashboard button.
 */
export function AccountDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const { status, email, uid } = useAdmin('atelier');

  const toDashboard = (
    <Link to="/atelier/dashboard" className="btn account__btn" onClick={onClose}>
      <span>{t('Open dashboard', 'Naar dashboard')}</span>
      <ArrowUpRight size={18} strokeWidth={1.25} />
    </Link>
  );

  const signOut = (
    <button type="button" className="text-link account__out" onClick={() => adminSignOut()}>
      <LogOut size={16} strokeWidth={1.25} />
      {t('Sign out', 'Uitloggen')}
    </button>
  );

  let body;
  if (!firebaseReady) {
    body = (
      <div className="account">
        <p className="account__text">
          {t('Demo mode: signing in works on the live site.', 'Proefmodus: inloggen werkt op de live site.')}
        </p>
        {toDashboard}
      </div>
    );
  } else if (status === 'loading') {
    body = (
      <div className="account account--center" aria-live="polite">
        <Loader2 className="spin" size={24} />
      </div>
    );
  } else if (status === 'signed-out') {
    body = <SignInForm sub={t('Sign in with your account.', 'Log in met je account.')} />;
  } else {
    body = (
      <MyAccount
        email={email}
        uid={uid}
        isAdmin={status === 'ok'}
        dashboardButton={toDashboard}
        signOutButton={signOut}
        onClose={onClose}
      />
    );
  }

  return (
    <Drawer open={open} onClose={onClose} side="left" label={t('Sign in', 'Inloggen')} closeLabel={t('Close sign-in', 'Inloggen sluiten')}>
      {body}
    </Drawer>
  );
}
