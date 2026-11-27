# VeteRo – webbplatsens interaktioner

**Uppdaterad:** 27 november 2026  
**Aktiv version:** `main`.

## Startsidan
- Fyra klickbara markörer visar information om örngottet, knytbanden, innerkudden och vetefyllningen.
- Informationskortet byter text och visar den relevanta originalbilden.
- Kornreglaget visar en förenklad SVG-illustration av hur fyllning kan röra sig i en kudde med respektive utan fack. Den är inte en exakt simulering eller mätning.

## Produktsidan
- Bildminiatyrer byter huvudbild.
- Huvudbilden öppnas i en lightbox som kan stängas med Escape och som hanterar tangentbordsfokus.
- Ett snabbt beställningsfält kan visas på mobil när huvudknappen har passerats. Det döljs när ordinarie köpknapp eller sidfot är synlig.

## Gemensamt
- Mobilmenyn kan öppnas och stängas med knappen, Escape eller genom att trycka utanför menyn.
- Läsprogress och diskret headerförminskning används när effekterna är aktiverade.
- Kopiera e-postadress ger statusmeddelande.
- Respekt för `prefers-reduced-motion`; animationer och övergångar reduceras.

## Medvetet inte implementerat
- Ingen falsk 3D-modell eller påstådd tygsimulering.
- Ingen pinned scrollscen eller sensorstyrning.
- Ingen extra animation som låser, fångar eller ändrar sidans scroll.
- En riktig 360-gradersvisning kräver fler verkliga produktvinklar eller ett separat 3D-underlag.

## Kvalitetskontroll
Lighthouse CI kör startsidan och produktsidan i mobil- och desktopläge. Rapporterna sparas som GitHub Actions-artifacts och är tillgängliga i 14 dagar. Kontrollen samlar mätvärden; den sätter ännu inga hårda poänggränser innan en första baslinje har mätts.

## Tillgänglighet
- Markörerna är vanliga knappar och fungerar med tangentbord.
- Utan JavaScript är sidans grundinformation och bilder fortfarande synliga.
- Sidans scroll låses inte.
- Reducerad rörelse respekteras.
