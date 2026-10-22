// All outbound links live here. An empty value renders the control as "coming soon".
const LINKS = {
  steam: "",
  discord: "https://discord.gg/fuRWEf5U7d",
  trailer: "https://www.youtube.com/watch?v=NnqW2iyr3cw",
  pressEmail: "",
};

const TRAILER_ID = "NnqW2iyr3cw";

// Buttons and links marked data-link="<key>" take their href from LINKS.
document.querySelectorAll("[data-link]").forEach((el) => {
  const url = LINKS[el.dataset.link];
  if (url) {
    el.href = el.dataset.link === "pressEmail" ? `mailto:${url}` : url;
    if (el.dataset.link === "pressEmail") el.textContent = url;
    return;
  }
  el.removeAttribute("href");
  el.classList.add("is-pending");
  el.setAttribute("aria-disabled", "true");
  if (el.dataset.pending) el.textContent = el.dataset.pending;
});

// Trailer loads the YouTube player only on click.
document.querySelectorAll("[data-trailer]").forEach((box) => {
  box.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${TRAILER_ID}?autoplay=1&rel=0`;
    frame.title = "HOPE: Survival — Official Trailer";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    box.replaceChildren(frame);
    box.classList.add("is-playing");
  }, { once: true });
});

// Screenshot lightbox.
const lightbox = document.querySelector("#lightbox");
if (lightbox) {
  const img = lightbox.querySelector("img");
  const shots = [...document.querySelectorAll("[data-shot]")];
  let index = 0;

  const show = (i) => {
    index = (i + shots.length) % shots.length;
    img.src = shots[index].href;
    img.alt = shots[index].querySelector("img").alt;
  };

  shots.forEach((a, i) => a.addEventListener("click", (e) => {
    e.preventDefault();
    show(i);
    lightbox.showModal();
  }));

  lightbox.querySelector("[data-prev]").addEventListener("click", () => show(index - 1));
  lightbox.querySelector("[data-next]").addEventListener("click", () => show(index + 1));
  lightbox.querySelector("[data-close]").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Respect reduced motion: keep the hero on its poster frame.
const heroVideo = document.querySelector(".hero video");
if (heroVideo && reducedMotion) {
  heroVideo.removeAttribute("autoplay");
  heroVideo.pause();
}

// Header gets a background and the Steam/Discord buttons once the hero scrolls away.
const header = document.querySelector(".site-header.is-sticky");
const hero = document.querySelector(".hero");
if (header && hero) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-stuck", !entry.isIntersecting);
  }, { rootMargin: "-72px 0px 0px 0px" }).observe(hero);
}

// Feature loops play only while on screen, and never with reduced motion.
const loops = document.querySelectorAll("video[data-loop]");
if (!reducedMotion) {
  const loopObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.25 });
  loops.forEach((v) => loopObserver.observe(v));
}

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
