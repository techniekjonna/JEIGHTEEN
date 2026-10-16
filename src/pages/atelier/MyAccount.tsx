import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Check, Heart } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { useT } from '../../i18n/LanguageContext';
import { saveUserProfile, useUserProfile } from '../../lib/userProfile';
import { useShop } from './ShopContext';
import { useNavigate } from 'react-router-dom';

/** What a signed-in visitor sees in the sign-in panel: greeting, own name, wishlist, sign out. */
export function MyAccount({
  email,
  uid,
  isAdmin,
  dashboardButton,
  signOutButton,
  onClose,
}: {
  email: string | null;
  uid: string | null;
  isAdmin: boolean;
  dashboardButton: ReactNode;
  signOutButton: ReactNode;
  onClose: () => void;
}) {
  const t = useT();
  const navigate = useNavigate();
  const profile = useUserProfile(uid);
  const { products, wishlist, toggleWish, add } = useShop();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const wishes = products.filter((p) => wishlist.has(p.id));
  const first = (profile?.name || '').split(' ')[0];

  const saveName = async (e: FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    try {
      await saveUserProfile(uid, { name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* keep quiet, the field keeps its value */
    }
  };

  const toCollection = () => {
    onClose();
    navigate('/atelier/all');
  };

  return (
    <div className="account myacc">
      <div>
        <h2 className="myacc__title">{first ? t(`Hello ${first}`, `Hoi ${first}`) : t('My account', 'Mijn account')}</h2>
        <p className="account__text">{email}</p>
      </div>

      {isAdmin && dashboardButton}

      <form className="myacc__name" onSubmit={saveName}>
        <label htmlFor="myacc-name" className="myacc__label">{t('Your name', 'Je naam')}</label>
        <div className="myacc__row">
          <input id="myacc-name" className="dinput" value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="btn myacc__save" disabled={!profile || name.trim() === profile.name}>
            {saved ? <Check size={18} strokeWidth={1.5} aria-label={t('Saved', 'Opgeslagen')} /> : t('Save', 'Opslaan')}
          </button>
        </div>
      </form>

      <section aria-labelledby="myacc-wish">
        <h3 id="myacc-wish" className="myacc__label">
          {t('Wishlist', 'Verlanglijst')} ({wishes.length})
        </h3>
        {wishes.length === 0 ? (
          <div className="myacc__empty">
            <p className="account__text">
              {t('Tap the heart on a piece to keep it here.', 'Tik op het hartje bij een stuk om het hier te bewaren.')}
            </p>
            <button type="button" className="text-link" onClick={toCollection}>
              {t('View the collection', 'Bekijk de collectie')}
            </button>
          </div>
        ) : (
          <ul className="bag__list">
            {wishes.map((p) => (
              <li key={p.id} className="bag__line">
                <div className="bag__thumb">{p.image && <img src={p.image} alt={p.name} />}</div>
                <div className="bag__info">
                  <p className="bag__name">{p.name}</p>
                  <p className="bag__kind">{formatPrice(p.price)}</p>
                  {p.stock !== 0 && (
                    <button type="button" className="text-link" onClick={() => add(p.id)}>
                      {t('Add to bag', 'In je tas')}
                    </button>
                  )}
                </div>
                <div className="bag__side">
                  <button type="button" className="icon-btn" onClick={() => toggleWish(p.id)}
                    aria-label={t(`Remove ${p.name} from wishlist`, `${p.name} van verlanglijst halen`)}>
                    <Heart size={18} strokeWidth={1.25} fill="currentColor" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {signOutButton}

    </div>
  );
}
