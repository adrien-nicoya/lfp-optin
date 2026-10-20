# LFP — Page optin Mission Patrimoine Souverain

- `variant-a.html` / `variant-b.html` : les 2 versions de la page (identiques pour l'instant, seule la headline changera).
- `middleware.js` : répartit les visiteurs 50/50 sur `/`, variante mémorisée 30 jours (cookie `lfp_ab`). Test forcé : `/?v=a` ou `/?v=b`.
- `api/submit.js` : envoie prenom, email, tel, UTM, page_url, variant (A/B), submitted_at vers le webhook Make.
- Après inscription : redirection vers https://www.independance-capital.com/deja-inscrit-4-soirees-en-live (UTM + variant conservés).

Variable d'environnement optionnelle : `MAKE_WEBHOOK_URL` (sinon le webhook par défaut est utilisé).

Pour changer la headline B : modifier le `<h1>` dans `variant-b.html`.
