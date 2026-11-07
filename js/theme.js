/* Runs in <head> to avoid a flash of the wrong theme. */
(function () {
  var saved = null;
  try { saved = localStorage.getItem("eventora:theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
})();
