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
if (lightboxOpen) lightboxOpen.disabled = false;
galleryThumbs.forEach(button => {
  button.disabled = false;
  button.addEventListener("click", () => {
    if (!mainImage) return;
    mainImage.src = button.dataset.image;
    mainImage.alt = button.dataset.alt || "VeteRo produktbild";
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
