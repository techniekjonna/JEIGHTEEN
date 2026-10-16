import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { bannerDefaults, listenBanner, type BannerSlot, type HeroSettings } from '../../lib/heroSettings';
import { useT } from '../../i18n/LanguageContext';
import { scrollToCollection } from './scroll';

/** The button under the title: an optional link from the dashboard, otherwise a scroll to the collection. */
function Cta({ link, className, children }: { link?: string; className: string; children: ReactNode }) {
  const to = link?.trim();
  if (!to) {
    return (
      <button type="button" className={className} onClick={scrollToCollection}>
        {children}
      </button>
    );
  }
  if (to.startsWith('#')) {
    return (
      <a
        className={className}
        href={to}
        onClick={(e) => {
          const target = document.getElementById(to.slice(1));
          if (target) {
            e.preventDefault();
            target.scrollIntoView();
          }
        }}
      >
        {children}
      </a>
    );
  }
  if (to.startsWith('/')) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }
  const href = /^https?:\/\//i.test(to) ? to : `https://${to}`;
  return (
    <a className={className} href={href} rel="noopener">
      {children}
    </a>
  );
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Film or photo with the dark placeholder underneath, plus pause (and on Main: sound) buttons for film. */
function useBanner(slot: BannerSlot) {
  const [data, setData] = useState<HeroSettings>(bannerDefaults[slot]);
  const [failed, setFailed] = useState(false);
  useEffect(() => listenBanner(slot, setData), [slot]);
  useEffect(() => setFailed(false), [data.media, data.type]);
  return { data, failed, setFailed };
}

function Media({ data, failed, onFail, paused, muted }: { data: HeroSettings; failed: boolean; onFail: () => void; paused: boolean; muted: boolean }) {
  const player = useRef<HTMLVideoElement>(null);
  const isVideo = data.type === 'video';

  useEffect(() => {
    const el = player.current;
    if (!el) return;
    el.muted = muted;
    if (paused) el.pause();
    else
      el.play().catch(() => {
        // autoplay blocked: the user can still press play
      });
  }, [paused, muted, failed, data.media]);

  return (
    <div className="hero__media" aria-hidden="true">
      <div className="hero__placeholder" />
      {data.media &&
        !failed &&
        (isVideo ? (
          <video ref={player} key={data.media} src={data.media} loop playsInline muted autoPlay={!paused} preload="metadata" onError={onFail} />
        ) : (
          <img key={data.media} src={data.media} alt="" loading="lazy" onError={onFail} />
        ))}
    </div>
  );
}

/** Main: full-bleed film or photo at the top, centred caption. Texts, media and link come from the dashboard. */
export function Hero() {
  const t = useT();
  const { data, failed, setFailed } = useBanner('hero');
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(reducedMotion);

  const isVideo = data.type === 'video' && Boolean(data.media);
  const label = t(data.labelEn, data.labelNl || data.labelEn);
  const title = t(data.titleEn, data.titleNl || data.titleEn);
  const cta = t(data.ctaEn, data.ctaNl || data.ctaEn);

  return (
    <section className="hero" data-hero data-paused={paused} aria-label={title || 'JEIGHTEEN ATELIER'}>
      <Media data={data} failed={failed} onFail={() => setFailed(true)} paused={paused} muted={muted} />
      <div className="hero__scrim" />

      <div className="hero__caption">
        {label && <p className="hero__label">{label}</p>}
        <h1 className="hero__title">{title || 'JEIGHTEEN ATELIER'}</h1>
        {cta && (
          <Cta link={data.link} className="hero__cta">
            {cta}
          </Cta>
        )}
      </div>

      {isVideo && !failed && (
        <>
          <button type="button" className="hero__ctl hero__ctl--start" onClick={() => setPaused((p) => !p)} aria-label={paused ? t('Play film', 'Film afspelen') : t('Pause film', 'Film pauzeren')}>
            {paused ? <Play size={18} fill="currentColor" strokeWidth={0} /> : <Pause size={18} fill="currentColor" strokeWidth={0} />}
          </button>
          <button type="button" className="hero__ctl hero__ctl--end" onClick={() => setMuted((m) => !m)} aria-label={muted ? t('Unmute film', 'Geluid aan') : t('Mute film', 'Geluid uit')}>
            {muted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
          </button>
        </>
      )}
    </section>
  );
}

/**
 * Second, third and closing block. Layouts follow the reference:
 * full = full-bleed with caption at the bottom, split = half image with text beside it,
 * closing = full-bleed with the caption in the middle.
 */
export function Banner({ slot, layout }: { slot: Exclude<BannerSlot, 'hero'>; layout: 'full' | 'split' | 'closing' }) {
  const t = useT();
  const { data, failed, setFailed } = useBanner(slot);
  const [paused, setPaused] = useState(reducedMotion);

  if (data.visible === false) return null;

  const isVideo = data.type === 'video' && Boolean(data.media);
  const label = t(data.labelEn, data.labelNl || data.labelEn);
  const title = t(data.titleEn, data.titleNl || data.titleEn);
  const text = t(data.textEn ?? '', data.textNl || data.textEn || '');
  const cta = t(data.ctaEn, data.ctaNl || data.ctaEn);

  return (
    <section className={`band band--${layout}`} data-paused={paused} aria-label={title || label || 'JEIGHTEEN ATELIER'}>
      <div className="band__visual">
        <Media data={data} failed={failed} onFail={() => setFailed(true)} paused={paused} muted />
        {layout !== 'split' && <div className="hero__scrim band__scrim" />}
        {isVideo && !failed && (
          <button type="button" className="hero__ctl hero__ctl--start" onClick={() => setPaused((p) => !p)} aria-label={paused ? t('Play film', 'Film afspelen') : t('Pause film', 'Film pauzeren')}>
            {paused ? <Play size={18} fill="currentColor" strokeWidth={0} /> : <Pause size={18} fill="currentColor" strokeWidth={0} />}
          </button>
        )}
      </div>

      <div className="band__caption">
        {label && <p className="band__label">{label}</p>}
        {title && <h2 className="band__title">{title}</h2>}
        {text && <p className="band__text">{text}</p>}
        {cta && (
          <Cta link={data.link} className="band__cta">
            {cta}
          </Cta>
        )}
      </div>
    </section>
  );
}
