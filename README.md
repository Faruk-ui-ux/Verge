# VERGE — static site

```
index.html  shop.html  collections.html  workshop.html  journal.html
i/          <- 79 slika u punoj kvaliteti (mora biti uz HTML fajlove)
```

## Upload preko github.com (bez git-a)

1. Otpakuj zip do kraja.
2. Repo → **Add file → Upload files** → prevuci **5 HTML fajlova** → Commit changes.
3. Ponovo **Add file → Upload files** → prevuci folder **i** → Commit changes.

Ako javi error 400, slike prevuci u dva dijela (pola pa pola) — GitHub odbija prevelik batch odjednom.

## Ili preko git-a

```bash
git init
git add .
git commit -m "VERGE site"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

## Pages

Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
Provjera: `https://<user>.github.io/<repo>/i/p.webp` mora otvoriti sliku.
