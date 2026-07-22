/**
 * navbar.js - Portfolio Navbar Functionality
 * Handles sticky navbar, hamburger menu, smooth scrolling, and accessibility.
 */

(function () {
  'use strict';

  // ============================================================
  // DOM Ready
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // Element References
    // ============================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!navbar || !hamburger || !mobileMenu) {
      console.warn('Navbar elements not found in the DOM.');
      return;
    }

    // ============================================================
    // 1. Sticky Navbar with Scroll Effect
    // Adds/removes "scrolled" class based on scroll position
    // ============================================================
    function handleNavbarScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // ============================================================
    // 2. Hamburger Menu Toggle
    // Toggles "active" class on hamburger and mobile menu
    // ============================================================
    function toggleMobileMenu() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');

      if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // ============================================================
    // 3. Smooth Scroll for All Nav Links
    // Handles both desktop and mobile navigation links
    // ============================================================
    const allNavLinks = document.querySelectorAll(
      '.navbar__link, .navbar__mobile-link'
    );

    allNavLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        const href = this.getAttribute('href');

        if (!href || href === '#') return;

        const targetSection = document.querySelector(href);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }

        // Close mobile menu if open after navigating
        if (mobileMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // ============================================================
    // 4. Close Mobile Menu on Outside Click
    // Clicks outside the navbar close the mobile menu
    // ============================================================
    document.addEventListener('click', function (event) {
      const isClickInsideNavbar = navbar.contains(event.target);

      if (!isClickInsideNavbar && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // ============================================================
    // 5. Close Mobile Menu on Escape Key
    // Accessibility: pressing Escape closes the mobile menu
    // ============================================================
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to the hamburger button for accessibility
        hamburger.focus();
      }
    });

  }); // end DOMContentLoaded

})();