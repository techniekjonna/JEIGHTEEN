/**
 * The JEIGHTEEN monogram, drawn as a CSS mask over `currentColor` (public/jeighteen-mark.png is black on transparent).
 * Size it via `--mark-w` on the element or a parent.
 */
export function Mark({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`mark ${className}`.trim()} />;
}
