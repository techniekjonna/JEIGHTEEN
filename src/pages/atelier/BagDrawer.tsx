import { Minus, Plus } from 'lucide-react';
import { Drawer } from '../../components/Drawer';
import { formatPrice, products } from '../../data/products';
import { useShop } from './ShopContext';

export function BagDrawer() {
  const { lines, total, count, bagOpen, setBagOpen, add, decrement, remove } = useShop();
  const close = () => setBagOpen(false);

  return (
    <Drawer
      open={bagOpen}
      onClose={close}
      side="right"
      label="Bag"
      footer={
        count > 0 && (
          <div className="bag__foot">
            <p className="bag__total">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </p>
            <button type="button" className="btn" disabled>
              Checkout
            </button>
            <p className="bag__note">Demo shop — checkout is not connected yet.</p>
          </div>
        )
      }
    >
      {count === 0 ? (
        <p className="bag__empty">Your bag is empty.</p>
      ) : (
        <ul className="bag__list">
          {lines.map((line) => {
            const product = products.find((p) => p.id === line.id);
            if (!product) return null;
            return (
              <li key={line.id} className="bag__line">
                <div className="bag__thumb" />
                <div className="bag__info">
                  <p className="bag__name">{product.name}</p>
                  <p className="bag__kind">{product.kind}</p>
                  <div className="bag__qty">
                    <button type="button" className="icon-btn" onClick={() => decrement(line.id)} aria-label={`Fewer ${product.name}`}>
                      <Minus size={16} strokeWidth={1.25} />
                    </button>
                    <span aria-live="polite">{line.qty}</span>
                    <button type="button" className="icon-btn" onClick={() => add(line.id)} aria-label={`More ${product.name}`}>
                      <Plus size={16} strokeWidth={1.25} />
                    </button>
                  </div>
                </div>
                <div className="bag__side">
                  <p>{formatPrice(product.price * line.qty)}</p>
                  <button type="button" className="text-link" onClick={() => remove(line.id)}>
                    Remove
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
