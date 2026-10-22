# HOPE: Survival — website

Static site served by GitHub Pages from the `main` branch root. No build step.

- `index.html` — landing: hero, trailer, features, screenshots, community.
- `presskit/index.html` — press kit: fact sheet, descriptions, features, downloads.
- `assets/js/site.js` — **all outbound links** (`LINKS`: Steam, Discord, trailer, press email).
  An empty value renders the button as "coming soon"; fill it in and the button goes live everywhere.
- `assets/img/screens/` — screenshots, `NN-name.jpg` (1920×1080) + `NN-name-thumb.jpg` (800×450).
- `presskit/hope-survival-screenshots.zip`, `presskit/hope-survival-logo.png` — press downloads.
- `.nojekyll` — tells Pages to serve files as-is.

## Placeholder content

Screenshots, the logo and the hero loop (`assets/video/hero.mp4`) are cut from the official trailer
(`HopeSurvivalTrailer.mp4`). Replace them with real screenshots from the shot list when they exist;
rebuild the zip with the same names.

## Local preview

```
python -m http.server 8765
```

then open http://localhost:8765/.

## Custom domain

Set in **Settings → Pages → Custom domain**; GitHub then commits a `CNAME` file here.
DNS at the registrar:

- apex: `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www`: `CNAME` → `<owner>.github.io`

After DNS resolves, enable **Enforce HTTPS**, and make the `og:image` URL in `index.html` absolute.
