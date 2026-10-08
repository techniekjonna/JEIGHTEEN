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

## Fonts

- Koppen en titels: **Helvetica Neue** (zelfde als het logo). Dit font is commercieel en zit niet in de repo:
  Apple-apparaten tonen het echte font, Windows/Android vallen terug op Helvetica/Arial.
  Voor overal hetzelfde resultaat is een webfont-licentie nodig (Monotype), dan self-hosten en `--font-display` in `src/styles/base.css` aanpassen.
- Overige tekst (labels, knoppen, prijzen): Jost, self-hosted via `@fontsource-variable/jost`.

## Navigatie

- In de banner van `/atelier` en `/music`: `MENU | JEIGHTEEN ATELIER | JEIGHTEEN MUSIC`, de actieve site is vet. Onder 1280px staat dezelfde schakelaar bovenaan het menu.
- Categoriepagina's per site komen in `src/data/navigation.ts` (`categories`) en verschijnen automatisch in het menu van die site.

## Logo

`public/jeighteen-logo.png` (woordmerk) en `public/jeighteen-mark.png` (monogram, bovenin het menu) zijn zwart op transparant.
In de UI worden ze als CSS-mask gebruikt (`Logo.tsx`, `Mark.tsx`), zodat ze de tekstkleur volgen (zwart/wit, en omgekeerd over de film).

## Let op

`src/pages/{Login,Register,Dashboard,Projecten,Instellingen}Page.tsx`, `src/contexts/AuthContext.tsx`,
`src/lib/firebase.ts` en `src/components/{ui,layout}` komen uit de oude JonnaBasis-starter en worden niet meer gebruikt.
