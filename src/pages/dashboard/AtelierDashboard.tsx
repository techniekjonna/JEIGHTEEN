import { Navigate, Route, Routes } from 'react-router-dom';
import { useShopCategories } from '../../data/categories';
import { formatPrice, type Product } from '../../data/products';
import { CategoryManager } from './CategoryManager';
import { CollectionManager, type FormProps } from './CollectionManager';
import { DashboardShell, type DashPage } from './DashboardShell';
import { HeroSettings } from './HeroSettings';
import { UserManager } from './UserManager';
import { Field, GalleryField, ImageField, NumberField, TextField, Toggle } from './fields';

const BASE = '/atelier/dashboard';

const PAGES: DashPage[] = [
  { to: BASE, label: 'Collectie', end: true },
  { to: `${BASE}/categorieen`, label: 'Categorieën' },
  { to: `${BASE}/voorpagina`, label: 'Voorpagina' },
  { to: `${BASE}/gebruikers`, label: 'Gebruikers' },
];

function CategorySelect({ value, onChange }: { value: string; onChange: (kind: string) => void }) {
  const list = useShopCategories();
  const known = list.some((c) => c.kind === value);
  return (
    <Field label="Categorie" hint="Categorieën beheer je onder Categorieën in het menu bovenaan.">
      {(id) => (
        <select id={id} className="dinput" value={value} onChange={(e) => onChange(e.target.value)}>
          {!known && value && <option value={value}>{value} (bestaat niet meer)</option>}
          {list.map((c) => (
            <option key={c.kind} value={c.kind}>
              {c.nl}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

function ProductForm({ brand, value, set, setUploading }: FormProps<Product>) {
  return (
    <>
      <ImageField brand={brand} label="Foto" value={value.image} onChange={(image) => set({ image })} onBusy={setUploading} />
      <GalleryField brand={brand} label="Extra foto's" value={value.images} onChange={(images) => set({ images })} onBusy={setUploading} />
      <TextField label="Naam" value={value.name} onChange={(name) => set({ name })} placeholder="Bijv. Eighteen Tee, black" />
      <CategorySelect value={value.kind} onChange={(kind) => set({ kind })} />
      <div className="dform__row">
        <NumberField label="Prijs" prefix="€" value={value.price} onChange={(price) => set({ price })} />
        <NumberField label="Voorraad" decimals={false} value={value.stock} onChange={(stock) => set({ stock })} hint="Leeg = geen limiet. 0 = uitverkocht." />
      </div>
      <TextField label="Omschrijving" multiline value={value.description} onChange={(description) => set({ description })} placeholder="Materiaal, formaat, editie, maten…" />
      <Toggle label="Online in de shop" hint="Uit = concept, alleen jij ziet het hier." checked={value.published} onChange={(published) => set({ published })} />
    </>
  );
}

function Collection() {
  const categories = useShopCategories();
  const name = (kind: string) => categories.find((c) => c.kind === kind)?.nl ?? kind;
  return (
    <CollectionManager<Product>
      brand="atelier"
      collection="atelier_items"
      heading="Collectie"
      noun="item"
      cta={{ title: 'Iets nieuws voor de shop?', text: 'Kies een foto (ook HEIC van je iPhone mag), geef het een naam, categorie en prijs, en het staat in de shop.' }}
      emptyText="Nog geen kunst of merchandise in de shop."
      blank={() => ({ name: '', kind: categories[0]?.kind ?? '', price: 0, published: true })}
      validate={(p) => (!p.name.trim() ? 'Geef het item een naam.' : !p.kind ? 'Kies een categorie.' : !(p.price > 0) ? 'Vul een prijs in.' : null)}
      row={(p) => ({
        image: p.image,
        title: p.name,
        meta: p.stock === undefined ? name(p.kind) : p.stock === 0 ? `${name(p.kind)} · uitverkocht` : `${name(p.kind)} · ${p.stock} op voorraad`,
        side: formatPrice(p.price),
      })}
      Form={ProductForm}
    />
  );
}

export function AtelierDashboard() {
  return (
    <DashboardShell brand="atelier" pages={PAGES}>
      <Routes>
        <Route index element={<Collection />} />
        <Route path="categorieen" element={<CategoryManager />} />
        <Route path="voorpagina" element={<HeroSettings />} />
        <Route path="gebruikers" element={<UserManager />} />
        <Route path="*" element={<Navigate to={BASE} replace />} />
      </Routes>
    </DashboardShell>
  );
}
