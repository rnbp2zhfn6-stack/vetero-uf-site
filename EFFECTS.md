# VeteRo – effektöversikt

**Status:** Försiktig första etapp på grenen \`feature/del2-safe-enhancements\`.  
**Publicering:** Inte sammanslagen med \`main\`. Den befintliga webbplatsen påverkas inte.

## Effektreglage

Reglagen finns i \`js/vetero-effects-config.js\`. Sätt ett värde till \`false\` för att stänga av effekten.

| Reglage | Standard | Plats | Val |
|---|---:|---|---|
| \`heroPillow\` | \`true\` | Startsidan, hero | Liten CSS 2.5D-rörelse på befintligt foto. Hela fotot rör sig; ingen lokal tygdeformation. |
| \`scrollStory\` | \`true\` | Startsidan, fem steg | Vanliga kort i dokumentflödet och IntersectionObserver för aktuell markering. Ingen pinning. |
| \`grainDemo\` | \`true\` | Startsidan, korndemo | Enkel SVG-illustration med 40 schematiska korn per kudde och ett tangentbordsstyrt reglage. Inte en mätning eller fysisk modell. |
| \`stickyPurchaseBar\` | \`true\` | Produktsidan, mobil | CSS-fält som visas först när ordinarie köpknapp passerats. Döljs vid köpknapp och sidfot. |
| \`stickyGallery\` | \`true\` | Produktsidan, desktop | CSS \`position: sticky\` på bildgalleriet, med höjdbegränsad fallback. |
| \`headerShrink\` | \`true\` | Båda sidor | Den befintliga headern blir något lägre vid scroll. Den döljs inte vid scroll nedåt. |
| \`scrollProgress\` | \`true\` | Båda sidor | En tunn, dekorativ läsprogress högst upp. |
| \`faqMotion\` | \`true\` | Båda sidor | Försiktig CSS-övergång där webbläsaren stöder höjdinterpolering. Native \`details\` fungerar annars. |

## Medvetet avstängt / återstår

| Reglage | Standard | Varför |
|---|---:|---|
| \`heroThreeD\` | \`false\` | Three.js och en riktig 3D-modell är inte motiverade utan frilagda lager och en verifierad prestandabudget. |
| \`scrollStoryPin\` | \`false\` | Ingen pinned scen i den här säkra versionen. Vanlig scroll är mer förutsägbar och tillgänglig. |
| \`smoothScroll\` | \`false\` | Native scroll behålls. Lenis är inte installerat och behövs inte här. |
| \`deviceTilt\` | \`false\` | Ingen sensoråtkomst eller begäran om rörelsetillstånd. |

## Filer

- \`js/vetero-effects-config.js\` – effektreglage och tidig JS-markering.
- \`js/vetero-effects.js\` – hero-interaktion, scrollspy, korndemo, köpfält och läsprogress.
- \`site.css\` – rörelsestilar, responsiv layout, sticky och reducerad rörelse.
- \`index.html\` – hero-kontroller, fem steg och korndemo.
- \`product.html\` – sticky galleri och mobilt köpfält.

## Begränsningar och TODO

- Hero-fotot är inte frilagt. Den lilla rörelsen påverkar hela bilden, inte bara tygytan.
- Knytbanden kan inte animeras var för sig förrän de finns som separata bilder eller SVG-lager.
- Scroll-historien är en vanlig vertikal sekvens. Pinned desktop-scen är inte aktiverad.
- Three.js, GSAP, ScrollTrigger, Lenis och Matter.js används inte.
- Ingen Lighthouse-körning eller fysisk enhetstestning har utförts i denna miljö. Inga poäng eller FPS-resultat påstås.
- Före/efter-mätning kräver att den här grenen körs i en riktig webbläsare med samma testförhållanden.

## Tillgänglighet och fallback

- JavaScript markeras tidigt. Utan JavaScript är innehåll och \`.reveal\`-element synliga.
- Kuddens animation har knappar som alternativ till pekinteraktion.
- Korndemon använder en vanlig range-kontroll som fungerar med tangentbord.
- Dekorativa SVG-grafiker är dolda för skärmläsare; förklaringen finns som text.
- \`prefers-reduced-motion\` stänger av hero-rörelsen och rörelseövergångar, men lämnar innehåll och kontroller kvar.
- Sidans scroll låses aldrig.
