import { Minus, Plus } from 'lucide-react';
import { Drawer } from '../../components/Drawer';
import { formatPrice } from '../../data/products';
import { useShop } from './ShopContext';
import { useT } from '../../i18n/LanguageContext';

export function BagDrawer() {
  const { products, lines, total, count, bagOpen, setBagOpen, add, decrement, remove } = useShop();
  const close = () => setBagOpen(false);
  const t = useT();

  return (
    <Drawer
      open={bagOpen}
      onClose={close}
      side="right"
      label={t('Bag', 'Tas')}
      closeLabel={t('Close bag', 'Tas sluiten')}
      footer={
        count > 0 && (
          <div className="bag__foot">
            <p className="bag__total">
              <span>{t('Subtotal', 'Subtotaal')}</span>
              <span>{formatPrice(total)}</span>
            </p>
            <button type="button" className="btn" disabled>
              {t('Checkout', 'Afrekenen')}
            </button>
            <p className="bag__note">{t('Checkout is not available yet.', 'Afrekenen is nog niet beschikbaar.')}</p>
          </div>
        )
      }
    >
      {count === 0 ? (
        <p className="bag__empty">{t('Your bag is empty.', 'Je tas is leeg.')}</p>
      ) : (
        <ul className="bag__list">
          {lines.map((line) => {
            const product = products.find((p) => p.id === line.id);
            if (!product) return null;
            return (
              <li key={line.id} className="bag__line">
                <div className="bag__thumb">{product.image && <img src={product.image} alt="" />}</div>
                <div className="bag__info">
                  <p className="bag__name">{product.name}</p>
                  <p className="bag__kind">{product.kind}</p>
                  <div className="bag__qty">
                    <button type="button" className="icon-btn" onClick={() => decrement(line.id)} aria-label={t(`Fewer ${product.name}`, `Minder ${product.name}`)}>
                      <Minus size={16} strokeWidth={1.25} />
                    </button>
                    <span aria-live="polite">{line.qty}</span>
                    <button type="button" className="icon-btn" onClick={() => add(line.id)}
                      disabled={product.stock !== undefined && line.qty >= product.stock}
                      aria-label={t(`More ${product.name}`, `Meer ${product.name}`)}>
                      <Plus size={16} strokeWidth={1.25} />
                    </button>
                  </div>
                </div>
                <div className="bag__side">
                  <p>{formatPrice(product.price * line.qty)}</p>
                  <button type="button" className="text-link" onClick={() => remove(line.id)}>
                    {t('Remove', 'Verwijderen')}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
