import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  /** Accessible name; also the visible title unless `heading` is given. */
  label: string;
  /** Replaces the text title in the header (the menu shows the monogram). */
  heading?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Slide-in panel used for the menu (left) and the bag (right). Closed state is `visibility:hidden`, so it is out of the tab order. */
export function Drawer({ open, onClose, side = 'left', label, heading, children, footer }: DrawerProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus?.();
    };
  }, [open]);

  return (
    <div className="drawer" data-open={open} data-side={side}>
      <div className="drawer__scrim" onClick={onClose} aria-hidden="true" />
      <div className="drawer__panel" role="dialog" aria-modal="true" aria-label={label}>
        <div className="drawer__head">
          {heading ?? <span className="drawer__title">{label}</span>}
          <button ref={closeButton} type="button" className="icon-btn" onClick={onClose} aria-label={`Close ${label.toLowerCase()}`}>
            <X size={22} strokeWidth={1.25} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer && <div className="drawer__foot">{footer}</div>}
      </div>
    </div>
  );
}
