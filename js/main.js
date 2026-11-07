/* =========================================================
   main.js - home page: search, filters, sort, load more,
   skeleton loading, counters, active nav, contact form
   ========================================================= */
(function () {
  const PAGE_SIZE = 6;
  const grid = $("#eventsGrid");
  const filtersEl = $("#categoryFilters");
  const searchInput = $("#searchInput");
  const sortSelect = $("#sortSelect");
  const priceSelect = $("#priceSelect");
  const resultCount = $("#resultCount");
  const noResults = $("#noResults");
  const loadMore = $("#loadMore");

  const state = { q: "", cat: "All", sort: "soonest", price: "all", visible: PAGE_SIZE };
  const categories = ["All"].concat([...new Set(EVENTS.map((e) => e.category))]);

  function renderFilters() {
    filtersEl.innerHTML = categories.map((c) =>
      '<button type="button" class="chip' + (c === state.cat ? " active" : "") + '" data-cat="' + escapeHTML(c) + '" aria-pressed="' + (c === state.cat) + '">' + escapeHTML(c) + "</button>"
    ).join("");
  }

  function getFiltered() {
    const q = state.q.trim().toLowerCase();
    let list = EVENTS.filter((e) => {
      const okCat = state.cat === "All" || e.category === state.cat;
      const okQ = !q || [e.name, e.venue, e.city, e.category].some((v) => v.toLowerCase().includes(q));
      const okPrice = state.price === "all" || (state.price === "free" ? e.price === 0 : e.price > 0);
      return okCat && okQ && okPrice;
    });
    const sorters = {
      soonest: (a, b) => new Date(a.date) - new Date(b.date),
      "price-low": (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
      "filling": (a, b) => seatsLeft(a) - seatsLeft(b)
    };
    return list.sort(sorters[state.sort]);
  }

  function render() {
    const list = getFiltered();
    const shown = list.slice(0, state.visible);
    grid.setAttribute("aria-busy", "false");
    grid.innerHTML = shown.map(eventCard).join("");
    resultCount.textContent = list.length ? "Showing " + shown.length + " of " + list.length + " events" : "";
    noResults.hidden = list.length !== 0;
    loadMore.hidden = shown.length >= list.length;
  }

  function reset() {
    state.q = ""; state.cat = "All"; state.sort = "soonest"; state.price = "all"; state.visible = PAGE_SIZE;
    searchInput.value = ""; sortSelect.value = "soonest"; priceSelect.value = "all";
    renderFilters(); render();
  }

  function skeletons() {
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = Array.from({ length: 6 }, () =>
      '<div class="card skeleton"><div class="card-img"></div><div class="card-body"><i></i><i></i><i class="short"></i></div></div>').join("");
  }

  let timer;
  searchInput.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = searchInput.value; state.visible = PAGE_SIZE; render(); }, 180);
  });
  filtersEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.cat = b.dataset.cat; state.visible = PAGE_SIZE; renderFilters(); render();
  });
  sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; render(); });
  priceSelect.addEventListener("change", () => { state.price = priceSelect.value; state.visible = PAGE_SIZE; render(); });
  loadMore.addEventListener("click", () => { state.visible += PAGE_SIZE; render(); });
  $("#resetFilters").addEventListener("click", reset);

  /* Hero search sends the query to the events section */
  $("#heroSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    state.q = $("#heroQuery").value; searchInput.value = state.q; state.visible = PAGE_SIZE;
    render();
    $("#events").scrollIntoView({ behavior: "smooth" });
  });

  /* Animated stat counters */
  function runCounters() {
    $$("[data-count]").forEach((el) => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || "";
      const start = performance.now(), dur = 1400;
      (function step(now) {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN") + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { runCounters(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe($(".hero-stats"));
  } else runCounters();

  /* Highlight nav link of the section in view */
  if ("IntersectionObserver" in window) {
    const links = $$("#navLinks a[href^='#']");
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => io2.observe(s));
  }

  /* Contact form */
  const contact = $("#contactForm");
  if (contact) {
    const checks = { name: Rules.name, email: Rules.email, message: Rules.message };
    Object.keys(checks).forEach((k) => {
      const el = contact.elements[k];
      el.addEventListener("blur", () => fieldError(el, checks[k](el.value)));
      el.addEventListener("input", () => { if (el.closest(".form-group").classList.contains("invalid")) fieldError(el, checks[k](el.value)); });
    });
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = Object.keys(checks).map((k) => fieldError(contact.elements[k], checks[k](contact.elements[k].value))).every(Boolean);
      if (!ok) return;
      toast("Thanks " + contact.elements.name.value.trim().split(" ")[0] + "! We'll get back to you soon. ✅", "success");
      contact.reset();
      $$(".form-group", contact).forEach((g) => g.classList.remove("valid"));
    });
  }

  renderFilters();
  skeletons();
  setTimeout(render, 450);
})();
