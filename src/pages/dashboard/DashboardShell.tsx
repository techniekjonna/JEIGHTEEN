import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { firebaseReady } from '../../lib/firebase';
import type { Brand } from '../../lib/store';
import { AdminGate } from './AdminGate';
import { adminSignOut } from './useAdmin';

const SITE: Record<Brand, { path: string; title: string }> = {
  atelier: { path: '/atelier', title: 'Atelier dashboard' },
  music: { path: '/music', title: 'Music dashboard' },
};

/** Frame for one brand's dashboard. No link to the other brand: they are managed separately. */
export function DashboardShell({ brand, children }: { brand: Brand; children: ReactNode }) {
  const site = SITE[brand];

  useEffect(() => {
    document.title = `${site.title} · JEIGHTEEN`;
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      robots.remove();
      document.title = 'JEIGHTEEN';
    };
  }, [site.title]);

  return (
    <div className="dash" data-brand={brand}>
      <header className="dash__bar">
        <Link to={site.path} className="dash__brand" aria-label={`JEIGHTEEN ${brand}, naar de site`}>
          <Logo />
        </Link>
        <span className="dash__tag">Dashboard</span>
        <nav className="dash__actions">
          <Link to={site.path} className="dash__action">
            <span>Bekijk site</span>
            <ArrowUpRight size={18} strokeWidth={1.25} />
          </Link>
          {firebaseReady && (
            <button type="button" className="dash__action" onClick={() => adminSignOut()}>
              <span>Uitloggen</span>
              <LogOut size={18} strokeWidth={1.25} />
            </button>
          )}
        </nav>
      </header>
      {!firebaseReady && (
        <p className="dash__demo">
          Proefmodus: er is nog geen database gekoppeld. Wat je hier toevoegt, staat alleen in deze browser.
        </p>
      )}
      <main className="dash__main">
        <AdminGate brand={brand} title={site.title}>
          {children}
        </AdminGate>
      </main>
    </div>
  );
}
