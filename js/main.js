(function () {
  "use strict";

  var NAV_BREAKPOINT = 1200;

  var body = document.body;
  var chrome = document.querySelector("[data-site-chrome]");
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("primary-nav");
  var overlay = document.querySelector("[data-menu-overlay]");

  function isMobileNav() {
    return window.matchMedia("(max-width: " + NAV_BREAKPOINT + "px)").matches;
  }

  function setMenuOpen(open) {
    if (!toggle || !nav || !overlay) return;

    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    nav.classList.toggle("is-open", open);
    nav.setAttribute("aria-hidden", open || !isMobileNav() ? "false" : "true");

    overlay.classList.toggle("is-visible", open);
    overlay.setAttribute("aria-hidden", open ? "false" : "true");

    body.classList.toggle("is-menu-open", open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function updateChromeHeight() {
    if (!chrome) return;
    var height = Math.ceil(chrome.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--site-chrome-height", height + "px");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setMenuOpen(open);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    updateChromeHeight();
    if (!isMobileNav()) closeMenu();
  });

  if (chrome && typeof ResizeObserver !== "undefined") {
    var observer = new ResizeObserver(function () {
      updateChromeHeight();
    });
    observer.observe(chrome);
  }

  updateChromeHeight();
  window.addEventListener("load", updateChromeHeight);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateChromeHeight).catch(function () {});
  }

  // Initial ARIA state for desktop vs mobile
  if (nav) {
    nav.setAttribute("aria-hidden", isMobileNav() ? "true" : "false");
  }
  if (overlay) {
    overlay.setAttribute("aria-hidden", "true");
  }
})();
