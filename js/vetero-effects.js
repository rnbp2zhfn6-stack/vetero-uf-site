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

/* 1. Diskret, tillgänglig rörelse på den riktiga produktbilden.
   Bilden vrids svagt med pekaren eller vid svep. Den byter inte vinkel eller innehåll. */
if (isEnabled("heroPillow")) {
  const stage = document.querySelector("[data-pillow-stage]");
  const resetButton = document.querySelector("[data-pillow-reset]");

  if (stage) {
    let activePointer = null;
    let pointerStart = null;
    let keyboardRotation = { x: 0, y: 0 };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const setRotation = (x, y, translateX = 0, translateY = 0) => {
      stage.style.setProperty("--pillow-x", translateX + "px");
      stage.style.setProperty("--pillow-y", translateY + "px");
      stage.style.setProperty("--pillow-rotate-x", x + "deg");
      stage.style.setProperty("--pillow-rotate-y", y + "deg");
    };

    const resetStage = () => {
      activePointer = null;
      pointerStart = null;
      keyboardRotation = { x: 0, y: 0 };
      stage.classList.remove("is-pressed", "is-dragging");
      setRotation(0, 0);
    };

    stage.addEventListener("pointerdown", event => {
      if (reduceMotion || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      activePointer = event.pointerId;
      pointerStart = { x: event.clientX, y: event.clientY };
      stage.classList.add("is-pressed", "is-dragging");
      try { stage.setPointerCapture(event.pointerId); } catch {}
    });

    stage.addEventListener("pointermove", event => {
      if (reduceMotion) return;
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      if (activePointer === event.pointerId && pointerStart) {
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        const rotateY = clamp((dx / rect.width) * 9, -4.5, 4.5);
        const rotateX = clamp((-dy / rect.height) * 7, -3.5, 3.5);
        setRotation(rotateX, rotateY, clamp(dx * 0.035, -3, 3), clamp(dy * 0.025, -2, 2));
        return;
      }

      if (finePointer && activePointer === null) {
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setRotation(-y * 2.2, x * 2.4);
      }
    });

    const finishPointer = event => {
      if (activePointer === null || (event && event.pointerId !== activePointer)) return;
      activePointer = null;
      pointerStart = null;
      stage.classList.remove("is-pressed", "is-dragging");
      setRotation(0, 0);
    };

    stage.addEventListener("pointerup", finishPointer);
    stage.addEventListener("pointercancel", finishPointer);
    stage.addEventListener("lostpointercapture", finishPointer);
    stage.addEventListener("pointerleave", event => {
      if (activePointer !== null) return;
      if (finePointer) setRotation(0, 0);
    });

    stage.addEventListener("keydown", event => {
      if (reduceMotion) return;
      const step = event.shiftKey ? 2 : 1;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") {
        keyboardRotation = { x: 0, y: 0 };
      } else {
        if (event.key === "ArrowLeft") keyboardRotation.y = clamp(keyboardRotation.y - step, -5, 5);
        if (event.key === "ArrowRight") keyboardRotation.y = clamp(keyboardRotation.y + step, -5, 5);
        if (event.key === "ArrowUp") keyboardRotation.x = clamp(keyboardRotation.x - step, -4, 4);
        if (event.key === "ArrowDown") keyboardRotation.x = clamp(keyboardRotation.x + step, -4, 4);
      }
      setRotation(keyboardRotation.x, keyboardRotation.y);
    });

    resetButton?.addEventListener("click", resetStage);
    stage.addEventListener("blur", () => {
      if (activePointer === null) resetStage();
    });
  }
}

/* Knytbanden visas i en ren illustration av den långa kudden. */
const bandToggle = document.querySelector("[data-band-toggle]");
const bandDemo = document.querySelector("[data-band-demo]");
const bandStatus = document.querySelector("[data-band-status]");

bandToggle?.addEventListener("click", () => {
  const knotted = bandToggle.getAttribute("aria-pressed") !== "true";
  bandToggle.setAttribute("aria-pressed", String(knotted));
  bandToggle.textContent = knotted ? "Visa utan knut" : "Visa knytningen";
  bandDemo?.classList.toggle("is-knotted", knotted);
  if (bandStatus) {
    bandStatus.textContent = knotted
      ? "Så kan banden mötas och knytas ihop för att hålla kudden på plats."
      : "Banden från båda kortsidorna kan knytas ihop för att hålla kudden på plats.";
  }
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

      const fragment = document.createDocumentFragment();
      const createdParticles = [];
      const columnBounds = [[24, 60], [60, 109], [109, 158], [158, 207], [207, 256], [256, 296]];
      const rowBounds = [[20, 37], [37, 59], [59, 81], [81, 103], [103, 125]];
      const count = type === "divided" ? 30 : 40;

      for (let i = 0; i < count; i += 1) {
        const column = type === "divided" ? i % 6 : Math.floor(i / 5);
        const row = type === "divided" ? Math.floor(i / 6) : i % 5;
        const seedA = ((i * 37 + 17) % 97) / 97;
        const seedB = ((i * 53 + 29) % 89) / 89;
        const baseX = type === "divided"
          ? 34 + column * 49 + seedA * 10
          : 28 + column * 34 + seedA * 10;
        const baseY = type === "divided"
          ? 24 + row * 22 + seedB * 7
          : 27 + seedB * 82;

        const circle = document.createElementNS(namespace, "circle");
        circle.setAttribute("cx", String(baseX));
        circle.setAttribute("cy", String(baseY));
        circle.setAttribute("r", String(3 + (i % 3) * 0.35));
        circle.setAttribute("fill", i % 3 === 0 ? "#b88a4e" : "#d3b47d");
        circle.setAttribute("stroke", "#785c38");
        circle.setAttribute("stroke-width", "0.55");
        fragment.appendChild(circle);

        const bounds = type === "divided" ? columnBounds[column] : [18, 302];
        createdParticles.push({
          node: circle,
          x: baseX,
          y: baseY,
          minX: bounds[0] + 5,
          maxX: bounds[1] - 5,
          seedA,
          seedB
        });
      }

      // Ersätt fallback-kornen först när alla nya korn är färdigskapade.
      group.replaceChildren(fragment);
      particles[type].push(...createdParticles);
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
        // Kornen rör sig mot den lägre sidan inom sitt eget sydda fack.
        const edge = direction < 0 ? particle.minX : particle.maxX;
        const x = particle.x + (edge - particle.x) * progress * 0.58;
        particle.node.setAttribute("cx", String(clamp(x, particle.minX, particle.maxX)));
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
