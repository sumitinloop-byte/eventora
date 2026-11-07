/* =========================================================
   tickets.js - "My Tickets" page: list, cancel, calendar
   ========================================================= */
(function () {
  const list = $("#ticketList");
  const empty = $("#emptyTickets");
  const toolbar = $("#ticketsToolbar");
  const summary = $("#ticketSummary");

  function render() {
    const regs = Store.all().sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    empty.hidden = regs.length !== 0;
    toolbar.hidden = regs.length === 0;
    const badge = $("#ticketCount"); badge.textContent = regs.length; badge.hidden = regs.length === 0;

    const totalTickets = regs.reduce((s, r) => s + r.tickets, 0);
    const totalPaid = regs.reduce((s, r) => s + r.total, 0);
    summary.textContent = regs.length + " booking" + (regs.length === 1 ? "" : "s") + " · " + totalTickets + " ticket" + (totalTickets === 1 ? "" : "s") + " · " + (totalPaid ? "₹" + totalPaid.toLocaleString("en-IN") : "Free");

    list.innerHTML = regs.map((r) => {
      const e = EVENTS.find((x) => x.id === r.eventId);
      return (
        '<article class="ticket">' +
          '<div class="ticket-main">' +
            "<h3>" + escapeHTML(r.eventName) + "</h3>" +
            (e ? '<p class="meta">📅 ' + formatDate(e.date) + " · " + formatTime(e.date) + "</p><p class=\"meta\">📍 " + escapeHTML(e.venue) + ", " + escapeHTML(e.city) + "</p>" : "") +
            '<p class="meta">👤 ' + escapeHTML(r.name) + " · " + escapeHTML(r.email) + "</p>" +
            '<div class="ticket-actions">' +
              (e ? '<a class="btn btn-outline small" href="event.html?id=' + e.id + '">View event</a>' +
                   '<button class="btn btn-outline small" data-cal="' + e.id + '">📆 Calendar</button>' : "") +
              '<button class="btn btn-danger small" data-cancel="' + r.id + '">Cancel</button>' +
            "</div>" +
          "</div>" +
          '<div class="ticket-stub"><small>Ticket ID</small><strong>' + r.id + "</strong><span>" + r.tickets + " × ticket</span><em>" + (r.total ? "₹" + r.total.toLocaleString("en-IN") : "Free") + "</em></div>" +
        "</article>"
      );
    }).join("");
  }

  list.addEventListener("click", (ev) => {
    const cancel = ev.target.closest("[data-cancel]");
    const cal = ev.target.closest("[data-cal]");
    if (cancel && confirm("Cancel this registration? This cannot be undone.")) {
      Store.remove(cancel.dataset.cancel);
      toast("Registration cancelled.", "info");
      render();
    }
    if (cal) downloadICS(EVENTS.find((e) => e.id === +cal.dataset.cal));
  });

  $("#clearAll").addEventListener("click", () => {
    if (confirm("Remove ALL your saved registrations?")) { Store.clear(); toast("All registrations cleared.", "info"); render(); }
  });

  render();
})();
