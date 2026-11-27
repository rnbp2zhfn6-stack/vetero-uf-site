const root = document.querySelector(".vr-explorer");

if (root) {
  const photo = root.querySelector("[data-vr-photo]");
  const caption = root.querySelector("[data-vr-caption]");
  const selectButtons = [...root.querySelectorAll("[data-vr-select]")];
  const title = root.querySelector("[data-vr-title]");
  const eyebrow = root.querySelector("[data-vr-eyebrow]");
  const description = root.querySelector("[data-vr-description]");
  const index = root.querySelector("[data-vr-index]");
  const facts = root.querySelector("[data-vr-facts]");
  const previous = root.querySelector("[data-vr-prev]");
  const next = root.querySelector("[data-vr-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const layers = [
    {
      id: "cover",
      image: "https://static.wixstatic.com/media/f8d78f_65e624ea5bc04388900ea530c4e6e651~mv2.jpg",
      alt: "VeteRos beige ytterfodral med knytband",
      caption: "01 / 03 · Ytterfodral",
      title: "Ytterfodral",
      eyebrow: "Yttre lager",
      description: "Det beige ytterfodralet omsluter innerkudden och har knytband som gör att VeteRo kan fästas där den används.",
      facts: [
        ["Material", "Bomullstyg"],
        ["Ursprung", "Spillmaterial från Andersson & Hjalmarsson"],
        ["Detalj", "Knytband"]
      ]
    },
    {
      id: "inner",
      image: "https://static.wixstatic.com/media/f8d78f_01e40ff17a474e94b4c10228e103fcfb~mv2.jpg",
      alt: "VeteRos svarta innerkudde med sydda fack",
      caption: "02 / 03 · Innerkudde",
      title: "Innerkudde",
      eyebrow: "Inre lager",
      description: "Innerkudden är sydd i separata fack som hjälper till att hålla vetefyllningen jämnare fördelad.",
      facts: [
        ["Konstruktion", "Sydda fack"],
        ["Funktion", "Hjälper till att hålla vetet jämnare fördelat"],
        ["Fyllning", "Vete"]
      ]
    },
    {
      id: "wheat",
      image: "https://static.wixstatic.com/media/f8d78f_f0cae0d11c2f48ba915a29956e260f4b~mv2.png",
      alt: "Närbild på vetekorn som används som fyllning i VeteRo",
      caption: "03 / 03 · Vetefyllning",
      title: "Vetefyllning",
      eyebrow: "Fyllning",
      description: "Vetet från Skräddaregårdens Lantbruk i Trädet fyller innerkuddens separata kanaler.",
      facts: [
        ["Material", "Vete"],
        ["Ursprung", "Skräddaregårdens Lantbruk, Trädet"],
        ["Placering", "I innerkuddens sydda fack"]
      ]
    }
  ];

  const layerById = new Map(layers.map((layer, layerIndex) => [layer.id, layerIndex]));
  let selected = 0;
  let imageRequest = 0;

  function setSelected(value) {
    selected = Math.max(0, Math.min(layers.length - 1, value));
    const item = layers[selected];
    const requestId = ++imageRequest;

    selectButtons.forEach(button => {
      const active = layerById.get(button.dataset.vrSelect) === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const applyImage = () => {
      if (requestId !== imageRequest) return;
      photo.src = item.image;
      photo.alt = item.alt;
      caption.textContent = item.caption;
      photo.classList.remove("is-changing");
    };

    photo.classList.add("is-changing");
    if (reduceMotion) {
      applyImage();
    } else {
      const preload = new Image();
      preload.onload = applyImage;
      preload.onerror = applyImage;
      preload.src = item.image;
    }

    index.textContent = String(selected + 1).padStart(2, "0") + " / 03";
    eyebrow.textContent = item.eyebrow;
    title.textContent = item.title;
    description.textContent = item.description;

    facts.replaceChildren(...item.facts.map(([label, value]) => {
      const row = document.createElement("div");
      const key = document.createElement("span");
      const val = document.createElement("strong");
      key.textContent = label;
      val.textContent = value;
      row.append(key, val);
      return row;
    }));

    previous.disabled = selected === 0;
    next.disabled = selected === layers.length - 1;
  }

  selectButtons.forEach(button => {
    const indexForLayer = layerById.get(button.dataset.vrSelect);
    if (indexForLayer === undefined) {
      button.disabled = true;
      return;
    }
    button.addEventListener("click", () => setSelected(indexForLayer));
  });

  previous.addEventListener("click", () => setSelected(selected - 1));
  next.addEventListener("click", () => setSelected(selected + 1));
  setSelected(0);
}
