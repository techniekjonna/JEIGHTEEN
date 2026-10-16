import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { freeSlug, saveCategories, useCategoriesReady, useShopCategories, type ShopCategory } from '../../data/categories';
import type { Product } from '../../data/products';
import { friendlyError, listen } from '../../lib/store';

type Row = ShopCategory & { isNew?: boolean };

const newKind = () => `cat-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

/** Categories of the shop: names in Dutch and English, order, add and remove. Products keep their category when it is renamed. */
export function CategoryManager() {
  const saved = useShopCategories();
  const ready = useCategoriesReady();
  const [rows, setRows] = useState<Row[]>(saved);
  const [dirty, setDirty] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => listen<Product>('atelier_items', false, setProducts), []);
  // Follow the saved list until you start editing.
  useEffect(() => {
    if (!dirty) setRows(saved);
  }, [saved, dirty]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.kind, (m.get(p.kind) ?? 0) + 1));
    return m;
  }, [products]);

  const change = (next: Row[]) => {
    setRows(next);
    setDirty(true);
    setMessage(null);
  };
  const patch = (i: number, p: Partial<Row>) => change(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  };
  const add = () => change([...rows, { kind: newKind(), slug: '', en: '', nl: '', isNew: true }]);
  const remove = (i: number) => {
    const r = rows[i];
    if (!r.isNew && !window.confirm(`Categorie "${r.nl || r.en}" verwijderen?`)) return;
    change(rows.filter((_, k) => k !== i));
  };

  const save = async () => {
    const empty = rows.findIndex((r) => !r.nl.trim() && !r.en.trim());
    if (empty >= 0) return setMessage({ ok: false, text: `Geef categorie ${empty + 1} een naam.` });
    if (rows.length === 0) return setMessage({ ok: false, text: 'Houd minstens één categorie over.' });

    // Address: stays the same unless the English name changed.
    const done: ShopCategory[] = [];
    for (const r of rows) {
      const en = r.en.trim() || r.nl.trim();
      const nl = r.nl.trim() || r.en.trim();
      const before = saved.find((s) => s.kind === r.kind);
      const keep = before && before.en === en && !done.some((d) => d.slug === before.slug);
      done.push({ kind: r.kind, en, nl, slug: keep ? before.slug : freeSlug(en, done) });
    }
    setSaving(true);
    try {
      await saveCategories(done);
      setDirty(false);
      setRows(done);
      setMessage({ ok: true, text: 'Opgeslagen. De shop, het menu en de footer zijn bijgewerkt.' });
    } catch (err) {
      setMessage({ ok: false, text: friendlyError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dcats" aria-labelledby="dcats-title">
      <div className="dlist__head">
        <div>
          <h1 id="dcats-title" className="dlist__title">Categorieën</h1>
          <p className="dlist__count">De soorten in je shop. Elke categorie krijgt een eigen pagina, een tegel op de voorpagina en een plek in het menu.</p>
        </div>
        <button type="button" className="dbtn" onClick={add}>
          <Plus size={18} strokeWidth={1.5} />
          Categorie toevoegen
        </button>
      </div>

      {!ready ? (
        <p className="dlist__empty">
          <Loader2 className="spin" size={20} />
        </p>
      ) : (
        <ol className="dcats__list">
          {rows.map((r, i) => {
            const n = counts.get(r.kind) ?? 0;
            return (
              <li key={r.kind} className="dcats__row">
                <span className="dcats__nr" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <label className="dcats__field">
                  <span className="dfield__label">Nederlands</span>
                  <input className="dinput" value={r.nl} placeholder="Bijv. Kleding" onChange={(e) => patch(i, { nl: e.target.value })} autoFocus={r.isNew} />
                </label>
                <label className="dcats__field">
                  <span className="dfield__label">Engels</span>
                  <input className="dinput" value={r.en} placeholder="Bijv. Clothing" onChange={(e) => patch(i, { en: e.target.value })} />
                </label>
                <span className="dcats__count">{n === 1 ? '1 item' : `${n} items`}</span>
                <div className="dcats__tools">
                  <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`${r.nl || 'Categorie'} omhoog`} title="Omhoog">
                    <ArrowUp size={17} strokeWidth={1.25} />
                  </button>
                  <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label={`${r.nl || 'Categorie'} omlaag`} title="Omlaag">
                    <ArrowDown size={17} strokeWidth={1.25} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => remove(i)}
                    disabled={n > 0}
                    aria-label={`${r.nl || 'Categorie'} verwijderen`}
                    title={n > 0 ? 'Verplaats eerst de items naar een andere categorie' : 'Verwijderen'}
                  >
                    <Trash2 size={17} strokeWidth={1.25} />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <p className="dfield__hint dcats__hint">
        Een categorie met items kun je niet verwijderen: geef die items eerst een andere categorie. Een naam wijzigen kan altijd, de items blijven erin staan.
      </p>

      <div className="dcats__foot">
        <button type="button" className="btn" onClick={save} disabled={saving || !dirty}>
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
        {dirty && !saving && (
          <button type="button" className="text-link" onClick={() => { setDirty(false); setRows(saved); setMessage(null); }}>
            Wijzigingen ongedaan maken
          </button>
        )}
        {message && (
          <p className={message.ok ? 'dhero__ok' : 'dform__error'} role={message.ok ? 'status' : 'alert'}>
            {message.ok && <Check size={16} />}
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
