import { formatPrice, productKinds, type Product } from '../../data/products';
import { CollectionManager, type FormProps } from './CollectionManager';
import { DashboardShell } from './DashboardShell';
import { HeroSettings } from './HeroSettings';
import { GalleryField, ImageField, NumberField, SelectField, TextField, Toggle } from './fields';

function ProductForm({ brand, value, set, setUploading }: FormProps<Product>) {
  return (
    <>
      <ImageField brand={brand} label="Foto" value={value.image} onChange={(image) => set({ image })} onBusy={setUploading} />
      <GalleryField brand={brand} label="Extra foto's" value={value.images} onChange={(images) => set({ images })} onBusy={setUploading} />
      <TextField label="Naam" value={value.name} onChange={(name) => set({ name })} placeholder="Bijv. Eighteen Tee, black" />
      <SelectField label="Soort" value={value.kind} options={productKinds} onChange={(kind) => set({ kind })} />
      <div className="dform__row">
        <NumberField label="Prijs" prefix="€" value={value.price} onChange={(price) => set({ price })} />
        <NumberField label="Voorraad" decimals={false} value={value.stock} onChange={(stock) => set({ stock })} hint="Leeg = geen limiet. 0 = uitverkocht." />
      </div>
      <TextField label="Omschrijving" multiline value={value.description} onChange={(description) => set({ description })} placeholder="Materiaal, formaat, editie, maten…" />
      <Toggle label="Online in de shop" hint="Uit = concept, alleen jij ziet het hier." checked={value.published} onChange={(published) => set({ published })} />
    </>
  );
}

export function AtelierDashboard() {
  return (
    <DashboardShell brand="atelier">
      <CollectionManager<Product>
        brand="atelier"
        collection="atelier_items"
        heading="Collectie"
        noun="item"
        emptyText="Nog geen kunst of merchandise in de shop."
        blank={() => ({ name: '', kind: productKinds[0], price: 0, published: true })}
        validate={(p) => (!p.name.trim() ? 'Geef het item een naam.' : !(p.price > 0) ? 'Vul een prijs in.' : null)}
        row={(p) => ({
          image: p.image,
          title: p.name,
          meta: p.stock === undefined ? p.kind : p.stock === 0 ? `${p.kind} · uitverkocht` : `${p.kind} · ${p.stock} op voorraad`,
          side: formatPrice(p.price),
        })}
        Form={ProductForm}
      />
      <HeroSettings />
    </DashboardShell>
  );
}
