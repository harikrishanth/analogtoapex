# AnalogToApex — Marketing Site

A single-page, static marketing/portfolio site showcasing your gig categories: Website
Development, AI-Native Web Development, Software Development, Chatbot Development, Cloud
Computing & DevOps, and QA & Testing. Built with plain HTML/CSS/JS — no build step, no
dependencies, works anywhere.

## Structure

```
Agency/
├── index.html          # all page content (single-page site with anchor sections)
├── css/style.css        # dark/bold theme, responsive layout, animations
├── js/main.js            # mobile nav, scroll reveal, back-to-top, contact form
├── assets/favicon.svg    # placeholder logo/favicon mark
└── README.md
```

## Run it locally

No build tools needed. Either:

- Double-click `index.html` to open it in a browser, or
- Serve it (recommended, avoids some browser file:// quirks):

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## ⚠️ Placeholders to replace before launch

This was built with sensible defaults so you can see the full site immediately. Before you
publish it, update:

| What | Where | Notes |
|---|---|---|
| Brand name "AnalogToApex" | `index.html` (search `AnalogToApex`), `<title>` tag | Rename or keep it |
| Logo mark | `assets/favicon.svg`, `.brand-mark` in `index.html` | Currently a text `</>` mark |
| Phone number | `index.html` → Contact section (`tel:+10000000000`) | Currently a fake placeholder number |
| Social links | `index.html` → `.social-row` (LinkedIn/X/Instagram/GitHub `href="#"`) | Add real profile URLs |
| Upwork / Fiverr buttons | `index.html` → `.platform-buttons` (`href="#"`) | Add your real gig/profile URLs |
| Portfolio projects | `index.html` → `#portfolio` section | 6 placeholder cards, one per category — swap in real case studies, screenshots, and results as you complete projects |
| Starting prices | `index.html` → each `.panel-card` price list | These are illustrative market-rate placeholders, not final pricing — adjust per category once you've decided |
| Contact email | Already set to `jeyprakashprabakaran7@gmail.com` in two places: the mailto link and `js/main.js` | Update both if it changes |
| Domain / SEO meta | `<meta name="description">` in `index.html` | Add `<meta property="og:*">` tags once you have a domain + social preview image |

## Contact form behavior

The form has **no backend** — on submit, it opens the visitor's email client with a pre-filled
message (via a `mailto:` link). This works with zero setup but requires the visitor to have an
email client configured, and you won't get submissions logged anywhere.

To upgrade later without much work, swap the `fetch`/submit logic in `js/main.js` for a free
form service such as [Formspree](https://formspree.io), [Getform](https://getform.io), or (if
you switch hosting to Netlify) native **Netlify Forms** — just add `data-netlify="true"` to the
`<form>` tag.

## Deploying to GitHub Pages

1. Create a new GitHub repo (e.g. `nexforge-site`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / `/ (root)`**.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
5. (Optional) Add a custom domain under **Settings → Pages → Custom domain**.

## Notes on the "Why AI-Agent Delivery" section

The ranked list in `#why-ai` reuses the prioritization you provided (landing pages/WordPress →
chatbots → APIs/automations → AI websites/integrations → full-stack MVPs → cloud/DevOps → QA) as
a customer-facing differentiator, framed around delivery speed and where human review matters
most. Edit freely as your actual track record fills in.
