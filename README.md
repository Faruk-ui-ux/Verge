# VERGE — static site

Struktura (SVE mora biti u rootu repozitorija, jedan pored drugog):

```
index.html
shop.html
collections.html
workshop.html
journal.html
img/           <- 79 slika, OBAVEZNO uz HTML fajlove
.nojekyll
```

## Hostovanje

1. Otpakuj zip. Uđi UNUTAR foldera i pushaj njegov sadržaj (ne sam folder):

```bash
git init
git add .
git commit -m "VERGE site"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Ako uploaduješ preko github.com (Add file → Upload files), prevuci **sve fajlove I folder `img`** odjednom — inače slika neće biti.

2. Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
3. Live za ~1 min na `https://<user>.github.io/<repo>/`.

Provjera: `https://<user>.github.io/<repo>/img/p.webp` mora otvoriti sliku. Ako daje 404, folder `img` nije uploadovan.
