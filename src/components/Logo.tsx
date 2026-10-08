interface LogoProps {
  className?: string;
}

/**
 * The JEIGHTEEN wordmark, drawn as a CSS mask over `currentColor`
 * (public/jeighteen-logo.png is black on transparent). That means the logo follows
 * the text colour: black by day, white by night, and it can be blended over video.
 * Size it by setting `--logo-w` on the element or a parent.
 */
export function Logo({ className = '' }: LogoProps) {
  return <span role="img" aria-label="JEIGHTEEN" className={`logo ${className}`.trim()} />;
}
