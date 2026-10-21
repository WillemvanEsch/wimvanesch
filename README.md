# wimvanesch.nl

Fotografie-portfolio van Wim van Esch. Next.js (App Router), gehost op Vercel.

## Foto's

Alle foto's staan in `public/photos/<collectie>/` en zijn beschreven in
`src/data/manifest.json` (collecties, volgorde, titels en de hero-selectie).

`npm run photos` haalt ontbrekende foto's op van de oude WordPress-site en schrijft
`src/data/photo-meta.json` (afmetingen, blur-placeholder en dominante kleur voor de
gloed achter elke foto). Draai `npm run photos -- --meta` na het zelf vervangen of
toevoegen van een bestand.

Een foto toevoegen: zet het bestand in `public/photos/<collectie>/`, voeg een regel toe
aan die collectie in `manifest.json` en draai `npm run photos -- --meta`.

## Ontwikkelen

```bash
npm install
npm run dev
```
