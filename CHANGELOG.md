# Ändringslogg

## 27 november 2026 – del 2, försiktig interaktion

- Skapat en separat arbetsgren: `feature/del2-safe-enhancements`. Produktionsgrenen `main` är oförändrad.
- Lagt till `js/vetero-effects-config.js` med separata reglage för de nya effekterna.
- Lagt till en lätt 2.5D-rörelse på startsidans befintliga produktfoto, med tryckknapp, återställning och pekarrörelse.
- Lagt till en separat, förenklad SVG-illustration för att knyta och lossa banden. Den förväxlas inte med ett frilagt produktfoto.
- Lagt till femstegsberättelse i vanligt dokumentflöde, med länkar till stegen och scrollmarkering.
- Lagt till en schematisk kornillustration med tangentbordsstyrt reglage och tydlig märkning att den inte är en mätning.
- Lagt till mobilens snabba mejlknapp, läsprogress, krympande desktop-header och sticky produktgalleri på större skärmar.
- Lagt till försiktiga FAQ-övergångar där webbläsaren stöder dem.
- Förbättrat fallback utan JavaScript och lagt till `EFFECTS.md`.
- Inga externa paket eller tredjepartsbibliotek installerades. Three.js, GSAP, ScrollTrigger, Lenis och Matter.js används inte.
- Ingen Lighthouse-mätning, fysisk enhetstestning eller FPS-verifiering har utförts. Gränsen 90 poäng är därför inte verifierad.

## 27 november 2026

## 27 november 2026

### Copy och produktinformation
- Skrivit om startsidans huvudbudskap så det beskriver vad VeteRo är och hur knytbanden används.
- Kortat startsidans material- och FAQ-text för att minska upprepningar.
- Utökat produktens FAQ med frågor om storlek, knytband, uppvärmning, kall användning, frys, skötsel, barn, allergi, present, frakt och betalning.
- Behållit 249 kr, 15 × 60 cm, materialursprung och lokal sömnad.
- Lagt in säkerhetstext som hänvisar till den medföljande bruksanvisningen och inte hittar på värmetider.

### Köpflöde
- Behållit beställning via e-post.
- Lagt till kopieringsknapp för e-postadress med statusmeddelande.
- Förklarat de tre stegen från förfrågan till bekräftat köp.
- Tagit bort pilar som antydde att interna länkar och mejlknappar öppnar externa sidor.
- Lagt till js/site-config.js för pris, storlek och e-post.

### Tillgänglighet och teknik
- Lagt till hoppa-till-innehåll-länk.
- Lagt till aria-controls på mobilmenyn.
- Förbättrat alt-texter på produktminiatyrer och logotyp.
- Förbättrat tangentbordshantering och fokusåtergång i produktens lightbox.
- Tagit bort GSAP-skript från produktsidan eftersom de inte används där.
- Lagt till unika sidtitlar och beskrivningar, canonical, Open Graph/Twitter och strukturerad data.

### Förtroende och juridik
- Skapat villkor.html och integritet.html.
- Skapat TODO-FYLL-I.md med uppgifter som saknas.
- Lagt till sitemap, robots, 404 och favicon.
- Flyttat QR-koden från startsidans kontaktsektion till en separat utskriftssida.
- Behållit QR-filen för tryckmaterial.

### Ej genomfört
- Ingen riktig bakgrundsfriläggning av produktbilderna.
- Ingen bildkonvertering till AVIF/WebP.
- Ingen extern analyskod.
- Ingen fullständig Lighthouse-, enhets- eller skärmläsartestning.
