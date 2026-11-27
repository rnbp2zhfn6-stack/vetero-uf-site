# TODO-FYLL-I – uppgifter som VeteRo UF behöver bekräfta

Okända uppgifter har inte fyllts i på chans. Uppdatera dem när ni har kontrollerat dem med gruppen, handledaren eller UF-rådgivaren.

## Pris, betalning och leverans
- [ ] Bekräfta om 249 kr är slutpriset inklusive eventuella skatter/moms enligt er UF-situation.
- [ ] Bestäm och skriv in betalningssätt. Om Swish används: bekräfta vilket konto/nummer som ska visas och hur betalningen ska göras.
- [ ] Bestäm fraktalternativ, fraktpris och ungefärlig leveranstid.
- [ ] Bekräfta om upphämtning i Ulricehamn erbjuds, var den sker och om den kostar något.
- [ ] Bestäm om ni kan lova en svarstid på köpförfrågningar.
- [ ] Bekräfta lagerstatus och vem som uppdaterar den.
- [ ] Bestäm sista beställningsdag för leverans före jul 2026.
- [ ] Bekräfta om presentinslagning eller meddelandekort erbjuds.

## Produkt och säkerhet
- [ ] Väg en färdig kudde och bekräfta vikt.
- [ ] Mät mängden vete per kudde.
- [ ] Bekräfta uppvärmningsinstruktioner för just VeteRo: mikro, effekt, tid, eventuell paus och eventuella krav på vattenglas.
- [ ] Bekräfta om ugn får användas och i så fall exakt metod.
- [ ] Bekräfta hur kudden ska förberedas för kall användning och om frysförvaring är tillåten.
- [ ] Bekräfta tvättråd för örngottet. Det är separerbart från innerkudden, men tvättinstruktion är inte bekräftad.
- [ ] Bekräfta råd om lukt, förvaring och livslängd om ni vill svara på dessa frågor.
- [ ] Låt en kunnig vuxen/handledare läsa säkerhetsinformationen och bruksanvisningen innan den publiceras som slutlig.

## Företagsinformation och juridik
- [ ] Bekräfta UF-regionens exakta namn och hur skolan ska anges.
- [ ] Lägg till officiell postadress eller reklamationsadress.
- [ ] Utse vem som ansvarar för personuppgifter för UF-företaget och kontrollera med handledare hur det ska anges.
- [ ] Bekräfta e-postleverantör, lagringsplats och hur länge e-post med köpförfrågningar sparas.
- [ ] Kontrollera moms-/skatteuppgifter och vilket pris som ska visas för konsument.
- [ ] Be UF-rådgivare eller lärare granska köp- och leveransvillkor, ångerrätt, reklamation och integritetstext.
- [ ] Bekräfta att materialleverantörer och partners godkänt att namnges och eventuellt länkas.

## Hållbarhet och förtroende
- [ ] Börja föra statistik om mängd restmaterial som faktiskt används, om ni vill ange en siffra.
- [ ] Publicera bara riktiga kundomdömen efter att de samlats in och godkänts.
- [ ] Samla originalbilder på kudden, teamet och sömnaden för framtida bildbyte.
- [ ] Ta fram bildfriläggning av originalfotona och exportera optimerade WebP/AVIF-versioner.

## Teknisk publicering
- [ ] Kontrollera att senaste commit har publicerats av GitHub Pages.
- [ ] Testa webbplatsen på 360, 390, 768 och 1280 px.
- [x] Lägg till Lighthouse CI för startsida och produktsida i mobil- och desktopläge.
- [ ] Kör första Lighthouse-kontrollen och granska rapporterna.
- [ ] Validera HTML, JSON-LD och länkar efter publicering.

## Kodplatser
- Vanliga värden som pris, mejl, storlek, lager, frakt, betalning och juldeadline: js/site-config.js.
- Bekräftade uppgifter som saknas i kundtext markeras med TODO-FYLL-I-kommentarer i js/site-config.js och i denna fil.


## Interaktioner – del 2
- [ ] Ta fram nya verkliga fotovinklar och detaljbilder på VeteRo om en mer utförlig produktvisning ska byggas.
- [ ] Ta närbilder på tyg och sömmar om en trovärdig materialtextur önskas.
- [ ] Testa knyt/lossa-illustrationen och hero-rörelsen med riktiga användare på mobil och desktop.
- [ ] Kör Lighthouse-flödet i GitHub Actions och granska mobil- och desktoprapporterna.
- [ ] Kontrollera mobilens köpfält med tangentbord öppet, skärmläsare och iOS Safari.
- [ ] Verifiera sticky-galleri på låg skärm och med webbläsarzoom.
- [ ] Testa reducerad rörelse, JavaScript avstängt och webbläsare utan IntersectionObserver.
- [ ] Mät scrollprestanda på en vanlig mellanklasstelefon innan fler effekter läggs till.
- [ ] Besluta om pinned scrollscen och Three.js behövs efter bildmaterial och prestandatester. De är avstängda i nuvarande version.
