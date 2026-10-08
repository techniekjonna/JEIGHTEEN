import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { products } from '../../data/products';

interface CartLine {
  id: string;
  qty: number;
}

interface ShopContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  /** Adds one and opens the bag. */
  add: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  wishlist: ReadonlySet<string>;
  toggleWish: (id: string) => void;
  query: string;
  setQuery: (query: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

/** In-memory demo state: bag, wishlist and search. Nothing is persisted or sent anywhere. */
export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [wishlist, setWishlist] = useState<ReadonlySet<string>>(new Set());
  const [query, setQuery] = useState('');

  const add = useCallback((id: string) => {
    setLines((prev) =>
      prev.some((l) => l.id === id) ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { id, qty: 1 }]
    );
    setBagOpen(true);
  }, []);

  const decrement = useCallback((id: string) => {
    setLines((prev) => prev.flatMap((l) => (l.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : [])));
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<ShopContextValue>(() => {
    const price = new Map(products.map((p) => [p.id, p.price]));
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((sum, l) => sum + (price.get(l.id) ?? 0) * l.qty, 0),
      add,
      decrement,
      remove,
      bagOpen,
      setBagOpen,
      wishlist,
      toggleWish,
      query,
      setQuery,
    };
  }, [lines, bagOpen, wishlist, query, add, decrement, remove, toggleWish]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
