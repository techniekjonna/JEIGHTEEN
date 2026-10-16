import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Film, ImagePlus, Loader2, X } from 'lucide-react';
import { bannerDefaults, bannerSlots, listenBanner, saveBanner, type BannerSlot, type HeroSettings as Hero } from '../../lib/heroSettings';
import { friendlyError, uploadImage, uploadVideo } from '../../lib/store';
import { SelectField, TextField, Toggle } from './fields';

const TYPES = ['Film', 'Foto'] as const;

/** Upload a film or photo for the top of the page, or paste a link to one. */
function MediaField({ value, set, onBusy, label }: { value: Hero; set: (patch: Partial<Hero>) => void; onBusy: (busy: boolean) => void; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isVideo = value.type === 'video';

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setBusy(true);
    onBusy(true);
    try {
      if (file.type.startsWith('video/')) set({ type: 'video', media: await uploadVideo('atelier', file) });
      else set({ type: 'image', media: await uploadImage('atelier', file, { folder: 'Voorpagina', maxSize: 2400 }) });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
      onBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className="dfield">
      <span className="dfield__label">{label}</span>
      <div className="dimage dhero__media">
        {value.media &&
          (isVideo ? (
            <video key={value.media} src={value.media} muted loop autoPlay playsInline aria-label={`Gekozen film voor ${label}`} />
          ) : (
            <img key={value.media} src={value.media} alt={`Gekozen foto voor ${label}`} />
          ))}
        <button type="button" className="dimage__pick" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <Loader2 size={22} className="spin" /> : isVideo ? <Film size={22} strokeWidth={1.25} /> : <ImagePlus size={22} strokeWidth={1.25} />}
          <span>{busy ? 'Uploaden…' : value.media ? 'Vervangen' : 'Film of foto kiezen'}</span>
        </button>
        {value.media && !busy && (
          <button type="button" className="dimage__clear" onClick={() => set({ media: '' })} aria-label="Film of foto weghalen">
            <X size={18} />
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="video/mp4,video/webm,video/quicktime,image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      <p className="dfield__hint">Film: mp4, liefst kort en onder 30 MB, dan laadt hij snel. Foto: liggend werkt het best.</p>
      {error && <p className="dform__error">{error}</p>}
    </div>
  );
}

/** One block: media, texts (EN/NL), optional link and (except Main) a short text and show/hide. */
function SlotForm({ slot, name }: { slot: BannerSlot; name: string }) {
  const isMain = slot === 'hero';
  const [saved, setSaved] = useState<Hero | null>(null);
  const [draft, setDraft] = useState<Hero>(bannerDefaults[slot]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(
    () =>
      listenBanner(
        slot,
        (banner) => {
          setSaved((prev) => {
            // Only fill the form the first time, so a live update never wipes what you are typing.
            if (!prev) setDraft(banner);
            return banner;
          });
        },
        (text) => setMessage({ ok: false, text })
      ),
    [slot]
  );

  const set = (patch: Partial<Hero>) => {
    setMessage(null);
    setDraft((d) => ({ ...d, ...patch }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (draft.visible !== false && !draft.titleEn.trim() && !draft.titleNl.trim() && !draft.ctaEn.trim()) {
      return setMessage({ ok: false, text: 'Vul minstens een titel of een knoptekst in.' });
    }
    setSaving(true);
    try {
      await saveBanner(slot, { ...draft, link: draft.link?.trim() ?? '' });
      setMessage({ ok: true, text: `Opgeslagen. ${name} op de site is bijgewerkt.` });
    } catch (err) {
      setMessage({ ok: false, text: friendlyError(err) });
    } finally {
      setSaving(false);
    }
  };

  const changed = saved !== null && JSON.stringify({ ...draft, updatedAt: 0 }) !== JSON.stringify({ ...saved, updatedAt: 0 });

  return (
    <>
      {saved === null ? (
        <p className="dlist__empty">
          <Loader2 className="spin" size={20} />
        </p>
      ) : (
        <form className="dform dhero__form" onSubmit={submit}>
          <div className="dhero__col">
            <SelectField
              label="Soort"
              value={draft.type === 'video' ? 'Film' : 'Foto'}
              options={TYPES}
              onChange={(v) => set({ type: v === 'Film' ? 'video' : 'image' })}
            />
            <MediaField value={draft} set={set} onBusy={setUploading} label={isMain ? 'Film of foto bovenaan' : 'Film of foto'} />
            <TextField
              label="Of plak een link naar de film of foto"
              value={draft.media}
              onChange={(media) => set({ media })}
              placeholder="https://…"
            />
          </div>

          <div className="dhero__col">
            <div className="dform__row">
              <TextField label="Label (EN)" value={draft.labelEn} onChange={(labelEn) => set({ labelEn })} placeholder="New" />
              <TextField label="Label (NL)" value={draft.labelNl} onChange={(labelNl) => set({ labelNl })} placeholder="Nieuw" />
            </div>
            <div className="dform__row">
              <TextField label="Titel (EN)" value={draft.titleEn} onChange={(titleEn) => set({ titleEn })} placeholder="Atelier Collection" />
              <TextField label="Titel (NL)" value={draft.titleNl} onChange={(titleNl) => set({ titleNl })} placeholder="Atelier Collectie" />
            </div>
            <div className="dform__row">
              <TextField label="Knop (EN)" value={draft.ctaEn} onChange={(ctaEn) => set({ ctaEn })} placeholder="Discover the Collection" />
              <TextField label="Knop (NL)" value={draft.ctaNl} onChange={(ctaNl) => set({ ctaNl })} placeholder="Ontdek de collectie" />
            </div>
            {!isMain && (
              <div className="dform__row">
                <TextField label="Korte tekst (EN)" multiline value={draft.textEn} onChange={(textEn) => set({ textEn })} placeholder="Optioneel" />
                <TextField label="Korte tekst (NL)" multiline value={draft.textNl} onChange={(textNl) => set({ textNl })} placeholder="Optioneel" />
              </div>
            )}
            <TextField
              label="Link van de knop (optioneel)"
              value={draft.link}
              onChange={(link) => set({ link })}
              placeholder="Bijv. /atelier/prints of https://…"
              hint="Leeg laten = de knop scrollt naar je collectie. Een leeg tekstveld wordt niet getoond. NL leeg = de Engelse tekst."
            />

            {!isMain && (
              <Toggle
                label="Tonen op de site"
                hint="Uit = dit blok staat niet op je ATELIER-pagina."
                checked={draft.visible !== false}
                onChange={(visible) => set({ visible })}
              />
            )}

            {message && (
              <p className={message.ok ? 'dhero__ok' : 'dform__error'} role={message.ok ? 'status' : 'alert'}>
                {message.ok && <Check size={16} />}
                {message.text}
              </p>
            )}
            <button type="submit" className="btn" disabled={saving || uploading || !changed}>
              {saving ? 'Opslaan…' : uploading ? 'Uploaden…' : changed ? `${name} opslaan` : 'Alles is opgeslagen'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

/** The four media blocks of /atelier (HERO: Main, Second, Third, Closing), shown under the collection in the dashboard. */
export function HeroSettings() {
  const [active, setActive] = useState<BannerSlot>('hero');
  const current = bannerSlots.find((b) => b.slot === active) ?? bannerSlots[0];

  return (
    <section className="dhero" aria-labelledby="dhero-title">
      <div className="dlist__head">
        <div>
          <h2 id="dhero-title" className="dlist__title">Voorpagina</h2>
          <p className="dlist__count">De films en foto's op je ATELIER-pagina, elk met tekst en een knop met optionele link.</p>
        </div>
      </div>

      <div className="dtabs" role="tablist" aria-label="Blokken op de pagina">
        {bannerSlots.map((b, i) => (
          <button
            key={b.slot}
            type="button"
            role="tab"
            id={`dtab-${b.slot}`}
            aria-selected={active === b.slot}
            aria-controls={`dpanel-${b.slot}`}
            className="dtabs__tab"
            onClick={() => setActive(b.slot)}
          >
            <span className="dtabs__nr">{i === 0 ? 'HERO' : i + 1}</span>
            {b.name}
          </button>
        ))}
      </div>
      <p className="dfield__hint dtabs__hint">{current.hint}</p>

      {bannerSlots.map((b) => (
        // All four stay mounted, so switching tabs never loses what you typed.
        <div key={b.slot} role="tabpanel" id={`dpanel-${b.slot}`} aria-labelledby={`dtab-${b.slot}`} hidden={active !== b.slot}>
          <SlotForm slot={b.slot} name={b.name} />
        </div>
      ))}
    </section>
  );
}
