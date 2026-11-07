/* =========================================================
   event.js - event detail page: countdown, agenda, share,
   calendar, validated registration, ticket modal, related
   ========================================================= */
(function () {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get("id"), 10);
  const ev = EVENTS.find((e) => e.id === id);

  const detailEl = $("#eventDetail");
  const aside = $("#registerCard");
  const form = $("#regForm");
  const modal = $("#ticketModal");
  let timer;

  if (!ev) {
    $(".detail-layout").innerHTML =
      '<div class="empty" style="grid-column:1/-1"><div class="empty-ico">🔍</div><h2>Event not found</h2>' +
      '<p class="muted">The event you are looking for does not exist or was removed.</p>' +
      '<a class="btn btn-primary" href="index.html#events">Browse all events</a></div>';
    $("#related").hidden = true;
    $("#crumbName").textContent = "Not found";
    return;
  }

  /* ---------- SEO / meta ---------- */
  document.title = ev.name + " | Eventora";
  $("#crumbName").textContent = ev.name;
  const setMeta = (sel, val) => { const m = $(sel); if (m) m.setAttribute("content", val); };
  setMeta('meta[name="description"]', ev.description);
  setMeta('meta[property="og:title"]', ev.name + " | Eventora");
  setMeta('meta[property="og:description"]', ev.description);
  setMeta('meta[property="og:image"]', ev.image);
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Event", name: ev.name, description: ev.description,
    startDate: ev.date, image: ev.image,
    location: { "@type": "Place", name: ev.venue, address: ev.city },
    organizer: { "@type": "Organization", name: ev.organizer },
    offers: { "@type": "Offer", price: ev.price, priceCurrency: "INR" }
  });
  document.head.appendChild(ld);

  /* ---------- Render details ---------- */
  function renderDetail() {
    const s = seatsLabel(ev);
    const pct = Math.round(((ev.seats - seatsLeft(ev)) / ev.seats) * 100);
    detailEl.innerHTML =
      '<div class="detail-img"><img src="' + ev.image + '" alt="' + escapeHTML(ev.name) + '" onerror="this.onerror=null;this.src=FALLBACK_IMG;" />' +
      '<span class="tag">' + escapeHTML(ev.category) + "</span></div>" +
      "<h1>" + escapeHTML(ev.name) + "</h1>" +
      '<p class="muted lead">' + escapeHTML(ev.description) + "</p>" +
      '<ul class="info-grid">' +
        "<li><span>📅</span><div><small>Date</small><strong>" + formatDate(ev.date) + "</strong></div></li>" +
        "<li><span>🕒</span><div><small>Time</small><strong>" + formatTime(ev.date) + " (" + ev.durationHrs + " hrs)</strong></div></li>" +
        "<li><span>📍</span><div><small>Venue</small><strong>" + escapeHTML(ev.venue) + ", " + escapeHTML(ev.city) + "</strong></div></li>" +
        "<li><span>🎟️</span><div><small>Price</small><strong>" + formatPrice(ev.price) + "</strong></div></li>" +
        "<li><span>🏢</span><div><small>Organizer</small><strong>" + escapeHTML(ev.organizer) + "</strong></div></li>" +
        '<li><span>💺</span><div><small>Availability</small><strong class="seat-' + s.cls + '">' + s.text + "</strong></div></li>" +
      "</ul>" +
      '<div class="seats ' + s.cls + '"><div class="bar"><span style="width:' + pct + '%"></span></div><small>' + pct + "% booked</small></div>" +
      '<h2 class="h-sm">⏳ Starts in</h2><div class="countdown" id="countdown" role="timer" aria-live="off"></div>' +
      '<h2 class="h-sm">About this event</h2><p>' + escapeHTML(ev.details) + "</p>" +
      '<h2 class="h-sm">Schedule</h2><ol class="agenda">' +
        ev.agenda.map((a) => "<li><time>" + escapeHTML(a[0]) + "</time><span>" + escapeHTML(a[1]) + "</span></li>").join("") +
      "</ol>" +
      '<div class="action-row">' +
        '<button type="button" class="btn btn-outline small" id="calBtn">📆 Add to calendar</button>' +
        '<button type="button" class="btn btn-outline small" id="shareBtn">🔗 Share event</button>' +
      "</div>";

    $("#calBtn").addEventListener("click", () => { downloadICS(ev); toast("Calendar file downloaded 📆", "success"); });
    $("#shareBtn").addEventListener("click", async () => {
      const data = { title: ev.name, text: ev.description, url: location.href };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(location.href); toast("Link copied to clipboard 🔗", "success"); }
      } catch (e) { /* user cancelled */ }
    });
    startCountdown();
  }

  function startCountdown() {
    const box = $("#countdown");
    const unit = (n, l) => '<div class="time-box"><strong>' + String(n).padStart(2, "0") + "</strong><span>" + l + "</span></div>";
    function tick() {
      const t = getTimeLeft(ev.date);
      if (!t) { box.innerHTML = '<p class="muted">This event has already started.</p>'; clearInterval(timer); return; }
      box.innerHTML = unit(t.days, "Days") + unit(t.hours, "Hours") + unit(t.mins, "Mins") + unit(t.secs, "Secs");
    }
    tick(); timer = setInterval(tick, 1000);
  }

  /* ---------- Registration form ---------- */
  const eventSelect = form.elements.event;
  const ticketSelect = form.elements.tickets;
  const totalEl = $("#totalPrice");

  eventSelect.innerHTML = '<option value="">-- Select an event --</option>' +
    EVENTS.map((e) => '<option value="' + e.id + '"' + (e.id === ev.id ? " selected" : "") + ">" + escapeHTML(e.name) + "</option>").join("");

  function updateTotal() {
    const chosen = EVENTS.find((e) => e.id === +eventSelect.value);
    const qty = +ticketSelect.value || 1;
    totalEl.textContent = chosen ? (chosen.price === 0 ? "Free" : "₹" + (chosen.price * qty).toLocaleString("en-IN")) : "—";
    /* limit ticket choices to seats left */
    const max = chosen ? Math.min(5, seatsLeft(chosen)) : 5;
    const prev = ticketSelect.value;
    ticketSelect.innerHTML = Array.from({ length: Math.max(max, 1) }, (_, i) => '<option value="' + (i + 1) + '">' + (i + 1) + "</option>").join("");
    if (prev && +prev <= Math.max(max, 1)) ticketSelect.value = prev;
    $("#submitBtn").disabled = !!chosen && seatsLeft(chosen) === 0;
    $("#submitBtn").textContent = chosen && seatsLeft(chosen) === 0 ? "Sold out" : "Register Now";
  }
  eventSelect.addEventListener("change", () => { fieldError(eventSelect, eventSelect.value ? "" : "Please select an event."); updateTotal(); });
  ticketSelect.addEventListener("change", updateTotal);
  updateTotal();

  const checks = {
    name: Rules.name, email: Rules.email, phone: Rules.phone,
    event: (v) => (v ? "" : "Please select an event.")
  };
  Object.keys(checks).forEach((k) => {
    const el = form.elements[k];
    el.addEventListener("blur", () => fieldError(el, checks[k](el.value)));
    el.addEventListener("input", () => {
      if (k === "phone") el.value = el.value.replace(/\D/g, "");
      if (el.closest(".form-group").classList.contains("invalid")) fieldError(el, checks[k](el.value));
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = Object.keys(checks).map((k) => fieldError(form.elements[k], checks[k](form.elements[k].value))).every(Boolean);

    const terms = form.elements.terms;
    const termsGroup = terms.closest(".form-group");
    termsGroup.classList.toggle("invalid", !terms.checked);
    termsGroup.querySelector(".error").textContent = terms.checked ? "" : "Please accept the terms to continue.";
    if (!terms.checked) ok = false;

    if (!ok) { const first = $(".form-group.invalid input, .form-group.invalid select", form); if (first) first.focus(); return; }

    const chosen = EVENTS.find((x) => x.id === +eventSelect.value);
    const qty = +ticketSelect.value;
    if (qty > seatsLeft(chosen)) { toast("Not enough seats left for this event.", "error"); return; }
    if (Store.exists(form.elements.email.value, chosen.id)) {
      fieldError(form.elements.email, "This email is already registered for this event.");
      toast("You have already registered for this event.", "error");
      return;
    }

    const reg = {
      id: "EVT-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase(),
      name: form.elements.name.value.trim(), email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(), eventId: chosen.id, eventName: chosen.name,
      tickets: qty, total: chosen.price * qty, registeredAt: new Date().toISOString()
    };
    Store.add(reg);
    showTicket(reg, chosen);

    form.reset();
    $$(".form-group", form).forEach((g) => g.classList.remove("valid", "invalid"));
    eventSelect.value = ev.id;
    updateTotal();
    renderDetail();
    const badge = $("#ticketCount"); badge.textContent = Store.all().length; badge.hidden = false;
  });

  function showTicket(reg, chosen) {
    $("#ticketBody").innerHTML =
      '<div class="ticket-ok">🎉</div><h2 id="modalTitle">Registration successful!</h2>' +
      '<p class="muted">Thank you, <strong>' + escapeHTML(reg.name) + "</strong>. A confirmation has been sent to " + escapeHTML(reg.email) + ".</p>" +
      '<dl class="ticket-info">' +
        "<div><dt>Ticket ID</dt><dd>" + reg.id + "</dd></div>" +
        "<div><dt>Event</dt><dd>" + escapeHTML(chosen.name) + "</dd></div>" +
        "<div><dt>Date</dt><dd>" + formatDate(chosen.date) + ", " + formatTime(chosen.date) + "</dd></div>" +
        "<div><dt>Venue</dt><dd>" + escapeHTML(chosen.venue) + ", " + escapeHTML(chosen.city) + "</dd></div>" +
        "<div><dt>Tickets</dt><dd>" + reg.tickets + "</dd></div>" +
        "<div><dt>Amount</dt><dd>" + (reg.total === 0 ? "Free" : "₹" + reg.total.toLocaleString("en-IN")) + "</dd></div>" +
      "</dl>";
    $("#modalCal").onclick = () => downloadICS(chosen);
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  $("#modalClose").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  /* ---------- Related events ---------- */
  const related = EVENTS.filter((e) => e.id !== ev.id)
    .sort((a, b) => (b.category === ev.category) - (a.category === ev.category))
    .slice(0, 3);
  $("#relatedGrid").innerHTML = related.map(eventCard).join("");

  renderDetail();
})();
