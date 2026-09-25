# Emporia website — design

**Date:** 2026-09-25 · **Status:** approved to build (placeholders pending client inputs)

## Goal
A minimal, trustworthy site for Emporia, a local digital marketing agency in Ghaziabad. The site's job is to
turn local business owners into leads by **showing real, verifiable results** (case studies with raw evidence).

## Principles
- **Evidence first.** Every claimed number shows its baseline, date range and source (GA4, Search Console,
  GBP Insights, POS/Shopify). Screenshots are labelled "unedited" or list exactly what was redacted.
- **Real clients only.** Real names and logos with consent. No stock people, no "500+ clients" counters.
- **No fabricated data.** Until real data arrives, sample content is visibly labelled as a sample.
- **Local.** Ghaziabad-first copy, LocalBusiness schema, consistent NAP, area pages.

## Stack
- Astro 7 (static output) + Tailwind CSS 4, Manrope font (self-hosted via Fontsource)
- Case studies and area pages as Markdown content collections (`src/content/`)
- Charts rendered as inline SVG at build time from case-study data (no chart JS)
- Lead form → Web3Forms (email delivery); success screen offers a prefilled WhatsApp chat
- Hosting: GitHub Pages via GitHub Actions on push to `main`
- Maintained by Claude in code; no CMS

## Pages (phase 1)
| Route | Content |
|---|---|
| `/` | Promise, featured case study, proof strip, how we work, industries, lead form |
| `/case-studies/` | All case studies, filterable by industry |
| `/case-studies/[slug]/` | Result → client → challenge → strategy → timeline → evidence → testimonial → CTA |
| `/services/` | Services list (placeholder until confirmed) |
| `/about/` | Who we are, how we work, team (placeholder) |
| `/contact/` | Lead form, WhatsApp, call, email, map |
| `/areas/[slug]/` | Area pages; starts with Ghaziabad |
| `/privacy/`, `404` | Required |

## Contact
Every page: floating WhatsApp button, tap-to-call, email. Lead form fields: name, phone/WhatsApp, business,
industry, area, need, preferred contact (WhatsApp message / WhatsApp call / phone call / email).

## Configuration
All business details (phone, WhatsApp, email, address, services, Web3Forms key, domain/base path) live in
`src/config/site.ts`. Values still needed are marked `TODO`.

## Open inputs from client
Services list · phone/WhatsApp/email · office address · domain · case-study PDF and screenshots ·
testimonial · team photos · corrected logo (current tagline reads "Turing visibilty").

## Out of scope (phase 2)
Blog, pricing page, audit tool, additional area pages beyond the first few.
