/* =========================================================
   common.js - shared helpers used on every page
   (DOM helpers, storage, validation, toast, navbar, theme)
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Local Storage (registrations) ---------- */
const Store = {
  key: "eventora:registrations",
  all() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; }
  },
  save(list) {
    try { localStorage.setItem(this.key, JSON.stringify(list)); } catch (e) {}
  },
  add(reg) { const l = this.all(); l.push(reg); this.save(l); },
  remove(id) { this.save(this.all().filter((r) => r.id !== id)); },
  clear() { this.save([]); },
  exists(email, eventId) {
    return this.all().some((r) => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase());
  },
  bookedFor(eventId) {
    return this.all().filter((r) => r.eventId === eventId).reduce((sum, r) => sum + r.tickets, 0);
  }
};

/* ---------- Validation ---------- */
const Rules = {
  name(v) {
    v = v.trim();
    if (!v) return "Full name is required.";
    if (v.length < 3) return "Name must be at least 3 characters.";
    if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(v)) return "Name can contain only letters and spaces.";
    return "";
  },
  email(v) {
    v = v.trim();
    if (!v) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email, e.g. you@example.com.";
    return "";
  },
  phone(v) {
    v = v.trim();
    if (!v) return "Phone number is required.";
    if (!/^[6-9]\d{9}$/.test(v)) return "Enter a valid 10-digit mobile number (starts with 6-9).";
    return "";
  },
  message(v) {
    v = v.trim();
    if (!v) return "Please write a message.";
    if (v.length < 10) return "Message must be at least 10 characters.";
    return "";
  }
};

/* Shows/clears an error under a field. Returns true when valid. */
function fieldError(input, msg) {
  const group = input.closest(".form-group");
  const err = group.querySelector(".error");
  if (err) err.textContent = msg || "";
  group.classList.toggle("invalid", !!msg);
  group.classList.toggle("valid", !msg);
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

/* ---------- Toast notifications ---------- */
function toast(message, type) {
  let box = $("#toasts");
  if (!box) {
    box = document.createElement("div");
    box.id = "toasts";
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.className = "toast " + (type || "info");
  t.textContent = message;
  box.appendChild(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3600);
}

/* ---------- Page chrome: theme, menu, progress bar, back-to-top ---------- */
(function initChrome() {
  const html = document.documentElement;
  const themeBtn = $("#themeToggle");
  const menuBtn = $("#menuToggle");
  const links = $("#navLinks");
  const header = $(".navbar");
  const progress = $("#progressBar");
  const toTop = $("#toTop");

  function paintTheme() {
    if (themeBtn) {
      const dark = html.getAttribute("data-theme") === "dark";
      themeBtn.textContent = dark ? "☀️" : "🌙";
      themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
  }
  paintTheme();
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      try { localStorage.setItem("eventora:theme", next); } catch (e) {}
      paintTheme();
    });
  }

  if (menuBtn && links) {
    menuBtn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "✕" : "☰";
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "☰";
      }
    });
  }

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (header) header.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* Ticket counter badge in navbar */
  const badge = $("#ticketCount");
  if (badge) {
    const n = Store.all().length;
    badge.textContent = n;
    badge.hidden = n === 0;
  }

  /* Newsletter form (footer, on pages that have it) */
  const news = $("#newsletterForm");
  if (news) {
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = news.elements.email;
      if (fieldError(input, Rules.email(input.value))) {
        toast("Subscribed! Watch your inbox for new events. 🎉", "success");
        news.reset();
        $$(".form-group", news).forEach((g) => g.classList.remove("valid"));
      }
    });
  }

  /* Scroll-reveal */
  const items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("show"));
  }
})();
