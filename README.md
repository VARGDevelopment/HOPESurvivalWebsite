# HOPE: Survival — website

Static site served by GitHub Pages from the `main` branch root.

- `index.html` — the page.
- `.nojekyll` — tells Pages to serve files as-is, without a Jekyll build.

## Custom domain

Set in **Settings → Pages → Custom domain**; GitHub then commits a `CNAME` file here.
DNS at the registrar:

- apex: `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www`: `CNAME` → `<owner>.github.io`

After DNS resolves, enable **Enforce HTTPS**.
