import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { atelierContent } from './content';
import { scrollToCollection } from './scroll';

/**
 * Full-bleed film with centred caption, pause (left) and mute (right) controls.
 * If the video file is missing or can't play, the dark placeholder underneath stays visible.
 */
export function Hero() {
  const { video, label, title, cta } = atelierContent.hero;
  const player = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const el = player.current;
    if (!el) return;
    el.muted = muted;
    if (paused) el.pause();
    else el.play().catch(() => {
      // autoplay blocked: the user can still press play
    });
  }, [paused, muted, failed]);

  return (
    <section className="hero" data-hero data-paused={paused} aria-label={title}>
      <div className="hero__media" aria-hidden="true">
        <div className="hero__placeholder" />
        {!failed && (
          <video ref={player} src={video} loop playsInline muted preload="auto" onError={() => setFailed(true)} />
        )}
      </div>
      <div className="hero__scrim" />

      <div className="hero__caption">
        <p className="hero__label">{label}</p>
        <h2 className="hero__title">{title}</h2>
        <button type="button" className="hero__cta" onClick={scrollToCollection}>
          {cta}
        </button>
      </div>

      <button type="button" className="hero__ctl hero__ctl--start" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play film' : 'Pause film'}>
        {paused ? <Play size={18} fill="currentColor" strokeWidth={0} /> : <Pause size={18} fill="currentColor" strokeWidth={0} />}
      </button>
      <button type="button" className="hero__ctl hero__ctl--end" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute film' : 'Mute film'}>
        {muted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
      </button>
    </section>
  );
}
