// All outbound links live here. An empty value renders the control as "coming soon".
const LINKS = {
  steam: "",
  discord: "https://discord.gg/fuRWEf5U7d",
  trailer: "https://www.youtube.com/watch?v=NnqW2iyr3cw",
  pressEmail: "",
  studio: "https://vargdevelopment.github.io/ThirstGamesStudioWebsite/",
};

// The studio site has a Russian version; Russian pages link to it.
if (document.documentElement.lang === "ru") LINKS.studio += "ru/";

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
    frame.focus();
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

// Header gets a background and the Steam/Discord buttons once the hero scrolls away.
const header = document.querySelector(".site-header.is-sticky");
const hero = document.querySelector(".hero");
if (header && hero) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-stuck", !entry.isIntersecting);
  }, { rootMargin: "-72px 0px 0px 0px" }).observe(hero);
}

// Motion: the hero loop and the feature loops.
// They stay on their poster frames with reduced motion, on data-saver or slow connections, or after
// the visitor pauses them; the pause is remembered for this browser.
const MOTION_KEY = "hope-motion-paused";
const readPaused = () => { try { return localStorage.getItem(MOTION_KEY) === "1"; } catch { return false; } };
const writePaused = (v) => { try { localStorage.setItem(MOTION_KEY, v ? "1" : "0"); } catch { /* storage blocked */ } };

const connection = navigator.connection || {};
const lightMode = connection.saveData === true || /(^|-)2g$|^3g$/.test(connection.effectiveType || "");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let motionPaused = reducedMotion || lightMode || readPaused();

const heroVideo = document.querySelector(".hero video");
const loops = [...document.querySelectorAll("video[data-loop]")];
const visibleLoops = new Set();
const toggle = document.querySelector("[data-motion-toggle]");

let pageLoaded = false;

const playSafe = (v) => v.play().catch(() => {});

const applyMotion = () => {
  if (heroVideo) (motionPaused || !pageLoaded) ? heroVideo.pause() : playSafe(heroVideo);
  loops.forEach((v) => (!motionPaused && visibleLoops.has(v) ? playSafe(v) : v.pause()));
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(motionPaused));
    toggle.setAttribute("aria-label", motionPaused ? toggle.dataset.labelPlay : toggle.dataset.labelPause);
    toggle.classList.toggle("is-paused", motionPaused);
  }
};

const loopObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) visibleLoops.add(target);
    else visibleLoops.delete(target);
  });
  applyMotion();
}, { threshold: 0.25 });
loops.forEach((v) => loopObserver.observe(v));

if (toggle) {
  toggle.addEventListener("click", () => {
    motionPaused = !motionPaused;
    writePaused(motionPaused);
    applyMotion();
  });
}

// The hero video is ~13 MB: start fetching it only after the rest of the page has loaded.
// Browsers hold back playback in background tabs; pick it up again when the tab comes back.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") applyMotion();
});

const onLoaded = () => { pageLoaded = true; applyMotion(); };
if (document.readyState === "complete") onLoaded();
else window.addEventListener("load", onLoaded, { once: true });

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
