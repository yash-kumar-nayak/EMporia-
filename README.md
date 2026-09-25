# Emporia website

Website for Emporia, a digital marketing agency in Ghaziabad. Built with [Astro](https://astro.build) and
Tailwind CSS, hosted on GitHub Pages.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321/EMporia-/
npm run build    # production build into dist/
```

## Where things live

| What | Where |
|---|---|
| Business details (phone, WhatsApp, email, address, services, form key) | `src/config/site.ts` |
| Case studies | `src/content/case-studies/*.md` |
| Area pages (local SEO) | `src/content/areas/*.md` |
| Case study screenshots, client logos | `src/assets/case-studies/<client>/` |
| Downloadable PDF reports | `public/reports/` |
| Pages | `src/pages/` |

## Adding a case study

1. Copy `src/content/case-studies/sample-case-study.md` to `src/content/case-studies/<client-slug>.md`.
2. Fill in the frontmatter with real numbers only. Every metric needs a `before`, an `after` and a `source`.
3. Put screenshots in `src/assets/case-studies/<client-slug>/` and reference them, e.g.
   `image: ../../assets/case-studies/<client-slug>/gbp-calls.png`. List anything blurred in `redactions`.
4. Set `sample: false` and, if it should lead the homepage, `featured: true` (and remove `featured` from the others).
5. Delete the sample case study once a real one exists.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
One-time setup: in the repository, **Settings → Pages → Source: GitHub Actions**.

### Connecting a custom domain

1. In `astro.config.mjs` set `SITE` to the domain (e.g. `https://emporia.in`) and `BASE` to `'/'`.
2. Add `public/CNAME` containing the bare domain (e.g. `emporia.in`).
3. At the domain registrar add DNS records for GitHub Pages (A records to 185.199.108.153, .109, .110, .111
   and a `CNAME` for `www` to `yash-kumar-nayak.github.io`), then set the domain in **Settings → Pages**.

Note: `robots.txt` only takes effect at a domain root, so it starts working once a custom domain is connected.

## Still needed before launch

Search the code for `TODO` to find every placeholder.

- Phone, WhatsApp number, email, office address, PIN code, hours
- Final list of services
- Web3Forms access key (free at web3forms.com). Until it is set, the form sends enquiries via WhatsApp.
- Real case study data, screenshots and client testimonial
- Team names and photos
- Google Business Profile link
- Corrected logo — the current file's tagline reads "Turing visibilty into growth"
