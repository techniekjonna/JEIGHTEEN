import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { sites } from '../data/navigation';

interface SiteSwitchProps {
  className?: string;
  onNavigate?: () => void;
}

/** JEIGHTEEN ATELIER | JEIGHTEEN MUSIC — the page you are on is bold. */
export function SiteSwitch({ className = '', onNavigate }: SiteSwitchProps) {
  return (
    <nav className={`siteswitch ${className}`.trim()} aria-label="Sites">
      {sites.map((site, i) => (
        <Fragment key={site.to}>
          {i > 0 && <span className="siteswitch__sep" aria-hidden="true" />}
          <NavLink to={site.to} className="link-line" onClick={onNavigate}>
            {site.label}
          </NavLink>
        </Fragment>
      ))}
    </nav>
  );
}
