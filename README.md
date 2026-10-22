# 152222.com — 152222 Number Lab

Free number-intelligence site: decode any number (maths, numerology root, angel-number reading, VIP pattern score, PIN/ZIP structure, dates/times), plus mobile, vehicle, house, name, life-path, PIN and lucky-number tools. Monetised by Google AdSense, a personal-number-report lead funnel (incl. VIP-number requests for seller referrals), sponsorships, donations and contests. Static site built by GitHub Pages' own Jekyll on the free plan — no workflow or server needed.

## Structure
- `_layouts/default.html` — shared shell: AdSense tag, owner contact strip (links to web.works/contact), header, nav, footer, trademark notice, cookie notice, scripts.
- `*.html`, `tools/*.html`, `guides/*.html` — pages with front matter (`title`, `description`, optional `nav`, `type: "article"|"tool"`, `sticky: "no"`, `noindex: true`).
- `assets/js/numbers.js` — the number engine (pure functions: factoring, divisors, bases, words in lakh/crore, numerology, Lo Shu, VIP score, angel reading, PIN/ZIP decode, date/time readings).
- `assets/js/main.js` — UI: tool renderers, multi-step lead form, form relay, lazy YouTube, share, Benford tester, countdown, support payment links.
- `assets/js/config.js` — payment links for the Support page and the encoded form-relay key.
- `assets/css/site.css` — design system (light + dark).
- `PROMPTS.md` — phase-wise build prompts. `RESEARCH.md` — research on 152222 and the 25+ site competitor survey.

## Publishing (GitHub Pages, free)
Settings → Pages → Build and deployment → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**. Site goes live at `https://webworksa1.github.io/152222-com/`.

## Custom domain
1. DNS for 152222.com: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME `www` → `webworksa1.github.io`.
2. Settings → Pages → Custom domain: `152222.com`, tick **Enforce HTTPS**. (Do this only after DNS points at GitHub; GitHub writes the `CNAME` file for you.)

## Forms
All forms post through FormSubmit to the owner inbox; the address is assembled at runtime from the encoded key in `config.js` and never appears in page source. The first submission triggers a one-time FormSubmit activation email — click **Activate** or later submissions are not delivered.

## Donations
Paste PayPal / Stripe Payment Link / Buy Me a Coffee / Razorpay URLs into `assets/js/config.js` → `payments`. Until then the Support page runs in pledge mode (pledge form → you email a payment link).

## AdSense
Tag is in every page head; `ads.txt` is at the root. Apply once the custom domain is live (`https://152222.com/ads.txt` must resolve). After approval: enable Auto ads (anchor + in-page), turn on the EEA/UK consent message (Privacy & messaging), and add `/report.html` and `/thank-you.html` to Auto-ads page exclusions so the lead funnel stays clean.

## Contest
Puzzle on `contests.html`. Answer for the current puzzle: **152312** (smallest number > 152222 with 16 divisors and digit sum 14). Change the puzzle and prizes monthly.

## Trademark
"152222" is a number used as a domain; no exclusive rights claimed. See `disclaimer.html`.
