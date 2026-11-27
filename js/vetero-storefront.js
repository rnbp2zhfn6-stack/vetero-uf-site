const $ = (selector, root = document) => root.querySelector(selector);

const header = $("#site-header");
const nav = $("#main-nav");
const menuToggle = $("#menu-toggle");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Öppna meny");
    });
  });
}

let scrollTick = false;
window.addEventListener("scroll", () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    scrollTick = false;
  });
}, { passive: true });

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
    node.style.transitionDelay = (Math.min(index % 3, 2) * 70) + "ms";
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

function closeLightbox() {
  lightbox?.classList.remove("is-open");
  document.body.style.overflow = "";
}

lightboxOpen?.addEventListener("click", () => {
  if (!mainImage?.src || !lightboxImage || !lightbox) return;
  lightboxImage.src = mainImage.src;
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});
