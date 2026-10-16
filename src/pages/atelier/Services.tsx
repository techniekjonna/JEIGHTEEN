import { Gem, Package, PenTool } from 'lucide-react';
import { useT } from '../../i18n/LanguageContext';

const SERVICES = [
  {
    icon: Gem,
    title: { en: 'Small Editions', nl: 'Kleine oplage' },
    text: {
      en: 'Clothing and prints are made in limited runs. When an edition is gone, it is gone.',
      nl: 'Kleding en prints worden in beperkte aantallen gemaakt. Is een oplage op, dan is hij op.',
    },
  },
  {
    icon: Package,
    title: { en: 'Packed with Care', nl: 'Met zorg verpakt' },
    text: {
      en: 'Every order is checked and packed by hand in the atelier before it leaves.',
      nl: 'Elke bestelling wordt in het atelier met de hand gecontroleerd en ingepakt.',
    },
  },
  {
    icon: PenTool,
    title: { en: 'Commissions', nl: 'Werk op aanvraag' },
    text: {
      en: 'Looking for a piece made for you or your space? Get in touch and we will talk it through.',
      nl: 'Op zoek naar een stuk speciaal voor jou of je ruimte? Neem contact op, dan bespreken we het.',
    },
  },
] as const;

/** "Services" row, like the reference: a heading and three quiet columns with an icon each. */
export function Services() {
  const t = useT();
  return (
    <section className="services" aria-labelledby="services-title">
      <h2 id="services-title" className="services__title">
        {t('JEIGHTEEN ATELIER Services', 'JEIGHTEEN ATELIER Services')}
      </h2>
      <div className="services__grid">
        {SERVICES.map(({ icon: Icon, title, text }) => (
          <article key={title.en} className="service">
            <Icon size={26} strokeWidth={1.1} aria-hidden="true" />
            <h3 className="service__title">{t(title.en, title.nl)}</h3>
            <p className="service__text">{t(text.en, text.nl)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
