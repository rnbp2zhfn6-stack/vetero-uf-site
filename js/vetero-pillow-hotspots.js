/* VeteRo – klickbara pluspunkter runt den sammanhängande kudden. */
(() => {
  const experience = document.querySelector("[data-pillow-experience]");
  if (!experience) return;

  const details = {
    cover: {
      eyebrow: "Ytterfodral",
      title: "Ett mjukt ytterlager",
      copy: "Det beige ytterfodralet är sytt av restmaterial från flera företag. Det omsluter innerkudden och är en separat del."
    },
    ties: {
      eyebrow: "Knytband",
      title: "Fäst kudden där du vill ha den",
      copy: "De salviagröna knytbanden sitter vid båda kortsidorna. De gör det möjligt att knyta fast VeteRo där du använder den."
    },
    inner: {
      eyebrow: "Innerkudde",
      title: "Indelad på längden och tvären",
      copy: "Den svarta innerkudden är en separat del. Den är sydd med sömmar både vertikalt och horisontellt, så att fyllningen delas upp i fack."
    },
    wheat: {
      eyebrow: "Vetefyllning",
      title: "Vete från Trädet",
      copy: "Kudden är fylld med vete från Skräddaregårdens Lantbruk i Trädet."
    }
  };

  const title = experience.querySelector("[data-pillow-info-title]");
  const copy = experience.querySelector("[data-pillow-info-copy]");
  const eyebrow = experience.querySelector(".pillow-info-eyebrow");
  const hotspots = [...experience.querySelectorAll("[data-pillow-hotspot]")];

  hotspots.forEach(button => {
    button.addEventListener("click", () => {
      const detail = details[button.dataset.pillowHotspot];
      if (!detail || !title || !copy || !eyebrow) return;

      hotspots.forEach(item => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-expanded", String(active));
      });

      eyebrow.textContent = detail.eyebrow;
      title.textContent = detail.title;
      copy.textContent = detail.copy;
    });
  });
})();
