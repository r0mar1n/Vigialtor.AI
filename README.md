# 🦉 Vigilator.AI

**A browser extension that catches phishing sites before you fall for them — using machine learning, not just blacklists.**

Vigilator.AI watches the pages you visit in real time, runs the URL and page content through two trained ML models, and warns you the moment something looks like phishing. No waiting for a human to report the site first.

---

## The problem

Phishing sites are built to be convincing — they copy real login pages, banking portals, and checkout flows almost pixel-for-pixel. Most existing protection (browser warnings, blacklist extensions) only catches a site **after** someone else has already reported it. That leaves a window where brand-new phishing pages slip through completely undetected.

Vigilator.AI closes that window by analyzing sites *on the fly*, instead of only checking them against a list of known-bad URLs.

---

## How it works

The extension runs a layered check on every page you visit, escalating only as needed — cheap checks first, heavier analysis only if something looks off.

![Flowchart showing the working of the browser extension](images/flowchart.png)

**Step by step:**

1. **Trusted-domain filter** — the URL is checked against the [Tranco top 1 million](https://tranco-list.eu/) list first. If it's a well-established, popular domain, Vigilator.AI skips straight to resuming browsing — no point spending compute re-verifying google.com.
2. **URL analysis** — if the domain isn't on that trusted list, a **LightGBM** model scores the URL itself: structure, length, suspicious patterns, lexical features.
3. **Content analysis** — if the URL alone isn't conclusive, the extension inspects the actual page: HTML, forms, input fields, scripts — looking for things like fake login forms or unusual "transaction" fields.
4. **Anomaly detected → alert.** No anomaly → you keep browsing, uninterrupted.
5. **Your call** — if flagged, you can dismiss it and proceed, or report/block the site. Blocking it updates the incident log and adds it to your personal blocklist.
6. When you close the browser, the session's logs are saved and the extension goes quiet until next time.

### System architecture

![Architecture of the browser extension](images/architecture.png)

At a high level: the **browser extension** is the only thing running locally, and it talks to a small set of **local Flask APIs** that do the actual model inference (URL model + content model) and the blocklist/Tranco lookups. Verdicts come back as one of three outcomes — flag it, mark it suspicious and ask the user, or clear it and resume browsing — and every outcome gets logged for the dashboard.

---

## What's under the hood

| Layer | Tech |
|---|---|
| Browser extension | JavaScript (ES6+) |
| Frontend dashboard | Vue.js 3.2.x, HTML5, CSS3 |
| ML / backend APIs | Python 3.10+, Flask, Scikit-learn, **LightGBM**, **XGBoost**, BeautifulSoup |
| Database | Firebase Realtime Database |

**Two models, two jobs:**
- **LightGBM** — trained on URL-derived features (lexical patterns, domain structure, reputation signals) to catch phishing from the URL alone.
- **XGBoost** — trained on page-content features (HTML structure, external link ratios, JavaScript event hijacking, CSS-based cloaking) to catch phishing that *looks* fine at the URL level but behaves badly once loaded.

Running both means a site has to fool two independently-trained models to slip through, which is what keeps false positives down without sacrificing detection rate.

| Model | Accuracy | Precision | Recall | F1-score |
|---|---|---|---|---|
| LightGBM (URL analysis) | 97% | 0.97 | 0.97 | 0.97 |
| XGBoost (content analysis) | 98% | 0.98 | 0.98 | 0.98 |

---

## The extension in action

Loaded as an unpacked extension during development, sitting quietly in the toolbar until it's needed:

![Loading of extension to the browser](images/extension-setup.png)

Behind the scenes, four local Flask services come up — `trancocheck`, `app` (URL analysis), `content` (content analysis), and the `central_api` that coordinates between them — all spun up from a single `manage.py`.

And here's the part that matters: a real phishing page caught mid-browse, with Chrome surfacing the warning the instant the page is flagged.

![Warning notification to user about potential phishing attack](images/phishing-warning.png)

---

## The dashboard

Blocked sites, scan history, and account settings live in a companion web dashboard — built with a bit of an owl theme, because "Vigilator" deserved one.

**Login & authentication**

![Login and Authentication page](images/login-page.png)

**Dashboard — your scanning stats at a glance**

![Dashboard page showing scanning statistics](images/dashboard.png)

**Blocklist — every flagged site, with the reason it was caught**

![Blocklist page showing blocked URLs and reasons](images/blocklist.png)

---

## Project status

This started as a final-year engineering project (B.E. Computer Engineering, University of Mumbai, 2024–25) and is roughly **85% complete**. The two ML models and the detection pipeline work end-to-end; the remaining work is mostly integration polish and performance tuning rather than core functionality.

**What's next:**
- Tighter integration between the two models for faster real-time scoring
- Mobile browser support (lighter-weight model deployment)
- Detection for malicious redirect chains, not just the landing page
- Adaptive/online learning so the models keep up with new phishing tactics without manual retraining

---

## Getting started

```bash
# Frontend (dashboard)
npm install
npm run serve       # dev server with hot-reload
npm run build        # production build
npm run lint          # lint and autofix

# Backend (ML APIs)
cd flask-backend
python manage.py     # starts all Flask services (trancocheck, app, content, central_api)
```

Then load the `extension/` folder into Chrome via `chrome://extensions` → **Load unpacked** (with Developer mode on).

---

## Team

Built by Shipra Choudhary, Christina Michael, Rosemary Benny, and Julia Thomas — Computer Engineering, Fr. Conceicao Rodrigues Institute of Technology, Vashi. Supervised by Mrs. Bhakti Aher.
