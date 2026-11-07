/* =========================================================
   data.js - events data + shared event helpers
   Dates are generated relative to "today" so the demo
   countdowns never expire. Replace with fixed ISO dates
   for a real event schedule.
   ========================================================= */
const at = (days, hour = 10, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const EVENTS = [
  {
    id: 1, name: "Tech Summit 2027", category: "Conference", featured: true,
    date: at(45, 10), durationHrs: 8, venue: "HITEX Convention Centre", city: "Hyderabad",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
    description: "Meet industry leaders and explore the future of AI, cloud and web technologies.",
    details: "A full-day summit featuring keynote talks, live demos and networking sessions with top engineers and founders. Includes lunch, a swag kit and access to all recorded sessions.",
    price: 999, seats: 400, booked: 312, organizer: "TechIndia Forum",
    agenda: [["10:00", "Registration & Welcome Coffee"], ["11:00", "Keynote: The Future of Web & AI"], ["13:00", "Lunch & Networking"], ["14:30", "Live Demo Sessions"], ["17:00", "Panel Discussion & Closing"]]
  },
  {
    id: 2, name: "Sunburn Beats Live", category: "Concert", featured: true,
    date: at(60, 18, 30), durationHrs: 6, venue: "Mahalaxmi Grounds", city: "Mumbai",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80",
    description: "An electrifying night of live music, lights and unforgettable beats.",
    details: "Top artists perform across two stages with food stalls, a chill zone and a spectacular laser show. Gates open at 5 PM. Please carry a valid photo ID.",
    price: 1499, seats: 1000, booked: 960, organizer: "Beats Entertainment",
    agenda: [["17:00", "Gates Open"], ["18:30", "Opening DJ Set"], ["20:00", "Headline Artist Performance"], ["22:30", "Laser Show & Finale"]]
  },
  {
    id: 3, name: "Web Design Workshop", category: "Workshop", featured: true,
    date: at(14, 11), durationHrs: 6, venue: "Innovation Hub", city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80",
    description: "Hands-on workshop on building responsive websites with HTML, CSS and JS.",
    details: "Learn layout, Flexbox, Grid, animations and deployment in one full day. Bring your laptop. Certificates will be provided to all participants.",
    price: 299, seats: 60, booked: 41, organizer: "K Explore Academy",
    agenda: [["11:00", "HTML5 & Semantic Structure"], ["12:30", "CSS Flexbox & Grid"], ["14:00", "Lunch Break"], ["14:45", "JavaScript Interactivity"], ["16:30", "Deploy to Netlify / Vercel"]]
  },
  {
    id: 4, name: "Startup Pitch Night", category: "Business",
    date: at(30, 17), durationHrs: 4, venue: "T-Hub", city: "Hyderabad",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80",
    description: "Watch 15 early-stage startups pitch to leading investors.",
    details: "Network with founders, mentors and VCs. Top 3 pitches win funding support and mentorship. Light dinner included.",
    price: 0, seats: 150, booked: 88, organizer: "Founders Circle",
    agenda: [["17:00", "Networking & Registration"], ["17:45", "Startup Pitches (Round 1)"], ["19:15", "Dinner Break"], ["19:45", "Final Pitches & Awards"]]
  },
  {
    id: 5, name: "Odisha Food Festival", category: "Festival",
    date: at(21, 12), durationHrs: 9, venue: "Kalinga Stadium Grounds", city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80",
    description: "Taste the best of Odia cuisine, street food and live cultural shows.",
    details: "50+ food stalls, cooking demonstrations, folk dance performances and kids' activities for the whole family.",
    price: 100, seats: 800, booked: 430, organizer: "Odisha Tourism",
    agenda: [["12:00", "Festival Opens"], ["14:00", "Live Cooking Demo"], ["17:00", "Folk Dance Performances"], ["20:00", "Closing Ceremony"]]
  },
  {
    id: 6, name: "Inter-College Hackathon", category: "Competition", featured: true,
    date: at(75, 9), durationHrs: 24, venue: "IIT Delhi Campus", city: "New Delhi",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80",
    description: "24 hours of coding, collaboration and creativity with big prizes.",
    details: "Teams of 2-4 build solutions to real-world problems. Mentors, meals and swag provided throughout. Prize pool of ₹1,00,000.",
    price: 199, seats: 300, booked: 205, organizer: "CodeSprint Club",
    agenda: [["09:00", "Opening & Problem Statements"], ["10:00", "Hacking Begins"], ["22:00", "Mentor Round"], ["Next day 09:00", "Final Demos & Prize Distribution"]]
  },
  {
    id: 7, name: "Yoga & Wellness Retreat", category: "Workshop",
    date: at(90, 6, 30), durationHrs: 10, venue: "Riverside Camp", city: "Rishikesh",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80",
    description: "A calming weekend of yoga, meditation and healthy living.",
    details: "Guided sessions by certified instructors, nutritious meals and a nature walk by the Ganges. Limited seats available.",
    price: 2499, seats: 40, booked: 33, organizer: "Ananda Wellness",
    agenda: [["06:30", "Sunrise Yoga"], ["09:00", "Healthy Breakfast"], ["11:00", "Meditation Workshop"], ["16:00", "Ganga Nature Walk"]]
  },
  {
    id: 8, name: "Stand-up Comedy Evening", category: "Concert",
    date: at(25, 20), durationHrs: 3, venue: "Phoenix Arena", city: "Bengaluru",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=900&q=80",
    description: "An evening of laughter with India's top stand-up comedians.",
    details: "Four comedians, one hilarious night. Seats are first-come, first-served. Recommended for ages 16+.",
    price: 799, seats: 250, booked: 250, organizer: "LOL Productions",
    agenda: [["19:30", "Doors Open"], ["20:00", "Opening Act"], ["20:45", "Headline Comedians"], ["22:15", "Show Ends"]]
  },
  {
    id: 9, name: "UI/UX Design Meetup", category: "Business",
    date: at(10, 16), durationHrs: 3, venue: "WeWork Galaxy", city: "Bengaluru",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&q=80",
    description: "Talks and portfolio reviews from senior product designers.",
    details: "Three short talks on design systems, accessibility and motion, followed by open portfolio reviews. Snacks provided.",
    price: 0, seats: 120, booked: 52, organizer: "DesignOps India",
    agenda: [["16:00", "Welcome"], ["16:15", "Talk: Design Systems at Scale"], ["17:00", "Talk: Accessible Design"], ["17:45", "Portfolio Reviews"]]
  },
  {
    id: 10, name: "Classical Music Evening", category: "Festival",
    date: at(38, 19), durationHrs: 3, venue: "Rabindra Mandap", city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
    description: "A soulful evening of Odissi and Hindustani classical performances.",
    details: "Renowned artists present an unforgettable evening of classical music and dance. Seating is arranged on a first-come basis.",
    price: 250, seats: 500, booked: 190, organizer: "Utkal Sangeet Samaj",
    agenda: [["19:00", "Inauguration"], ["19:30", "Odissi Dance Recital"], ["20:30", "Hindustani Vocal Concert"]]
  }
];

/* Fallback artwork when a remote image can't load (offline-safe). */
const FALLBACK_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6c5ce7"/><stop offset="1" stop-color="#ff6b9a"/></linearGradient></defs><rect width="900" height="560" fill="url(#g)"/><text x="50%" y="50%" fill="#fff" font-size="54" font-family="Arial" font-weight="700" text-anchor="middle" dominant-baseline="middle">Eventora</text></svg>'
);

/* ---------- helpers ---------- */
const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const formatTime = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const formatPrice = (p) => (p === 0 ? "Free" : "₹" + p.toLocaleString("en-IN"));
const seatsLeft = (e) => Math.max(0, e.seats - e.booked - Store.bookedFor(e.id));

function getTimeLeft(iso) {
  const diff = new Date(iso) - new Date();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60)
  };
}

function seatsLabel(e) {
  const left = seatsLeft(e);
  if (left === 0) return { text: "Sold out", cls: "sold" };
  if (left <= 30) return { text: "🔥 Only " + left + " left", cls: "low" };
  return { text: left + " seats left", cls: "ok" };
}

/* Reusable event card (home page + related events) */
function eventCard(e, i) {
  const s = seatsLabel(e);
  const pct = Math.min(100, Math.round(((e.seats - seatsLeft(e)) / e.seats) * 100));
  const t = getTimeLeft(e.date);
  return (
    '<article class="card" style="animation-delay:' + (i || 0) * 0.06 + 's">' +
      '<a class="card-img" href="event.html?id=' + e.id + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + e.image + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=FALLBACK_IMG;" />' +
        '<span class="tag">' + escapeHTML(e.category) + "</span>" +
        (e.featured ? '<span class="tag featured">⭐ Featured</span>' : "") +
        '<span class="price-pill">' + formatPrice(e.price) + "</span>" +
      "</a>" +
      '<div class="card-body">' +
        '<h3><a href="event.html?id=' + e.id + '">' + escapeHTML(e.name) + "</a></h3>" +
        '<p class="meta">📅 ' + formatDate(e.date) + " · " + formatTime(e.date) + "</p>" +
        '<p class="meta">📍 ' + escapeHTML(e.venue) + ", " + escapeHTML(e.city) + "</p>" +
        '<p class="desc">' + escapeHTML(e.description) + "</p>" +
        '<div class="seats ' + s.cls + '"><div class="bar"><span style="width:' + pct + '%"></span></div><small>' + s.text + "</small></div>" +
        '<div class="card-foot">' +
          '<span class="countdown-mini">' + (t ? "⏳ " + t.days + " days to go" : "Event started") + "</span>" +
          '<a class="btn btn-primary small" href="event.html?id=' + e.id + '">' + (s.cls === "sold" ? "View" : "View & Register") + "</a>" +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

/* Download an .ics calendar file for an event */
function downloadICS(e) {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(new Date(e.date).getTime() + e.durationHrs * 3600000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Eventora//EN", "BEGIN:VEVENT",
    "UID:" + e.id + "-" + Date.now() + "@eventora",
    "DTSTAMP:" + fmt(new Date()), "DTSTART:" + fmt(e.date), "DTEND:" + fmt(end),
    "SUMMARY:" + e.name, "LOCATION:" + e.venue + ", " + e.city, "DESCRIPTION:" + e.description,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url; a.download = e.name.replace(/\s+/g, "-").toLowerCase() + ".ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
