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
| `/atelier/dashboard` | Beheer van kunst en merchandise (alleen atelier-beheerders) |
| `/music/dashboard`   | Beheer van releases (alleen music-beheerders)              |

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

## Dashboards en Firebase

ATELIER en MUSIC hebben elk een eigen dashboard, eigen collectie (`atelier_items`, `music_releases`), eigen fotomap in Storage (`atelier/`, `music/`) en eigen beheerdersrecht.
Net als de JonnaRincon-site krijgt elk account vanzelf `users/{uid}` met `role: 'user'`. Zet `role` op `admin` in de Firebase-console om iemand het dashboard te geven. Zie `firestore.rules` en `storage.rules`.

Zonder Firebase-config draait alles in proefmodus (localStorage, alleen in die browser).
Koppelen: vul `src/lib/firebase.config.ts` of zet `VITE_FIREBASE_*` in Vercel. Daarna in Firebase: Authentication (e-mail/wachtwoord) aan,
Firestore en Storage aanmaken (Storage vraagt het Blaze-abonnement), regels plaatsen, account maken via het inlogpaneel en daarna in Firestore bij `users` de `role` van dat account op `admin` zetten.

`vercel.json` stuurt alle routes naar de app, zodat `/atelier/dashboard` ook na verversen werkt.
