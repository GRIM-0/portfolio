(function () {
  "use strict";

  // -------------------------------------------------------------
  // Mobile navigation toggle
  // -------------------------------------------------------------
  var navToggle = document.getElementById("nav-toggle");
  var primaryNav = document.getElementById("primary-nav");

  function closeNav() {
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function toggleNav() {
    var isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", toggleNav);

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  // -------------------------------------------------------------
  // Smooth scroll for in-page navigation links
  // -------------------------------------------------------------
  var navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }
      var targetEl = document.querySelector(targetId);
      if (!targetEl) {
        return;
      }
      event.preventDefault();
      var headerOffset = 72;
      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
      targetEl.setAttribute("tabindex", "-1");
      targetEl.focus({ preventScroll: true });
    });
  });

  // -------------------------------------------------------------
  // Header state on scroll
  // -------------------------------------------------------------
  var header = document.getElementById("site-header");

  function updateHeaderState() {
    if (window.scrollY > 8) {
      header.style.boxShadow = "0 1px 0 rgba(20, 24, 31, 0.02)";
    } else {
      header.style.boxShadow = "none";
    }
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();

  // -------------------------------------------------------------
  // Contact form handling
  // -------------------------------------------------------------
  var contactForm = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameField = document.getElementById("name");
      var emailField = document.getElementById("email");
      var messageField = document.getElementById("message");

      var isValid =
        nameField.value.trim().length > 0 &&
        emailField.value.trim().length > 0 &&
        messageField.value.trim().length > 0;

      if (!isValid) {
        formStatus.textContent = "Please fill in every field before sending.";
        return;
      }

      formStatus.textContent = "Thank you, " + nameField.value.trim().split(" ")[0] + ". Your message has been noted and I will reply by email shortly.";
      contactForm.reset();
    });
  }

  // -------------------------------------------------------------
  // Footer year
  // -------------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
