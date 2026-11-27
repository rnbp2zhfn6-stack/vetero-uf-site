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
      image: "https://static.wixstatic.com/media/f8d78f_c6fb2311e66046919c7e4f2080a685e8~mv2.jpg",
      alt: "VeteRos beige ytterfodral med knytband",
      caption: "01 / 02 · Ytterfodral",
      title: "Ytterfodral",
      eyebrow: "Yttre lager",
      description: "Det beige ytterfodralet omsluter innerkudden och har knytband som gör att VeteRo kan fästas där den används.",
      facts: [["Material", "Bomullstyg"], ["Ursprung", "Spillmaterial från Andersson & Hjalmarsson"], ["Detalj", "Knytband"]]
    },
    {
      id: "inner",
      image: "https://static.wixstatic.com/media/f8d78f_d7f6b849de9948f7ac58f44564749b06~mv2.jpg",
      alt: "VeteRos svarta innerkudde med sydda fack",
      caption: "02 / 02 · Innerkudde",
      title: "Innerkudde",
      eyebrow: "Inre lager",
      description: "Innerkudden är sydd i separata fack som hjälper till att hålla vetefyllningen jämnare fördelad.",
      facts: [["Konstruktion", "Sydda fack"], ["Funktion", "Håller vetet på plats"], ["Fyllning", "Vete från Skräddaregårdens Lantbruk i Trädet"]]
    }
  ];
  let selected = 0;

  function setSelected(value) {
    selected = Math.max(0, Math.min(layers.length - 1, value));
    const item = layers[selected];
    selectButtons.forEach((button, i) => {
      const active = i === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    photo.classList.add("is-changing");
    const update = () => {
      photo.src = item.image;
      photo.alt = item.alt;
      caption.textContent = item.caption;
      photo.classList.remove("is-changing");
    };
    if (reduceMotion) update();
    else {
      window.setTimeout(update, 140);
    }
    index.textContent = String(selected + 1).padStart(2, "0") + " / 02";
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

  selectButtons.forEach((button, i) => button.addEventListener("click", () => setSelected(i)));
  previous.addEventListener("click", () => setSelected(selected - 1));
  next.addEventListener("click", () => setSelected(selected + 1));
  setSelected(0);
}