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

/* 3. Kornillustration – 2 kanaler på bredden och cirka 8 fack längs kudden.
   Det här är en tydlig principskiss, inte en fysiksimulering eller ett mått på varje söm. */
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
    const angleOutput = demo.querySelector("[data-grain-angle]");
    const namespace = "http://www.w3.org/2000/svg";
    const particles = { plain: [], divided: [] };
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function makeGrains(group, type) {
      if (!group) return;
      const fragment = document.createDocumentFragment();
      const createdParticles = [];
      const left = 14;
      const right = 626;
      const top = 18;
      const middle = 90;
      const bottom = 162;
      const columns = 8;
      const count = columns * 2 * 3;

      for (let i = 0; i < count; i += 1) {
        const seedA = ((i * 37 + 17) % 97) / 97;
        const seedB = ((i * 53 + 29) % 89) / 89;
        let baseX;
        let baseY;
        let minX;
        let maxX;
        let minY;
        let maxY;

        if (type === "divided") {
          const column = Math.floor(i / 6);
          const row = Math.floor((i % 6) / 3);
          const cellWidth = (right - left) / columns;
          minX = left + column * cellWidth + 10;
          maxX = left + (column + 1) * cellWidth - 10;
          minY = row === 0 ? top + 10 : middle + 8;
          maxY = row === 0 ? middle - 8 : bottom - 10;
          baseX = minX + 8 + seedA * Math.max(6, maxX - minX - 16);
          baseY = minY + 6 + seedB * Math.max(6, maxY - minY - 12);
        } else {
          minX = left + 10;
          maxX = right - 10;
          minY = top + 10;
          maxY = bottom - 10;
          baseX = minX + seedA * (maxX - minX);
          baseY = minY + seedB * (maxY - minY);
        }

        const circle = document.createElementNS(namespace, "circle");
        circle.setAttribute("cx", String(baseX));
        circle.setAttribute("cy", String(baseY));
        circle.setAttribute("r", String(4 + (i % 3) * 0.45));
        circle.setAttribute("fill", i % 3 === 0 ? "#b88a4e" : "#d3b47d");
        circle.setAttribute("stroke", "#785c38");
        circle.setAttribute("stroke-width", "0.8");
        fragment.appendChild(circle);

        createdParticles.push({
          node: circle,
          x: baseX,
          y: baseY,
          minX,
          maxX,
          minY,
          maxY,
          seedA,
          seedB
        });
      }

      group.replaceChildren(fragment);
      particles[type] = createdParticles;
    }

    function setTilt(rawValue) {
      const value = clamp(Number(rawValue) || 0, -100, 100);
      const progress = Math.abs(value) / 100;
      const angle = value * 0.22;
      const toRight = value >= 0;
      const targetX = toRight ? 586 : 54;

      particles.plain.forEach(particle => {
        const x = particle.x + (targetX - particle.x) * progress * 0.88;
        const y = 90 + (particle.y - 90) * (1 - progress * 0.72);
        const smallScatter = (particle.seedB - 0.5) * 18 * progress;
        particle.node.setAttribute("cx", String(clamp(x + (particle.seedA - 0.5) * 18 * progress, 32, 608)));
        particle.node.setAttribute("cy", String(clamp(y + smallScatter, 34, 146)));
      });

      particles.divided.forEach(particle => {
        // Varje fack behåller sina korn. De kan röra sig inom facket, men inte vidare till nästa.
        const edge = toRight ? particle.maxX : particle.minX;
        const x = particle.x + (edge - particle.x) * progress * 0.78;
        const y = particle.y + (particle.maxY - particle.y) * progress * 0.12;
        particle.node.setAttribute("cx", String(clamp(x, particle.minX, particle.maxX)));
        particle.node.setAttribute("cy", String(clamp(y, particle.minY, particle.maxY)));
      });

      if (plainSvg) plainSvg.style.setProperty("--grain-angle", angle + "deg");
      if (dividedSvg) dividedSvg.style.setProperty("--grain-angle", angle + "deg");
      if (angleOutput) angleOutput.textContent = Math.abs(Math.round(angle)) + "°";
      if (status) {
        status.textContent = value === 0
          ? "Kuddarna ligger plant. Dra reglaget åt vänster eller höger för att jämföra."
          : "Kuddarna lutar " + Math.abs(Math.round(angle)) + "° åt " + (toRight ? "höger" : "vänster") + ". Jämför hur vetet samlas i den öppna kudden medan det stannar i de separata facken.";
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
