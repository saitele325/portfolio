/**
 * Main Application JavaScript
 * Portfolio Website — Vanilla JS, No Libraries
 */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     1. LOADING SCREEN
     ============================================================ */
  const loader = document.getElementById("loader");

  if (loader) {
    setTimeout(function () {
      loader.classList.add("hidden");

      loader.addEventListener("transitionend", function handler() {
        loader.removeEventListener("transitionend", handler);
        loader.style.display = "none";

        const hero = document.querySelector(".hero");
        if (hero) {
          hero.classList.add("loaded");
        }
      });
    }, 1500);
  }

  /* ============================================================
     2. TYPING EFFECT
     ============================================================ */
  const typingText = document.getElementById("typing-text");

  if (typingText) {
    const strings = [
      "AI/ML Student | Python Developer",
      "Building Intelligent Solutions",
      "Exploring Artificial Intelligence",
      "Passionate About Technology",
      "Future AI Engineer"
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentString = strings[stringIndex];

      if (isDeleting) {
        // Delete one character
        charIndex--;
        typingText.textContent = currentString.substring(0, charIndex);

        if (charIndex === 0) {
          // Done deleting, move to next string
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          setTimeout(typeEffect, 400);
          return;
        }

        setTimeout(typeEffect, 50);
      } else {
        // Type one character
        charIndex++;
        typingText.textContent = currentString.substring(0, charIndex);

        if (charIndex === currentString.length) {
          // Finished typing, pause then start deleting
          isDeleting = true;
          setTimeout(typeEffect, 2000);
          return;
        }

        setTimeout(typeEffect, 100);
      }
    }

    typeEffect();
  }

  /* ============================================================
     3. CURSOR GLOW FOLLOW MOUSE
     ============================================================ */
  const cursorGlow = document.getElementById("cursor-glow");

  if (cursorGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let glowVisible = false;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!glowVisible) {
        glowVisible = true;
        cursorGlow.style.opacity = "1";
      }
    });

    document.addEventListener("mouseleave", function () {
      glowVisible = false;
      cursorGlow.style.opacity = "0";
    });

    document.addEventListener("mouseenter", function () {
      glowVisible = true;
      cursorGlow.style.opacity = "1";
    });

    function updateGlow() {
      cursorGlow.style.left = mouseX + "px";
      cursorGlow.style.top = mouseY + "px";
      requestAnimationFrame(updateGlow);
    }

    requestAnimationFrame(updateGlow);
  }

  /* ============================================================
     4. BUTTON RIPPLE EFFECT
     ============================================================ */
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const size = Math.max(rect.width, rect.height);
      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      ripple.style.left = (x - size / 2) + "px";
      ripple.style.top = (y - size / 2) + "px";

      btn.appendChild(ripple);

      setTimeout(function () {
        ripple.remove();
      }, 600);
    });
  });

  /* ============================================================
     5. CONTACT FORM HANDLING
     ============================================================ */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameField = contactForm.querySelector('[name="name"], #name, #form-name');
      const emailField = contactForm.querySelector('[name="email"], #email, #form-email');
      const subjectField = contactForm.querySelector('[name="subject"], #subject, #form-subject');
      const messageField = contactForm.querySelector('[name="message"], #message, #form-message');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let isValid = true;

      // Reset error styles
      [nameField, emailField, subjectField, messageField].forEach(function (field) {
        if (field) {
          field.style.borderColor = "";
        }
      });

      // Validate name
      if (nameField && nameField.value.trim() === "") {
        nameField.style.borderColor = "red";
        isValid = false;
      }

      // Validate email
      if (emailField && !emailRegex.test(emailField.value.trim())) {
        emailField.style.borderColor = "red";
        isValid = false;
      }

      // Validate subject
      if (subjectField && subjectField.value.trim() === "") {
        subjectField.style.borderColor = "red";
        isValid = false;
      }

      // Validate message
      if (messageField && messageField.value.trim() === "") {
        messageField.style.borderColor = "red";
        isValid = false;
      }

      if (isValid) {
        // Hide the form
        contactForm.style.display = "none";

        // Create success message
        const successDiv = document.createElement("div");
        successDiv.classList.add("form-success");
        successDiv.innerHTML =
          '<div style="text-align:center; padding:2rem;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>' +
              '<polyline points="22 4 12 14.01 9 11.01"/>' +
            '</svg>' +
            '<h3 style="margin-top:1rem; color:#00e676;">Message Sent!</h3>' +
            '<p style="margin-top:0.5rem; color:#b0b0b0;">Thank you! Your message has been sent. This is a frontend portfolio — connect Formspree or EmailJS later.</p>' +
          '</div>';

        contactForm.parentNode.insertBefore(successDiv, contactForm.nextSibling);
      }
    });
  }

  /* ============================================================
     6. CURRENT YEAR IN FOOTER
     ============================================================ */
  const currentYearSpan = document.getElementById("current-year");

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ============================================================
     7. PARALLAX EFFECT ON HERO BLOBS
     ============================================================ */
  const heroSection = document.querySelector(".hero");
  const heroBlobs = document.querySelectorAll(".hero__blob");

  if (heroSection && heroBlobs.length > 0) {
    heroSection.addEventListener("mousemove", function (e) {
      const rect = heroSection.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      requestAnimationFrame(function () {
        heroBlobs.forEach(function (blob, index) {
          const offsetX = mouseX * 0.02 * (index + 1);
          const offsetY = mouseY * 0.03 * (index + 1);
          blob.style.transform = "translate(" + offsetX + "px, " + offsetY + "px)";
        });
      });
    });
  }

  /* ============================================================
     8. HERO IMAGE SUBTLE PARALLAX
     ============================================================ */
  const heroImageWrapper = document.querySelector(".hero__image-wrapper");

  if (heroSection && heroImageWrapper) {
    heroSection.addEventListener("mousemove", function (e) {
      const rect = heroSection.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      requestAnimationFrame(function () {
        const offsetX = mouseX * 0.01;
        const offsetY = mouseY * 0.01;
        heroImageWrapper.style.transform = "translate(" + offsetX + "px, " + offsetY + "px)";
      });
    });
  }

});
