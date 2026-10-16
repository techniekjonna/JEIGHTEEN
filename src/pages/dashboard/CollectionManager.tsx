import { useEffect, useState, type ComponentType, type FormEvent } from 'react';
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Drawer } from '../../components/Drawer';
import { friendlyError, listen, newId, removeEntry, saveEntry, type Brand, type CollectionName, type Entry } from '../../lib/store';

export interface FormProps<T> {
  brand: Brand;
  value: T;
  set: (patch: Partial<T>) => void;
  setUploading: (busy: boolean) => void;
}

interface Props<T extends Entry> {
  brand: Brand;
  collection: CollectionName;
  heading: string;
  /** e.g. "item", "release" */
  noun: string;
  blank: () => Omit<T, 'id' | 'createdAt'>;
  row: (item: T) => { image?: string; title: string; meta: string; side?: string };
  validate: (item: T) => string | null;
  emptyText: string;
  thumbRatio?: string;
  Form: ComponentType<FormProps<T>>;
}

/** List + editor for one collection. Both dashboards use it, each with its own collection. */
export function CollectionManager<T extends Entry>({ brand, collection, heading, noun, blank, row, validate, emptyText, thumbRatio = '4 / 5', Form }: Props<T>) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formKey, setFormKey] = useState(0);

  useEffect(() => listen<T>(collection, false, setItems, setError), [collection]);

  const edit = (item?: T) => {
    setFormError('');
    setDraft(item ? { ...item } : ({ ...blank(), id: '', createdAt: 0 } as T));
    setFormKey((k) => k + 1);
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const problem = validate(draft);
    if (problem) return setFormError(problem);
    setSaving(true);
    try {
      await saveEntry(collection, { ...draft, id: draft.id || newId(collection), createdAt: draft.createdAt || Date.now() });
      setOpen(false);
    } catch (err) {
      setFormError(friendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  const toggle = (item: T) => saveEntry(collection, { ...item, published: !item.published }).catch((err) => setError(friendlyError(err)));

  const remove = (item: T) => {
    if (!window.confirm(`"${row(item).title}" verwijderen? Dit kan niet ongedaan worden.`)) return;
    removeEntry(collection, item.id).catch((err) => setError(friendlyError(err)));
  };

  const live = items?.filter((i) => i.published).length ?? 0;
  const isNew = !draft?.id;

  return (
    <section className="dlist">
      <div className="dlist__head">
        <div>
          <h1 className="dlist__title">{heading}</h1>
          {items && (
            <p className="dlist__count">
              {items.length} {items.length === 1 ? noun : `${noun}s`} · {live} online
            </p>
          )}
        </div>
        <button type="button" className="dbtn" onClick={() => edit()}>
          <Plus size={18} strokeWidth={1.5} />
          Nieuw {noun}
        </button>
      </div>

      {error && <p className="dform__error" role="alert">{error}</p>}

      {items === null ? (
        <p className="dlist__empty">
          <Loader2 className="spin" size={20} />
        </p>
      ) : items.length === 0 ? (
        <div className="dlist__empty">
          <p>{emptyText}</p>
          <button type="button" className="text-link" onClick={() => edit()}>
            Voeg je eerste {noun} toe
          </button>
        </div>
      ) : (
        <ul className="drows">
          {items.map((item) => {
            const r = row(item);
            return (
              <li key={item.id} className="drow" data-published={item.published}>
                <button type="button" className="drow__thumb" style={{ aspectRatio: thumbRatio }} onClick={() => edit(item)} aria-label={`${r.title} bewerken`}>
                  {r.image && <img src={r.image} alt={`Foto van ${r.title}`} loading="lazy" />}
                </button>
                <div className="drow__info">
                  <p className="drow__title">{r.title}</p>
                  <p className="drow__meta">{r.meta}</p>
                  <span className="drow__status">{item.published ? 'Online' : 'Concept'}</span>
                </div>
                {r.side && <p className="drow__side">{r.side}</p>}
                <div className="drow__actions">
                  <button type="button" className="icon-btn" onClick={() => toggle(item)} aria-label={item.published ? `${r.title} offline halen` : `${r.title} online zetten`} title={item.published ? 'Offline halen' : 'Online zetten'}>
                    {item.published ? <Eye size={19} strokeWidth={1.25} /> : <EyeOff size={19} strokeWidth={1.25} />}
                  </button>
                  <button type="button" className="icon-btn" onClick={() => edit(item)} aria-label={`${r.title} bewerken`} title="Bewerken">
                    <Pencil size={18} strokeWidth={1.25} />
                  </button>
                  <button type="button" className="icon-btn" onClick={() => remove(item)} aria-label={`${r.title} verwijderen`} title="Verwijderen">
                    <Trash2 size={18} strokeWidth={1.25} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        label={isNew ? `Nieuw ${noun}` : `${noun[0].toUpperCase()}${noun.slice(1)} bewerken`}
        footer={
          <div className="dform__foot">
            {formError && <p className="dform__error" role="alert">{formError}</p>}
            <button type="submit" form="dash-editor" className="btn" disabled={saving || uploading}>
              {saving ? 'Opslaan…' : uploading ? 'Foto uploaden…' : 'Opslaan'}
            </button>
          </div>
        }
      >
        {draft && (
          <form id="dash-editor" className="dform" onSubmit={submit} key={formKey}>
            <Form brand={brand} value={draft} set={(patch) => setDraft((d) => (d ? { ...d, ...patch } : d))} setUploading={setUploading} />
          </form>
        )}
      </Drawer>
    </section>
  );
}
