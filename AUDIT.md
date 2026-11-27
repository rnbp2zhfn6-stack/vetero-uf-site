# Granskning av VeteRo UF:s webbplats

**Datum:** 27 november 2026  
**Omfattning:** Startsida, produktsida, HTML, CSS, JavaScript, metadata och länkar i GitHub-projektet.  
**Begränsning:** Jag har granskat kod och text. Jag har inte kunnat göra fullständiga visuella tester i riktiga webbläsare eller köra Lighthouse. Därför redovisas inga Lighthouse-poäng.

## Betyg

| Område | Betyg | Bedömning |
|---|---:|---|
| Första intryck och budskap | 3/5 | Pris, produkt och Ulricehamn framgår. Den omskrivna ingressen säger tydligare vad kudden är och hur den används. |
| Copy och tonalitet | 2/5 | Tidigare text upprepade samma materialfakta och använde generiska formuleringar. Startsidan har kortats och produktsidan bär merparten av detaljerna. |
| Köpflöde | 2/5 | Köpet sker via mejl, vilket behålls enligt ert beslut. Mailto fungerar inte på alla datorer. Kopiera e-post och ett tydligt trestegsflöde har lagts till. |
| Förtroende | 3/5 | Lokal tillverkning, team och materialens ursprung är konkreta styrkor. Företagsadress, betalningsinformation, frakt och fullständig personuppgiftsinformation behöver kompletteras. |
| Produktinformation | 2/5 | Storlek, knytband, kanaler och material är kända. Vikt, mängd vete, tvättråd, värmetider och uppmätt värmehållning saknas. Dessa uppgifter har inte hittats på. |
| Juridik och konsumentinformation | 2/5 | Ångerrätt och reklamation fanns redan. Villkor och integritetssida har lagts till som utkast. UF-rådgivare eller lärare bör granska dem innan publicering som slutliga villkor. |
| SEO | 2/5 | Tidigare var titlarna lika och sitemap/robots/strukturerad data saknades. Unika titlar, canonical, social metadata, Product/Organization-data, sitemap och robots har lagts till. |
| Tillgänglighet | 3/5 | Sidan använder knappar och responsiv layout. Hoppa-länk, alt-texter, aria-controls, kopieringsfeedback och förbättrad lightbox-fokushantering har lagts till. |
| Prestanda | 2/5 | Bilder levereras från Wix CDN, vetebilden är PNG och externa fonter används. GSAP-skript som inte behövdes på produktsidan har tagits bort. Bildoptimering återstår. |
| Teknisk kvalitet | 3/5 | Enkel statisk HTML/CSS/JS är rätt nivå. Gemensam konfigurationsfil, enhetligare sidfot och separata policyfiler har lagts till. |
| Mikrodetaljer | 2/5 | Pilen på interna länkar och mejlknappar var missvisande. QR-koden hör hemma i tryckmaterial, inte i kontaktsektionen. Den har flyttats till en separat utskriftssida. |
| Mobil | 3/5 | CSS har brytpunkter för mobil och surfplatta. Riktiga tester på 360, 390, 768 och 1280 px har inte kunnat genomföras här. |

## Det som är bra och bör behållas

- VeteRo har ett konkret särskiljande: knytband och indelad innerkudde.
- Materialens olika ursprung och sömnaden i Ulricehamn ger en tydlig lokal berättelse.
- Priset 249 kr och storleken 15 × 60 cm syns.
- Teamets roller och kontaktvägar finns.
- Webbplatsen är statisk och lätt att underhålla.

## Det som bör fixas före fler beställningar

- Fyll i frakt, betalning, eventuell upphämtning och kontakt-/postadress.
- Kontrollera bruksanvisning och säkerhetsinformation mot den faktiska produkten.
- Fyll i tvätt- och skötselråd samt produktens vikt och mängd vete om ni vill ange dem.
- Komplettera integritetssidan med ansvarig, e-posthantering, lagring och gallring.
- Låt UF-rådgivare eller lärare granska villkor, momsuppgifter och konsumentinformation.
- Verifiera webbplatsens publicering och gör riktiga mobil- och webbläsartester.

## Det som kan uppgraderas senare

- Frilagda originalbilder och en riktig produktfotografering.
- Riktiga kundomdömen, först när ni har fått dem och fått tillstånd att publicera.
- Bilder på teamet och sömnaden.
- WebP/AVIF-varianter av alla produktbilder.
- Cookiefri statistik, först efter ett separat beslut.
- Riktiga mått på restmaterial som används, om ni börjar föra sådan statistik.

## Viktiga konsumenträttsliga anteckningar

Konsumentverket anger 14 dagars ångerrätt som huvudregel vid distansavtal. Myndigheten anger också att om ett avtal ingås på en webbplats eller i en app ska det finnas en ångerfunktion. VeteRos nuvarande flöde är en köpförfrågan via mejl och köpet bekräftas separat via mejl. UF-rådgivare eller lärare bör kontrollera att upplägget och informationen motsvarar reglerna som gäller för just er försäljning.

Konsumentverket anger tre års reklamationsrätt för ursprungliga fel på varor som företag säljer till konsumenter. Skriv inte in egna begränsningar av den rätten.

## Teststatus

- [x] Lästa HTML-, CSS- och JavaScript-filer i projektet.
- [x] Interna länkar och sidspecifika metadata genomgångna i koden.
- [x] Kopiera e-postfunktion implementerad.
- [x] FAQ och produkttexter uppdaterade utan att fylla i okända fakta.
- [x] Villkor, integritet, robots, sitemap och 404 skapade.
- [ ] HTML-validering via extern validator.
- [ ] Lighthouse på mobil och dator.
- [ ] Test på 360, 390, 768 och 1280 px.
- [ ] Test med skärmläsare och tangentbord i riktiga webbläsare.
- [ ] Bekräfta senaste GitHub Pages-publiceringen.
