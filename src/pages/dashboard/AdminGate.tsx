import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import type { Brand } from '../../lib/store';
import { adminSignOut, useAdmin } from './useAdmin';
import { SignInForm } from './SignInForm';

/** Shows the dashboard only to an admin of this brand. */
export function AdminGate({ brand, title, children }: { brand: Brand; title: string; children: ReactNode }) {
  const { status, email } = useAdmin(brand);

  if (status === 'loading')
    return (
      <div className="dauth dauth--center" aria-live="polite">
        <Loader2 className="spin" size={26} />
      </div>
    );
  if (status === 'signed-out') return <SignInForm title={title} />;
  if (status === 'denied')
    return (
      <div className="dauth">
        <h1 className="dauth__title">Geen toegang</h1>
        <p className="dauth__sub">
          {email} mag het {title.toLowerCase()} niet beheren. Elk merk heeft zijn eigen beheerders.
        </p>
        <button type="button" className="btn" onClick={() => adminSignOut()}>
          Uitloggen
        </button>
      </div>
    );
  return <>{children}</>;
}
