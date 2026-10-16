import { useId, useRef, useState, type ReactNode } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage, friendlyError, type Brand } from '../../lib/store';

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="dfield">
      <label htmlFor={id} className="dfield__label">
        {label}
      </label>
      {children(id)}
      {hint && <p className="dfield__hint">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  hint,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) =>
        multiline ? (
          <textarea id={id} className="dinput" rows={4} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input id={id} className="dinput" type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        )
      }
    </Field>
  );
}

/** Number typed as text, so "24,95" works. Empty = undefined. */
export function NumberField({
  label,
  value,
  onChange,
  hint,
  prefix,
  decimals = true,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  hint?: string;
  prefix?: string;
  decimals?: boolean;
}) {
  const [text, setText] = useState(value === undefined ? '' : String(value).replace('.', ','));
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <div className="dinput dinput--affix">
          {prefix && <span aria-hidden="true">{prefix}</span>}
          <input
            id={id}
            inputMode={decimals ? 'decimal' : 'numeric'}
            value={text}
            onChange={(e) => {
              const raw = e.target.value.replace(decimals ? /[^\d,.]/g : /\D/g, '');
              setText(raw);
              const n = decimals ? parseFloat(raw.replace(',', '.')) : parseInt(raw, 10);
              onChange(Number.isFinite(n) ? n : undefined);
            }}
          />
        </div>
      )}
    </Field>
  );
}

export function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      {(id) => (
        <select id={id} className="dinput" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="dtoggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="dtoggle__track" aria-hidden="true" />
      <span>
        <span className="dtoggle__label">{label}</span>
        {hint && <span className="dfield__hint">{hint}</span>}
      </span>
    </label>
  );
}

export function ImageField({
  brand,
  label,
  value,
  onChange,
  onBusy,
  ratio = '4 / 5',
}: {
  brand: Brand;
  label: string;
  value: string | undefined;
  onChange: (url: string | undefined) => void;
  onBusy: (busy: boolean) => void;
  ratio?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setBusy(true);
    onBusy(true);
    try {
      onChange(await uploadImage(brand, file));
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
      <div className="dimage" style={{ aspectRatio: ratio }}>
        {value && <img src={value} alt={`Gekozen ${label.toLowerCase()} van dit product`} />}
        <button type="button" className="dimage__pick" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <Loader2 size={22} className="spin" /> : <ImagePlus size={22} strokeWidth={1.25} />}
          <span>{busy ? 'Uploaden…' : value ? 'Foto vervangen' : 'Foto kiezen'}</span>
        </button>
        {value && !busy && (
          <button type="button" className="dimage__clear" onClick={() => onChange(undefined)} aria-label="Foto weghalen">
            <X size={18} />
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {error && <p className="dform__error">{error}</p>}
    </div>
  );
}
