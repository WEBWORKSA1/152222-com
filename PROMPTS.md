# 152222.com — Phase-wise build prompts

Concept: **152222 Number Lab** — a free "number intelligence" hub (decode any number + numerology, VIP, vehicle, house, name, PIN/ZIP and lucky-number tools) monetised by AdSense, a personal-number-report lead funnel, VIP-number seller referrals, sponsorships, donations and contests. Static HTML on GitHub Pages (free plan, built-in Jekyll). Every prompt below is self-contained; run them in order.

Global constraints (paste into every phase):
- Domain 152222.com; brand "152222 Number Lab". Repo `WEBWORKSA1/152222-com`, branch `main`, GitHub Pages "Deploy from a branch" root.
- AdSense tag in every `<head>`: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>` + `<meta name="google-adsense-account" content="ca-pub-6620975821265271">`; `ads.txt`: `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
- Top of every page: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" linked to https://web.works/contact.
- One inbox for all forms, never exposed in source: assemble it at runtime from an encoded, reversed base64 key in `config.js` and post via FormSubmit AJAX.
- Trademark/copyright disclosure: 152222 is a number used as a domain; no exclusive rights claimed; no affiliation with anything sharing the digits.
- Numerology/angel numbers always labelled as tradition/entertainment; maths computed client-side; no fear-selling; no guaranteed-luck claims (AdSense + YMYL safety).
- Mobile-first, WCAG AA, light/dark, no horizontal scroll at 360px, Core Web Vitals friendly (no frameworks, lazy video).

---

## Phase 1 — Research & positioning
"Research the number 152222 across maths, numerology (incl. the 2222 angel number), dates/times, postal codes (Indian PIN, US ZIP), commerce registries, AI tokenization and culture. Pull demand data for numerology calculators, mobile-number numerology, VIP mobile numbers and angel numbers. Survey 25+ leading sites (VIP marketplaces, Indian astrology portals, Western numerology sites, number-fact and calculator sites, PIN/ZIP sites). Output RESEARCH.md: the number's profile, demand evidence, a features-to-copy list, best lead forms, AdSense placement patterns, and the recommended concept and revenue stack."

## Phase 2 — Architecture & design system
"Create a Jekyll-on-GitHub-Pages skeleton: `_config.yml` (jekyll-sitemap, defaults layout), `_layouts/default.html` (meta/OG/schema WebSite+Organization, Article/WebApplication by front matter, AdSense tag, owner contact strip, sticky header with mobile menu, footer with newsletter form + legal block + trademark notice, cookie notice, sticky mobile CTA), `assets/css/site.css` with tokens (ink/paper/accent/teal, Bricolage Grotesque + IBM Plex Mono + Instrument Sans), components: hero with ledger-grid, decoder box, chips, cards, tool cards, kv stat tiles, score ring, callouts, tables, forms, option tiles, step bar, FAQ details, lazy video, tiers, footer. Links via `{{ site.baseurl }}` so the site works on github.io and on 152222.com."

## Phase 3 — Number engine
"Write `assets/js/numbers.js` (pure functions, no network): clean/digits/sum, reduce with steps (master 11/22/33 optional), factorization, divisors (count/sum/list), prime/square/cube/triangular/fibonacci/palindrome, bases, Roman, number to words (international + Indian lakh/crore), pattern detection (runs, repdigits, sequences, mirrors, repeated blocks, endings, 786, 8s), VIP score 0–100 with tiers and reasons, Pythagorean + Chaldean name numbers (expression/soul/personality/compound), life path/Mulank/Bhagyank/personal year, Lo Shu grid + missing numbers, digit meanings + Vedic rulers, friendly-number compatibility, angel reading, Indian PIN zone/circle decode, US ZIP area decode, 6/4-digit time/date readings, seeded daily number. Unit-test with node (152222 → 2×7×83×131, 16 divisors, root 5)."

## Phase 4 — Tools
"Build `number.html` (full report for ?n=, maths/numerology/angel/VIP/codes/dates, share buttons, prev/next, embed code, helpful vote) and `tools/`: mobile-number (root + ruler + Mulank/Bhagyank match ring), vip-number-score, life-path (Lo Shu grid), name-numerology (compare 3 names, Pythagorean/Chaldean, best fit), vehicle-number (3 methods), house-number (letters), pin-code-decoder (PIN + ZIP), lucky-number (crypto RNG, unique/sort, Mulank filter), tools index. Each tool: H1, short lede, form, result panel with working shown, 300–600 words of original explainer, FAQ, related links, a CTA into the report funnel."

## Phase 5 — Content for AdSense approval
"Write original, accurate pages: home (hero decoder, tool grid, lead block, 'why numbers matter' across commerce/business/AI/economy/culture, video, contest + support teasers, FAQ + FAQPage schema), the-number-152222 profile, angel-numbers library (decoder + 20-entry table + frequency illusion), and guides: what-is-numerology, mobile-number-numerology, vip-mobile-numbers-guide, numbers-in-pricing, numeric-domain-names, how-ai-reads-numbers, benfords-law (with in-browser tester), lucky-numbers-around-the-world, how-pin-codes-work, plus guides index. Add about (editorial standards), contact, privacy (AdSense cookie wording, DPDP/GDPR/CCPA rights), terms, disclaimer (trademark + affiliate disclosure), sitemap.html, 404, robots.txt, ads.txt, manifest, favicon."

## Phase 6 — Lead generation
"Build `report.html`: 3-step form (1 choose: VIP number, check my number, brand name, vehicle, date, house, numeric domain, sell my number/domain, full reading → 2 details: number/name, pattern, DOB, budget, operator/state, timeline, notes → 3 contact: name, email, mobile/WhatsApp, city, WhatsApp opt-in, consent) with progress bar, prefill from query (?for=vip&number=…), redirect to thank-you.html. Add a 20-second quick lead form on the home page, inline CTAs on every tool result, the VIP request CTA on the VIP score, and the 'sell your number/domain' path for supply-side leads."

## Phase 7 — Donations, contests, hiring, advertising, video
"support.html: use-of-funds bars (tools, contributors/hiring, prizes, promotion/marketing, operations), 3 tiers, payment buttons driven by config.js (PayPal/Stripe/Buy Me a Coffee/Razorpay UPI), pledge-form fallback, other ways to help, supporters wall. contests.html: monthly Number Hunt puzzle with live countdown, prizes, entry form, quarterly Number Story contest, sponsor-a-prize, official rules (no purchase necessary, void where prohibited). careers.html: 6 remote roles + application form. advertise.html: audience, 6 packages (sponsored tool, VIP seller listing, newsletter, contest sponsorship, sponsored guide, partnership/API, domain acquisition), labelled-ads policy, media-kit form. videos.html: verified YouTube IDs, lazy privacy-enhanced embeds, suggest-a-video CTA."

## Phase 8 — QA, deploy, launch
"Check every internal link, front matter, no exposed email, no console errors, no horizontal scroll at 390px, forms validate. Push to `WEBWORKSA1/152222-com` (main). Enable Pages (Deploy from branch, main, root). Verify https://webworksa1.github.io/152222-com/. Then point DNS for 152222.com to GitHub Pages, set custom domain + HTTPS, submit the sitemap in Search Console, activate FormSubmit, apply for AdSense, exclude report/thank-you from Auto ads."

## Phase 9 — Growth & expansion
"Programmatic per-number pages for 1–9999 with unique computed facts and prev/next (numbersaplenty pattern); Hindi version (hreflang); VIP number seller portal with listings and lead routing; Number of the Week newsletter; Shorts/Reels from number facts embedded on pages; embeddable widgets for backlinks; monthly contest rotation; A/B test CTA copy on the report funnel."
