# VeteRo UF

Officiell webbplats för VeteRo UF i Ulricehamn.

## Webbplatsen

- `index.html` – startsida med produktpresentation och klickbara detaljer
- `product.html` – produktinformation, bildgalleri, FAQ och köpförfrågan
- `villkor.html` – köp- och leveransvillkor
- `integritet.html` – integritet och personuppgifter
- `qr-kod.html` – utskriftsvänlig QR-kod
- `404.html` – felsida
- `site.css` – grund- och komponentstilar
- `site-refresh.css` – gemensamt visuellt designlager
- `js/site-config.js` – gemensamma värden för pris, e-post och storlek
- `js/vetero-storefront.js` – navigation, bildgalleri, lightbox och kopiera e-post
- `js/vetero-pillow-hotspots.js` – klickbara detaljer på VeteRos originalfoto
- `js/vetero-effects-config.js` – reglage för valbara effekter
- `js/vetero-effects.js` – korndemo, läsprogress, mobilköpfält och övriga lättviktsfunktioner

Produktfotona hämtas från VeteRos befintliga bildbibliotek. De ska inte bytas ut mot genererade bilder.

## Beställning

Beställningsförfrågningar hanteras via e-post: [vetero.uf@gmail.com](mailto:vetero.uf@gmail.com). Ett mejl är en förfrågan. Köpet bekräftas separat när kunden och VeteRo UF har kommit överens.

## Kvalitetskontroll

GitHub Actions innehåller ett Lighthouse-flöde för startsidan och produktsidan, i både mobil- och desktopläge.

- Kör manuellt under **Actions → Website performance checks → Run workflow**.
- En kontroll körs också automatiskt varje vecka.
- Rapporterna sparas som GitHub Actions-artifacts i 14 dagar. De laddas inte upp till en publik rapporttjänst.

Konfiguration:
- `.lighthouserc.json` – mobil
- `.lighthouserc.desktop.json` – desktop
- `.github/workflows/lighthouse.yml` – körning och rapportartefakter

## Dokumentation

- `AUDIT.md` – granskning av innehåll och kod
- `EFFECTS.md` – dokumentation av interaktioner
- `CHANGELOG.md` – ändringslogg
- `TODO-FYLL-I.md` – uppgifter som företaget behöver bekräfta

## Publicering

Webbplatsen publiceras med GitHub Pages på https://veterouf.com.
