# JEIGHTEEN

Verzamelplek voor **JEIGHTEEN MUSIC** en **JEIGHTEEN ATELIER**. Vite + React + TypeScript + Tailwind.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

## Routes

| Route      | Wat                                                        |
| ---------- | ---------------------------------------------------------- |
| `/`        | Wit (of zwart) landingsscherm met logo, MUSIC en ATELIER   |
| `/atelier` | Demo-webshop (transparante header over film, selectie, tas) |
| `/music`   | Placeholder ("Coming soon")                                |

Dag/nacht staat in het menu (linksboven) en wordt onthouden in `localStorage`.

## Atelier-film toevoegen

Zet de video op `public/media/atelier-hero.mp4` (H.264, liefst < 8 MB, 1080p of lager, zonder geluid of met).
Zolang het bestand er niet is, toont de hero een donkere placeholder.
Teksten en het pad staan in `src/pages/atelier/content.ts`, producten in `src/data/products.ts`.

## Logo

`public/jeighteen-logo.png` is zwart op transparant. In de UI wordt het als CSS-mask gebruikt
(`src/components/Logo.tsx`), zodat het de tekstkleur volgt (zwart/wit, en omgekeerd over de film).

## Let op

`src/pages/{Login,Register,Dashboard,Projecten,Instellingen}Page.tsx`, `src/contexts/AuthContext.tsx`,
`src/lib/firebase.ts` en `src/components/{ui,layout}` komen uit de oude JonnaBasis-starter en worden niet meer gebruikt.
