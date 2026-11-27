/* VeteRo – små, fristående förbättringar utan externa bibliotek. */
const effects = window.VETERO_EFFECTS || {};
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isEnabled = name => effects[name] !== false;

if (!isEnabled("heroPillow")) {
  document.querySelectorAll("[data-pillow-press], [data-pillow-reset], [data-band-toggle]").forEach(control => {
    control.hidden = true;
  });
}
if (!isEnabled("grainDemo")) {
  document.querySelector("[data-grain-demo]")?.classList.add("is-static");
}

if (isEnabled("stickyGallery")) document.documentElement.classList.add("effects-sticky-gallery");
if (isEnabled("faqMotion") && !reduceMotion) document.documentElement.classList.add("effects-faq-motion");

/* 1. Lätt 2.5D-rörelse på den befintliga produktbilden.
   Hela fotot rör sig mycket lite. Det är inte en fysisk tygdeformation. */
if (isEnabled("heroPillow")) {
  const stage = document.querySelector("[data-pillow-stage]");
  const pressButton = document.querySelector("[data-pillow-press]");
  const resetButton = document.querySelector("[data-pillow-reset]");

  if (stage) {
    let activePointer = null;
    let pressTimer = 0;

    const resetStage = () => {
      activePointer = null;
      stage.classList.remove("is-pressed", "is-dragging");
      stage.style.setProperty("--pillow-x", "0px");
      stage.style.setProperty("--pillow-y", "0px");
      stage.style.setProperty("--pillow-rotate-x", "0deg");
      stage.style.setProperty("--pillow-rotate-y", "0deg");
    };

    const pressStage = () => {
      window.clearTimeout(pressTimer);
      stage.classList.add("is-pressed");
      pressTimer = window.setTimeout(() => {
        stage.classList.remove("is-pressed");
      }, reduceMotion ? 120 : 320);
    };

    stage.addEventListener("pointerdown", event => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      activePointer = event.pointerId;
      stage.classList.add("is-pressed");
      if (event.pointerType === "mouse") stage.classList.add("is-dragging");
    });

    stage.addEventListener("pointermove", event => {
      if (reduceMotion) return;
      if (event.pointerType === "touch" && activePointer !== event.pointerId) return;
      if (event.pointerType === "mouse" && !finePointer) return;

      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (activePointer === event.pointerId) {
        stage.style.setProperty("--pillow-x", Math.max(-8, Math.min(8, x * 16)) + "px");
        stage.style.setProperty("--pillow-y", Math.max(-6, Math.min(6, y * 12)) + "px");
      } else if (finePointer) {
        stage.style.setProperty("--pillow-rotate-x", (-y * 2.4) + "deg");
        stage.style.setProperty("--pillow-rotate-y", (x * 2.4) + "deg");
      }
    });

    ["pointerup", "pointercancel", "lostpointercapture", "pointerleave"].forEach(type => {
      stage.addEventListener(type, () => {
        if (type === "pointerleave" && activePointer !== null) return;
        resetStage();
      });
    });
    window.addEventListener("pointerup", resetStage);

    pressButton?.addEventListener("click", pressStage);
    resetButton?.addEventListener("click", () => {
      window.clearTimeout(pressTimer);
      resetStage();
    });
  }
}


/* Knyt/lossa visas som en separat, förenklad bandillustration.
   Den påverkar inte produktfotot eftersom banden inte finns som frilagda lager. */
const bandToggle = document.querySelector("[data-band-toggle]");
const bandDemo = document.querySelector("[data-band-demo]");
const bandStatus = document.querySelector("[data-band-status]");

bandToggle?.addEventListener("click", () => {
  const knotted = bandToggle.getAttribute("aria-pressed") !== "true";
  bandToggle.setAttribute("aria-pressed", String(knotted));
  bandToggle.textContent = knotted ? "Lossa banden" : "Knyt banden";
  bandDemo?.classList.toggle("is-knotted", knotted);
  if (bandStatus) bandStatus.textContent = knotted
    ? "Illustrationen visar knytna band."
    : "Illustrationen visar lösa band.";
});

/* 2. Scroll-historien använder vanliga dokumentflödet.
   Ingen pinning, snap eller låst scroll. */
if (isEnabled("scrollStory")) {
  const steps = [...document.querySelectorAll("[data-story-step]")];
  const links = [...document.querySelectorAll("[data-story-link]")];

  if (steps.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const current = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!current) return;
      links.forEach(link => {
        if (link.getAttribute("href") === "#" + current.target.id) {
          link.setAttribute("aria-current", "step");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: "-15% 0px -35% 0px" });

    steps.forEach(step => observer.observe(step));
  }
}

/* 3. Kornillustration. En schematisk visualisering, inte en mätning eller simulering
   av en viss mängd vete. Alla partiklar skapas lokalt som SVG-cirklar. */
if (isEnabled("grainDemo")) {
  const demo = document.querySelector("[data-grain-demo]");

  if (demo) {
    const slider = demo.querySelector("[data-grain-tilt]");
    const plainGroup = demo.querySelector("[data-grains='plain']");
    const dividedGroup = demo.querySelector("[data-grains='divided']");
    const plainSvg = demo.querySelector("[data-grain-svg='plain']");
    const dividedSvg = demo.querySelector("[data-grain-svg='divided']");
    const reset = demo.querySelector("[data-grain-reset]");
    const status = demo.querySelector("[data-grain-status]");
    const namespace = "http://www.w3.org/2000/svg";
    const particles = { plain: [], divided: [] };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function makeGrains(group, type) {
      if (!group) return;

      group.replaceChildren();
      const count = 40;
      for (let i = 0; i < count; i += 1) {
        const channel = i % 5;
        const column = Math.floor(i / 5);
        const seedA = ((i * 37 + 17) % 97) / 97;
        const seedB = ((i * 53 + 29) % 89) / 89;
        const baseX = 28 + column * 34 + seedA * 10;
        const baseY = type === "divided"
          ? 27 + channel * 22 + seedB * 7
          : 27 + seedB * 82;

        const circle = document.createElementNS(namespace, "circle");
        circle.setAttribute("r", String(3 + (i % 3) * 0.35));
        circle.setAttribute("fill", i % 3 === 0 ? "#b88a4e" : "#d3b47d");
        circle.setAttribute("stroke", "#785c38");
        circle.setAttribute("stroke-width", "0.55");
        group.appendChild(circle);

        particles[type].push({ node: circle, x: baseX, y: baseY, channel, seedA, seedB });
      }
    }

    function setTilt(rawValue) {
      const value = Number(rawValue) || 0;
      const progress = Math.abs(value) / 22;
      const targetX = value >= 0 ? 38 : 282;
      const targetY = 76;
      const direction = value >= 0 ? -1 : 1;

      particles.plain.forEach(particle => {
        const x = particle.x * (1 - progress) + targetX * progress;
        const y = particle.y * (1 - progress) + targetY * progress;
        particle.node.setAttribute("cx", String(clamp(x + particle.seedA * 8 * progress, 18, 302)));
        particle.node.setAttribute("cy", String(clamp(y + (particle.seedB - 0.5) * 15 * progress, 24, 116)));
      });

      particles.divided.forEach(particle => {
        const x = particle.x + direction * progress * (5 + particle.seedA * 5);
        particle.node.setAttribute("cx", String(clamp(x, 18, 302)));
        particle.node.setAttribute("cy", String(particle.y));
      });

      if (plainSvg) plainSvg.style.setProperty("--grain-angle", (value * 0.34) + "deg");
      if (dividedSvg) dividedSvg.style.setProperty("--grain-angle", (value * 0.34) + "deg");
      if (status) {
        status.textContent = value === 0
          ? "Kuddarna ligger plant."
          : "Illustrationen visar hur kornen kan förflyttas när kuddarna lutas.";
      }
    }

    makeGrains(plainGroup, "plain");
    makeGrains(dividedGroup, "divided");

    slider?.addEventListener("input", () => setTilt(slider.value));
    reset?.addEventListener("click", () => {
      if (slider) slider.value = "0";
      setTilt(0);
    });
    slider?.addEventListener("keydown", event => {
      if (event.key === "Home") {
        slider.value = "0";
        setTilt(0);
      }
    });
    setTilt(slider?.value || 0);
  }
}

/* 4. Mobilens köpfält visas först efter att ordinarie köpknapp passerats.
   Det döljs när köpknappen eller sidfoten är synlig. */
if (isEnabled("stickyPurchaseBar") && "IntersectionObserver" in window) {
  const bar = document.querySelector("[data-mobile-buy-bar]");
  const buyButton = document.querySelector(".buy-button");
  const footer = document.querySelector(".site-footer");

  if (bar && buyButton && footer && window.matchMedia("(max-width: 760px)").matches) {
    let buyVisible = false;
    let footerVisible = false;

    const updateBar = () => {
      const passedButton = buyButton.getBoundingClientRect().bottom < 0;
      const shouldShow = passedButton && !buyVisible && !footerVisible;
      bar.hidden = !shouldShow;
      document.body.classList.toggle("has-mobile-buy-bar", shouldShow);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === buyButton) buyVisible = entry.isIntersecting;
        if (entry.target === footer) footerVisible = entry.isIntersecting;
      });
      updateBar();
    }, { threshold: 0.05 });

    observer.observe(buyButton);
    observer.observe(footer);
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar);
    updateBar();
  }
}

/* 5. Sidans läsprogress. */
if (isEnabled("scrollProgress")) {
  const progress = document.querySelector("[data-page-progress]");

  if (progress) {
    let scheduled = false;
    const updateProgress = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      const amount = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      progress.style.transform = "scaleX(" + amount + ")";
      scheduled = false;
    };
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    updateProgress();
  }
}

/* Med reducerad rörelse behålls alla kontroller och allt innehåll,
   men de rörliga delarna lämnas i ett statiskt läge. */
if (reduceMotion) {
  document.querySelectorAll("[data-pillow-stage]").forEach(stage => {
    stage.style.setProperty("--pillow-x", "0px");
    stage.style.setProperty("--pillow-y", "0px");
    stage.style.setProperty("--pillow-rotate-x", "0deg");
    stage.style.setProperty("--pillow-rotate-y", "0deg");
  });
}
