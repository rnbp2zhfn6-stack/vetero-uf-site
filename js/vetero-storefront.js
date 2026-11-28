const $ = (selector, root = document) => root.querySelector(selector);

const header = $("#site-header");
const nav = $("#main-nav");
const menuToggle = $("#menu-toggle");

function setMenuOpen(open, restoreFocus = false) {
  if (!nav || !menuToggle) return;
  nav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
  if (restoreFocus && !open) menuToggle.focus();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener("pointerdown", event => {
    if (nav.classList.contains("is-open") && header && !header.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 650 && nav.classList.contains("is-open")) setMenuOpen(false);
  });
}

function updateHeaderState() {
  header?.classList.toggle(
    "is-scrolled",
    window.VETERO_EFFECTS?.headerShrink !== false && window.scrollY > 12
  );
}
let scrollTick = false;
window.addEventListener("scroll", () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    updateHeaderState();
    scrollTick = false;
  });
}, { passive: true });
updateHeaderState();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = (Math.min(index % 3, 2) * 55) + "ms";
    observer.observe(node);
  });
} else {
  revealNodes.forEach(node => node.classList.add("is-visible"));
}

const lightbox = $("[data-lightbox]");
const mainImage = $("[data-product-main]");
const lightboxImage = $("[data-lightbox-image]");
const lightboxOpen = $("[data-lightbox-open]");
const lightboxClose = $("[data-lightbox-close]");
let previousFocus = null;

function closeLightbox() {
  if (!lightbox?.classList.contains("is-open")) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  previousFocus?.focus();
}

const galleryThumbs = document.querySelectorAll("[data-gallery-thumb]");
const galleryLabel = document.querySelector("[data-gallery-label]");
const galleryStage = document.querySelector("[data-pillow-stage]");
if (lightboxOpen) lightboxOpen.disabled = false;
galleryThumbs.forEach(button => {
  button.disabled = false;
  button.addEventListener("click", () => {
    if (!mainImage) return;
    mainImage.src = button.dataset.image;
    mainImage.alt = button.dataset.alt || "VeteRo produktbild";
    if (galleryLabel) {
      const isRender = button.dataset.kind === "render";
      galleryLabel.hidden = !isRender;
      galleryLabel.textContent = isRender ? "3D-visualisering" : "";
    }
    if (galleryStage) {
      const isRender = button.dataset.kind === "render";
      galleryStage.dataset.stageKind = button.dataset.kind || "photo";
      galleryStage.classList.toggle("is-stage-disabled", !isRender);
      galleryStage.querySelectorAll("[data-stage-step],[data-stage-reset]").forEach(control => {
        control.disabled = !isRender;
      });
      const stageHint = galleryStage.querySelector("[data-stage-hint]");
      if (stageHint) {
        stageHint.textContent = isRender
          ? "Dra bilden med musen eller fingret för att ändra perspektivet. Du kan också använda knapparna."
          : "Originalfoto visas utan perspektiveffekt. Välj en 3D-visualisering för att ändra vyn.";
      }
    }
    galleryThumbs.forEach(thumb => {
      thumb.setAttribute("aria-pressed", String(thumb === button));
    });
  });
});

lightboxOpen?.addEventListener("click", () => {
  if (!mainImage?.src || !lightboxImage || !lightbox) return;
  previousFocus = document.activeElement;
  lightboxImage.src = mainImage.src;
  lightboxImage.alt = mainImage.alt || "VeteRo produktbild";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox?.classList.contains("is-open")) return;
  if (event.key === "Escape") {
    closeLightbox();
    return;
  }
  if (event.key === "Tab") {
    const focusable = [...lightbox.querySelectorAll("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])")];
    if (!focusable.length) {
      event.preventDefault();
      lightbox.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});


/* Subtle pointer response on the real product photograph.
   This is a shallow perspective treatment, not a fabricated 3D product model. */
const photoTilt = document.querySelector("[data-photo-tilt]");
if (photoTilt && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let frame = 0;
  const resetPhotoTilt = () => {
    photoTilt.style.setProperty("--photo-tilt-x", "0deg");
    photoTilt.style.setProperty("--photo-tilt-y", "0deg");
    photoTilt.style.setProperty("--photo-shine-x", "50%");
    photoTilt.style.setProperty("--photo-shine-y", "50%");
    photoTilt.style.setProperty("--photo-shine-opacity", "0");
    photoTilt.classList.remove("is-pointer-active");
  };

  photoTilt.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    const rect = photoTilt.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      photoTilt.style.setProperty("--photo-tilt-y", ((x - 0.5) * 3.2).toFixed(2) + "deg");
      photoTilt.style.setProperty("--photo-tilt-x", ((0.5 - y) * 2.4).toFixed(2) + "deg");
      photoTilt.style.setProperty("--photo-shine-x", (x * 100).toFixed(1) + "%");
      photoTilt.style.setProperty("--photo-shine-y", (y * 100).toFixed(1) + "%");
      photoTilt.style.setProperty("--photo-shine-opacity", "1");
      photoTilt.classList.add("is-pointer-active");
    });
  });

  photoTilt.addEventListener("pointerleave", resetPhotoTilt);
  photoTilt.addEventListener("blur", resetPhotoTilt, true);
}


/* Draggable perspective stage for VeteRo studio renders.
   This adjusts a still image, not a 360-degree 3D model. */
document.querySelectorAll("[data-pillow-stage]").forEach(stage => {
  const surface = stage.querySelector("[data-stage-surface]");
  const reset = stage.querySelector("[data-stage-reset]");
  const controls = stage.querySelectorAll("[data-stage-step]");
  const hint = stage.querySelector("[data-stage-hint]");
  if (!surface) return;

  let rotationX = 0;
  let rotationY = 0;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startRotationX = 0;
  let startRotationY = 0;
  let moved = false;
  let suppressClick = false;
  let frame = 0;

  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  const canRotate = () => stage.dataset.stageKind !== "photo";
  const setRotation = () => {
    surface.style.setProperty("--stage-rotate-x",rotationX.toFixed(2)+"deg");
    surface.style.setProperty("--stage-rotate-y",rotationY.toFixed(2)+"deg");
    stage.style.setProperty("--stage-shadow-x",(rotationY*.65).toFixed(1)+"px");
    stage.style.setProperty("--stage-shadow-y",(Math.abs(rotationX)*.5).toFixed(1)+"px");
    stage.classList.toggle("is-stage-rotated",Math.abs(rotationX)+Math.abs(rotationY)>.5);
  };
  const rotateBy = (x,y) => {
    if (!canRotate()) return;
    rotationX = clamp(rotationX+x,-10,10);
    rotationY = clamp(rotationY+y,-16,16);
    setRotation();
  };
  const resetView = () => {
    rotationX = 0;
    rotationY = 0;
    surface.style.setProperty("--stage-light-x","50%");
    surface.style.setProperty("--stage-light-y","40%");
    setRotation();
  };
  const syncState = () => {
    const disabled = !canRotate();
    controls.forEach(button => { button.disabled = disabled; });
    if (reset) reset.disabled = disabled;
    if (hint && disabled) {
      hint.textContent = "Originalfoto visas utan perspektiveffekt. Välj en 3D-visualisering för att ändra vyn.";
    }
  };

  controls.forEach(button => {
    button.addEventListener("click",() => {
      if (button.dataset.stageStep === "left") rotateBy(0,-6);
      if (button.dataset.stageStep === "right") rotateBy(0,6);
    });
  });
  reset?.addEventListener("click",resetView);

  surface.addEventListener("keydown",event => {
    if (!canRotate()) return;
    const steps = {
      ArrowLeft:[0,-4],
      ArrowRight:[0,4],
      ArrowUp:[3,0],
      ArrowDown:[-3,0]
    };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    rotateBy(step[0],step[1]);
  });

  surface.addEventListener("pointerdown",event => {
    if (!canRotate() || event.button > 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startRotationX = rotationX;
    startRotationY = rotationY;
    moved = false;
    surface.classList.add("is-stage-dragging");
    try { surface.setPointerCapture(pointerId); } catch (error) {}
  });

  surface.addEventListener("pointermove",event => {
    if (!canRotate()) return;
    const rect = surface.getBoundingClientRect();
    if (rect.width && rect.height) {
      surface.style.setProperty("--stage-light-x",((event.clientX-rect.left)/rect.width*100).toFixed(1)+"%");
      surface.style.setProperty("--stage-light-y",((event.clientY-rect.top)/rect.height*100).toFixed(1)+"%");
    }
    if (pointerId !== event.pointerId) return;
    const dx = event.clientX-startX;
    const dy = event.clientY-startY;
    if (Math.abs(dx)+Math.abs(dy)>4) moved = true;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      rotationY = clamp(startRotationY+dx*.13,-16,16);
      rotationX = clamp(startRotationX-dy*.10,-10,10);
      setRotation();
    });
  });

  const finishDrag = event => {
    if (pointerId !== event.pointerId) return;
    if (moved) suppressClick = true;
    pointerId = null;
    surface.classList.remove("is-stage-dragging");
    if (moved) window.setTimeout(() => { suppressClick = false; },0);
  };
  surface.addEventListener("pointerup",finishDrag);
  surface.addEventListener("pointercancel",finishDrag);
  surface.addEventListener("lostpointercapture",finishDrag);
  surface.addEventListener("click",event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  },true);

  syncState();
  setRotation();
});
