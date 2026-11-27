const root = document.querySelector(".vr-explorer");

if (root) {
  const stage = root.querySelector("[data-vr-stage]");
  const selectButtons = [...root.querySelectorAll("[data-vr-select]")];
  const title = root.querySelector("[data-vr-title]");
  const eyebrow = root.querySelector("[data-vr-eyebrow]");
  const description = root.querySelector("[data-vr-description]");
  const index = root.querySelector("[data-vr-index]");
  const facts = root.querySelector("[data-vr-facts]");
  const previous = root.querySelector("[data-vr-prev]");
  const next = root.querySelector("[data-vr-next]");

  const layers = [
    {
      id: "cover",
      title: "Ytterfodralet",
      eyebrow: "Yttre lager",
      description: "Det beige ytterfodralet omsluter innerkudden. Knytbanden vid kortsidorna gör att VeteRo kan fästas där den används.",
      facts: [
        ["Material", "Tyg från spillmaterial"],
        ["Ursprung", "Spillmaterial från flera olika företag"],
        ["Detalj", "Justerbara knytband"]
      ]
    },
    {
      id: "inner",
      title: "Innerkudden",
      eyebrow: "Inre lager",
      description: "Innerkudden är sydd i separata kanaler. Indelningen hjälper till att hålla vetet jämnare fördelat i kudden.",
      facts: [
        ["Material", "Spillmaterial från Andersson & Hjalmarsson"],
        ["Konstruktion", "Separata sydda fack"],
        ["Placering", "Inuti ytterfodralet"]
      ]
    },
    {
      id: "wheat",
      title: "Vetefyllningen",
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

  function setSelected(value) {
    selected = Math.max(0, Math.min(layers.length - 1, value));
    const item = layers[selected];

    stage.dataset.activeLayer = item.id;

    selectButtons.forEach(button => {
      const active = layerById.get(button.dataset.vrSelect) === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

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
