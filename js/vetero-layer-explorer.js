const root = document.querySelector(".vr-explorer");
if (root) {
  const layerNodes = [...root.querySelectorAll("[data-vr-layer]")];
  const selectButtons = [...root.querySelectorAll("[data-vr-select]")];
  const title = root.querySelector("[data-vr-title]");
  const eyebrow = root.querySelector("[data-vr-eyebrow]");
  const description = root.querySelector("[data-vr-description]");
  const index = root.querySelector("[data-vr-index]");
  const facts = root.querySelector("[data-vr-facts]");
  const previous = root.querySelector("[data-vr-prev]");
  const next = root.querySelector("[data-vr-next]");
  const stage = root.querySelector("[data-vr-stage]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const layers = [
    {
      id: "cover", title: "Örngott", eyebrow: "Yttre lager",
      description: "Det avtagbara yttersta lagret som omsluter innerkudden. Tyget kommer från spillmaterial från Andersson & Hjalmarsson.",
      facts: [["Material", "Bomullstyg"], ["Ursprung", "Andersson & Hjalmarsson"], ["Funktion", "Omsluter innerkudden"]]
    },
    {
      id: "inner", title: "Innerkudde", eyebrow: "Mellanlager",
      description: "Innerkudden håller vetefyllningen på plats. Den är sydd i separata kanaler som hjälper till att hålla vetet jämnare fördelat.",
      facts: [["Konstruktion", "Indelade kanaler"], ["Material", "Tyg från spillmaterial"], ["Funktion", "Håller fyllningen på plats"]]
    },
    {
      id: "grain", title: "Vetefyllning", eyebrow: "Innersta lager",
      description: "Kudden fylls med vete från Skräddaregårdens Lantbruk i Trädet. Vete ger kudden dess tyngd och används för att hålla värme eller kyla.",
      facts: [["Innehåll", "Vete"], ["Ursprung", "Skräddaregårdens Lantbruk, Trädet"], ["Egenskap", "Naturlig fyllning"]]
    }
  ];
  let selected = 0;
  let scrollTimeline = null;

  function setSelected(value, animate = true) {
    selected = Math.max(0, Math.min(layers.length - 1, value));
    const item = layers[selected];
    selectButtons.forEach((button, i) => {
      const active = i === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    layerNodes.forEach(node => {
      const active = node.dataset.vrLayer === item.id;
      node.classList.toggle("is-selected", active);
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
    if (animate && window.gsap && !reduceMotion) {
      window.gsap.fromTo(".vr-info > *", { y: 9, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: .32, stagger: .035, ease: "power2.out", overwrite: true
      });
    }
  }

  selectButtons.forEach((button, i) => button.addEventListener("click", () => setSelected(i)));
  previous.addEventListener("click", () => setSelected(selected - 1));
  next.addEventListener("click", () => setSelected(selected + 1));

  if (window.gsap && !reduceMotion) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const cover = root.querySelector('[data-vr-layer="cover"]');
    const inner = root.querySelector('[data-vr-layer="inner"]');
    const grain = root.querySelector('[data-vr-layer="grain"]');
    gsap.registerPlugin(ScrollTrigger);
    gsap.set([cover, inner, grain], { transformOrigin: "50% 50%" });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 851px)", () => {
      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top+=76",
          end: "+=720",
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      scrollTimeline
        .to(cover, { y: -118, x: -18, rotation: -7, scale: 1.02, ease: "none" }, 0)
        .to(inner, { y: 0, x: 0, rotation: 0, scale: 1, ease: "none" }, 0)
        .to(grain, { y: 118, x: 18, rotation: 7, scale: 1.02, ease: "none" }, 0);
      return () => { scrollTimeline?.scrollTrigger?.kill(); scrollTimeline?.kill(); scrollTimeline = null; };
    });
    mm.add("(max-width: 850px)", () => {
      gsap.fromTo(layerNodes, { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1, y: 0, duration: .65, stagger: .12, ease: "power2.out",
        scrollTrigger: { trigger: stage, start: "top 82%", once: true }
      });
    });
    layerNodes.forEach(node => node.addEventListener("click", () => {
      const i = layers.findIndex(item => item.id === node.dataset.vrLayer);
      if (i !== -1) setSelected(i);
    }));
  } else {
    layerNodes.forEach(node => node.addEventListener("click", () => {
      const i = layers.findIndex(item => item.id === node.dataset.vrLayer);
      if (i !== -1) setSelected(i, false);
    }));
  }
  setSelected(0, false);
}
