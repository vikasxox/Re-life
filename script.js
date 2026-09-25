const body = document.body;
const siteHeader = document.getElementById("siteHeader");
const progress = document.getElementById("progress");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

const updateHeader = () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 8);
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${pct}%`;
};
window.addEventListener("scroll", updateHeader, {passive:true});
updateHeader();

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.classList.toggle("show", open);
  body.classList.toggle("locked", open);
});
mobileMenu?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("show");
    body.classList.remove("locked");
  });
});

document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX-r.left}px`);
    card.style.setProperty("--my", `${e.clientY-r.top}px`);
  });
});

const filters = [...document.querySelectorAll(".filter")];
const cards = [...document.querySelectorAll(".service-card")];
filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => {
      const active = f === filter;
      f.classList.toggle("active", active);
      f.setAttribute("aria-selected", String(active));
    });
    const wanted = filter.dataset.filter;
    cards.forEach(card => {
      const show = wanted === "all" || card.dataset.category === wanted;
      card.classList.toggle("is-hidden", !show);
    });
  });
});

const revealItems = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion) {
  revealItems.forEach(el => el.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12, rootMargin: "0px 0px -40px 0px"});
  revealItems.forEach(el => observer.observe(el));
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
let lastFocused = null;

function openLightbox(trigger) {
  const src = trigger.dataset.lightbox;
  if (!src) return;
  lastFocused = trigger;
  lightboxImage.src = src;
  lightboxImage.alt = trigger.querySelector("img")?.alt || "Image viewer";
  lightboxCaption.textContent = trigger.dataset.caption || "";
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  body.classList.add("locked");
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  body.classList.remove("locked");
  lastFocused?.focus();
}
document.querySelectorAll("[data-lightbox]").forEach(el => {
  el.addEventListener("click", () => openLightbox(el));
});
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => {
  if (e.target.dataset.close === "true") closeLightbox();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox();
});

const hero = document.querySelector(".hero");
const heroBg = document.querySelector(".hero-bg");
if (hero && heroBg && !reducedMotion) {
  hero.addEventListener("mousemove", e => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 7;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 5;
    heroBg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
  });
  hero.addEventListener("mouseleave", () => {
    heroBg.style.transform = "scale(1.035)";
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior: reducedMotion ? "auto" : "smooth", block:"start"});
  });
});
