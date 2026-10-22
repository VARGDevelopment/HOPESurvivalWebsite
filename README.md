# HOPE: Survival — website

Static site served by GitHub Pages from the `main` branch root. No build step.

- `index.html` — landing: hero loop, trailer, features with video loops, screenshots, FAQ, community.
- `presskit/index.html` — press kit: fact sheet, descriptions, features, downloads.
- `404.html` — self-contained "not found" page (no relative assets on purpose).
- `assets/js/site.js` — **all outbound links** (`LINKS`: Steam, Discord, trailer, press email).
  An empty value renders the button as "coming soon" (and hides it in the sticky header);
  fill it in and the button goes live everywhere.
- `assets/video/` — background loop in four variants, picked by the browser in this order:
  `hero-mobile-av1.mp4` / `hero-mobile.mp4` (1280×720, phones) and `hero-av1.mp4` / `hero.mp4`
  (1920×1080); AV1 first, H.264 as the fallback. `feature-*.mp4` are the feature-block loops.
  Each loop has a `.webp` poster (its first frame).
  The hero is the trailer at exactly half speed (60 fps source → 30 fps, every frame kept): a
  non-integer slow-down drops frames unevenly and the loop judders.
- `assets/img/screens/` — screenshots: `NN-name.jpg` (1920×1080, press downloads),
  `NN-name.webp` (same size, lightbox) and `NN-name-thumb.webp` (800×450).
- `assets/fonts/` — Oswald and Inter, latin subset, self-hosted (SIL Open Font License).
- `presskit/hope-survival-screenshots.zip`, `presskit/hope-survival-logo.png` — press downloads.
- `.nojekyll` — tells Pages to serve files as-is.

## Placeholder content

Screenshots, the logo and all video loops are cut from the official trailer
(`HopeSurvivalTrailer.mp4`). Replace them with real captures when they exist; keep the names and
rebuild the zip.

The loops are seamless: each one ends by cross-fading into its own first frame. With ffmpeg, for a
clip of length `L` and fade `F`: `xfade` the clip with itself at `offset=L-F`, then `trim=start=F:end=L`.

## Local preview

```
python -m http.server 8765
```

then open http://localhost:8765/.

## Custom domain

Set in **Settings → Pages → Custom domain**; GitHub then commits a `CNAME` file here.
DNS at the registrar:

- apex: `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www`: `CNAME` → `vargdevelopment.github.io`

After DNS resolves, enable **Enforce HTTPS**, then replace
`https://vargdevelopment.github.io/HOPESurvivalWebsite/` with the domain in: `index.html`
(canonical, og/twitter tags, JSON-LD), `presskit/index.html` (canonical, og tags), `sitemap.xml`,
`robots.txt`. `robots.txt` only takes effect at a domain root, i.e. after the domain is attached.
