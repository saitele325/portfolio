/* ============================================================
   scroll.js — All scroll-related functionality
   Pure vanilla JS, no libraries
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  // --------------------------------------------------------
  // 1. SCROLL PROGRESS BAR
  // --------------------------------------------------------
  // Updates #scroll-progress width as the user scrolls
  // --------------------------------------------------------
  const scrollProgressBar = document.getElementById("scroll-progress");

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollableDistance = scrollHeight - clientHeight;

    if (scrollableDistance <= 0) {
      scrollProgressBar.style.width = "0%";
      return;
    }

    const percentage = (scrollTop / scrollableDistance) * 100;
    scrollProgressBar.style.width = percentage + "%";
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  // --------------------------------------------------------
  // 2. REVEAL ON SCROLL (IntersectionObserver)
  // --------------------------------------------------------
  // Elements with .reveal-up / .reveal-left / .reveal-right
  // get "revealed" class once they enter the viewport
  // --------------------------------------------------------
  const revealElements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right"
  );

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // --------------------------------------------------------
  // 3. ACTIVE SECTION TRACKING
  // --------------------------------------------------------
  // Highlights the correct navbar link based on which
  // section is currently in the viewport
  // --------------------------------------------------------
  const sections = document.querySelectorAll(
    "section[id]"
  );

  const navbarLinks = document.querySelectorAll(".navbar__link");
  const mobileNavbarLinks = document.querySelectorAll(".navbar__mobile-link");

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");

          // Desktop navbar links
          navbarLinks.forEach(function (link) {
            link.classList.remove("active");
            var linkHref = link.getAttribute("href");
            if (linkHref && linkHref.substring(1) === currentId) {
              link.classList.add("active");
            }
          });

          // Mobile navbar links
          mobileNavbarLinks.forEach(function (link) {
            link.classList.remove("active");
            var linkHref = link.getAttribute("href");
            if (linkHref && linkHref.substring(1) === currentId) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

});