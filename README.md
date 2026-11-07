# 🎪 Eventora – Responsive Event Management Website

> **K Explore – Web Designing** · Task: *Design and Develop a Responsive Event Management Website*

Eventora is a modern, fully responsive event platform where users can discover upcoming events, search and filter them, view detailed information and register through a validated form. It is built with **pure HTML5, CSS3 and vanilla JavaScript** – no frameworks, no build step.

| | |
|---|---|
| 🌐 **Live Demo** | <https://sumitinloop-byte.github.io/eventora/> |
| 💻 **GitHub Repo** | <https://github.com/sumitinloop-byte/eventora> |

---

## ✅ Task Requirements Checklist

| Requirement from the task | Status | Where |
|---|---|---|
| Attractive hero section | ✅ | `index.html` (#home) |
| Featured / upcoming events section with cards | ✅ | `index.html`, `js/main.js`, `js/data.js` |
| Card shows name, date, venue, image, short description | ✅ | `eventCard()` in `js/data.js` |
| Browse + **search** events | ✅ | `js/main.js` (name, venue, city, category) |
| **Filter by category** | ✅ | category chips in `js/main.js` |
| Event details page + registration option | ✅ | `event.html`, `js/event.js` |
| Form: name, email, phone, selected event | ✅ | `event.html` |
| **JavaScript form validation** | ✅ | `Rules` in `js/common.js`, `js/event.js` |
| Confirmation message on success | ✅ | ticket modal in `js/event.js` |
| Responsive – mobile / tablet / desktop | ✅ | `css/style.css` §7 |
| Good UI/UX, consistent styling, transitions, interactivity | ✅ | whole project |
| HTML5 + CSS3 + JavaScript | ✅ | – |
| Git & GitHub | ✅ | see *Git workflow* |
| **Bonus:** dark / light mode | ✅ | `js/theme.js`, `js/common.js` |
| **Bonus:** event countdown timer | ✅ | `js/event.js` |
| **Bonus:** animations | ✅ | `css/style.css` §6 |
| **Bonus:** Local Storage registration management | ✅ | `Store` in `js/common.js`, `my-tickets.html` |
| README explaining project | ✅ | this file |
| Deployed (Vercel / Netlify / GitHub Pages) | ✅ | GitHub Pages |

## ✨ Features

**Discovery**
- Hero with live search, animated stat counters, floating gradient background
- 10 sample events with category, price, seats and organizer
- Search (name / venue / city / category), category chips, price filter, sorting
- "Load more" pagination, skeleton loading, empty-state with reset
- Seat-availability bar with *Only N left* and *Sold out* states

**Event page**
- Full details, schedule timeline, live countdown, organizer
- Add to calendar (`.ics` download), share / copy link
- Related events, breadcrumb, SEO meta + JSON-LD structured data

**Registration**
- Name, email, phone, event, tickets, terms checkbox
- Real-time validation with clear messages (see table below)
- Duplicate-registration and sold-out protection
- Success modal with ticket ID; live total price

**Extras**
- **My Tickets** page – view, cancel, add to calendar, clear all (Local Storage)
- Dark / light theme (remembers choice, respects system preference)
- Toast notifications, scroll progress bar, back-to-top, active-section nav highlight
- FAQ accordion, testimonials, contact form, newsletter form
- Custom 404 page and SVG favicon

**Quality**
- Accessible: skip link, semantic landmarks, ARIA labels / live regions, visible focus, keyboard friendly, `prefers-reduced-motion`
- Performance: lazy-loaded images, no dependencies, single CSS file, fallback artwork if images fail
- Security: all dynamic text is HTML-escaped

## 🛠️ Tech Stack
HTML5 · CSS3 (Grid, Flexbox, custom properties, `color-mix`) · Vanilla JavaScript (ES6+) · Local Storage · Git/GitHub

## 📁 Folder Structure
```
eventora/
├── index.html          Home: hero, events, how-it-works, about, FAQ, contact
├── event.html          Event details + registration form + related events
├── my-tickets.html     Saved registrations (Local Storage)
├── 404.html            Custom not-found page
├── assets/
│   └── favicon.svg
├── css/
│   └── style.css       Tokens, layout, components, pages, animations, responsive
├── js/
│   ├── theme.js        Applies saved theme before paint (no flash)
│   ├── common.js       Helpers, Store, validation Rules, toast, navbar, theme toggle
│   ├── data.js         Events data + eventCard(), calendar (.ics) helpers
│   ├── main.js         Home page logic (search, filter, sort, load more)
│   ├── event.js        Detail page logic (countdown, form, modal, related)
│   └── tickets.js      My Tickets page logic
├── .gitignore
└── README.md
```

## ▶️ Run Locally
```bash
git clone https://github.com/sumitinloop-byte/eventora.git
cd eventora
# open index.html in a browser, or use VS Code "Live Server"
```
No installation required.

## ✅ Validation Rules
| Field | Rule |
|---|---|
| Full name | required · min 3 chars · letters/spaces only |
| Email | required · valid format |
| Phone | required · 10 digits starting 6–9 (non-digits stripped as you type) |
| Event | must be selected |
| Tickets | 1–5, limited to seats left |
| Terms | must be accepted |
| Duplicate | same email cannot register twice for the same event |

## 🧠 How It Works
1. `data.js` holds the `EVENTS` array. Event dates are generated relative to today so the demo countdowns never expire – replace `at(days, hour)` with fixed ISO dates for real events.
2. `main.js` keeps a small `state` object (query, category, sort, price, visible) and re-renders the card grid whenever it changes.
3. Each card links to `event.html?id=N`. `event.js` reads `id` from the URL, renders the page and wires up the form.
4. Successful registrations are saved by `Store` in Local Storage and shown on `my-tickets.html`; seat availability is derived from them.

## 🌿 Git Workflow
```bash
git init
git add .
git commit -m "feat: initial Eventora website"
git branch -M main
git remote add origin https://github.com/sumitinloop-byte/eventora.git
git push -u origin main
```
Tip: make several meaningful commits (e.g. `feat: add search`, `feat: add form validation`, `style: dark mode`) – evaluators look at commit history.

## 🚀 Deployment
**Deployed on:** GitHub Pages → <https://sumitinloop-byte.github.io/eventora/>

- **Netlify:** drag-and-drop the folder at <https://app.netlify.com/drop> *(fastest)*
- **Vercel:** import the GitHub repo → Framework preset *Other* → Deploy
- **GitHub Pages:** Repo → *Settings → Pages* → Branch `main` / root → Save

## 🔮 Future Improvements
Backend + database for real bookings, user authentication, payment gateway, QR-code tickets, e-mail confirmations, admin dashboard.

## 👤 Author
**Sumit** – K Explore Web Designing