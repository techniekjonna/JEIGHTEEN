import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useT } from '../../i18n/LanguageContext';

/** Horizontal row that scrolls by swipe or with the arrows, like the reference's selections. */
export function Carousel({ title, children, action, labelledBy }: { title?: ReactNode; children: ReactNode; action?: ReactNode; labelledBy?: string }) {
  const t = useT();
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [children]);

  const go = (dir: -1 | 1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="carousel" aria-labelledby={labelledBy}>
      {(title || action) && (
        <div className="carousel__head">
          {title}
          {action}
        </div>
      )}
      <div className="carousel__frame">
        <div ref={track} className="carousel__track">
          {children}
        </div>
        {!edge.start && (
          <button type="button" className="carousel__arrow carousel__arrow--prev" onClick={() => go(-1)} aria-label={t('Previous', 'Vorige')}>
            <ChevronLeft size={22} strokeWidth={1.25} />
          </button>
        )}
        {!edge.end && (
          <button type="button" className="carousel__arrow carousel__arrow--next" onClick={() => go(1)} aria-label={t('Next', 'Volgende')}>
            <ChevronRight size={22} strokeWidth={1.25} />
          </button>
        )}
      </div>
    </div>
  );
}
