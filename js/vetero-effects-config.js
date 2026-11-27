/* VeteRo – effekter som går att slå av var för sig.
   Den här filen laddas tidigt. Om JavaScript är avstängt ligger html kvar som no-js. */
(function () {
  "use strict";

  const settings = {
    heroPillow: true,
    scrollStory: true,
    grainDemo: true,
    stickyPurchaseBar: true,
    stickyGallery: true,
    headerShrink: true,
    scrollProgress: true,
    faqMotion: true,

    /* Avstängda tills riktiga bilder och tester finns. */
    heroThreeD: false,
    scrollStoryPin: false,
    smoothScroll: false,
    deviceTilt: false
  };

  window.VETERO_EFFECTS = Object.freeze(settings);
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");
})();
