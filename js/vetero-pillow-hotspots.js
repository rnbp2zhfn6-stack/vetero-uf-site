/* VeteRo – klickbara detaljer på originalfotot av örngottet. */
(() => {
  const experience = document.querySelector("[data-pillow-experience]");
  if (!experience) return;

  const details = {
    cover: {
      eyebrow: "Örngott",
      title: "Örngottet",
      copy: "Örngottet är sytt av restmaterial från flera företag. Det omsluter innerkudden och är en separat del.",
      image: "https://static.wixstatic.com/media/f8d78f_f5e9b9fe74a645b3b34e7b7b2493d271~mv2.jpg",
      alt: "Foto av två VeteRo-vetekuddar med knytband"
    },
    ties: {
      eyebrow: "Knytband",
      title: "Fäst kudden där du vill ha den",
      copy: "Knytbanden sitter vid båda kortsidorna och gör det möjligt att fästa VeteRo där du använder den.",
      image: "https://static.wixstatic.com/media/f8d78f_f5e9b9fe74a645b3b34e7b7b2493d271~mv2.jpg",
      alt: "Foto av två VeteRo-vetekuddar med knytband"
    },
    inner: {
      eyebrow: "Innerkudde",
      title: "Innerkudden",
      copy: "Innerkudden är en separat del, sydd med sömmar både vertikalt och horisontellt så att vetet delas upp i fack.",
      image: "https://static.wixstatic.com/media/f8d78f_01e40ff17a474e94b4c10228e103fcfb~mv2.jpg",
      alt: "Originalfoto av VeteRos innerkudde med sydda fack"
    },
    wheat: {
      eyebrow: "Vetefyllning",
      title: "Vete från Trädet",
      copy: "Kudden är fylld med vete från Skräddaregårdens Lantbruk i Trädet.",
      image: "https://static.wixstatic.com/media/f8d78f_f0cae0d11c2f48ba915a29956e260f4b~mv2.png",
      alt: "Originalfoto av vetefyllningen till VeteRo"
    }
  };

  const title = experience.querySelector("[data-pillow-info-title]");
  const copy = experience.querySelector("[data-pillow-info-copy]");
  const eyebrow = experience.querySelector(".pillow-info-eyebrow");
  const detailImage = experience.querySelector("[data-pillow-info-image]");
  const hotspots = [...experience.querySelectorAll("[data-pillow-hotspot]")];

  hotspots.forEach(button => {
    button.addEventListener("click", () => {
      const detail = details[button.dataset.pillowHotspot];
      if (!detail || !title || !copy || !eyebrow || !detailImage) return;

      hotspots.forEach(item => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      eyebrow.textContent = detail.eyebrow;
      title.textContent = detail.title;
      copy.textContent = detail.copy;
      detailImage.src = detail.image;
      detailImage.alt = detail.alt;
    });
  });
})();
