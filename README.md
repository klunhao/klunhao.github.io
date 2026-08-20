# klunhao.github.io

Personal site / portfolio. Static HTML, CSS and one JS file — no build step, no
dependencies, no framework. Ported from the `Personal Site Interactive.dc.html`
mockup in the *Khailunhao's personal site mockups* Claude Design project.

## Run it locally

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

Any static server works. Opening `index.html` directly via `file://` mostly
works too, but the clipboard copy falls back to `mailto:` because the page
isn't in a secure context.

## Files

| File | What it is |
|---|---|
| `index.html` | All the content. This is the file you edit to change the site. |
| `styles.css` | Palette (light + dark), layout, the hand-drawn borders. |
| `app.js` | Behaviour only — theme switch, filters, card expand, copy-email. |
| `assets/` | Your photo and project screenshots. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |

The site is **content-first**: every word is in `index.html`, so it reads fine
with JavaScript off and search engines see the whole thing. `app.js` is pure
progressive enhancement.

## Editing the content

**Projects.** Each project is one `<article class="card">` in `index.html`.
There's a `<!-- PROJECT CARD -->` comment marking the first one — copy the whole
block to add another.

Two attributes matter:

- `data-kind="extension"` or `data-kind="site"` — drives the filter buttons.
  Adding a third kind means adding a matching `<button data-filter="...">`.
- `data-status="live" | "beta" | "archived"` on the `<span class="chip">` —
  drives the chip colour.

**Screenshots.** Drop a PNG at `assets/project-01.png` etc. Until a file exists,
the slot shows a hatched placeholder with the expected filename — nothing
breaks. Same for `assets/me.jpg` in the hero.

**Ideas, "now", socials, email.** All plain markup in `index.html`. The email
appears twice (support section + footer) — both read from `data-email`, so
change it in both places.

## Deploying

The repo name `klunhao.github.io` is what makes this a *user site*: GitHub Pages
serves the default branch at `https://klunhao.github.io` with no workflow file.

```bash
git push -u origin main
```

Then Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
First build takes a minute or two.

### Custom domain later

Add a `CNAME` file containing just the domain, point DNS at GitHub's IPs, and
enable *Enforce HTTPS*. Nothing in the code needs changing — every path is
relative.

## Still to do

- [ ] Get the **direct** Chrome Web Store URL for InstaSave from the developer
      dashboard. The card links to a store *search*, which is what the extension
      itself uses — a real listing URL (with the 32-char extension ID) is better.
- [ ] Push `instasave` and `ultimate-video-downloader` to GitHub, then add
      "source" links to both cards. Neither repo exists remotely right now.
- [ ] Enable memberships on Buy Me a Coffee, then uncomment the "become a
      member" button in `index.html` — the /membership URL 404s until you do.
- [ ] Add the bluesky handle (commented out in `index.html`).
- [ ] Add an OG image (`assets/og.png`) — `og:image` currently points at the
      portrait, which is fine but not a real share card.
