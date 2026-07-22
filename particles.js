/* ==========================================
   Particle System — AI-Themed Canvas Background
   Pure Vanilla JS — No Libraries
   ========================================== */

(function () {
  "use strict";

  /* ------------------------------------------
     Wait for DOM to be ready
     ------------------------------------------ */
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    /* ------------------------------------------
       Canvas & Context Setup
       ------------------------------------------ */
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) {
      console.warn("particles.js: #particles-canvas not found.");
      return;
    }
    const ctx = canvas.getContext("2d");

    /* ------------------------------------------
       Sizing
       ------------------------------------------ */
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);

    /* ------------------------------------------
       Mouse Tracking
       ------------------------------------------ */
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", function () {
      mouse.x = null;
      mouse.y = null;
    });

    /* ------------------------------------------
       Configuration
       ------------------------------------------ */
    const PARTICLE_COUNT = 80;
    const LINE_MAX_DIST = 120;
    const AI_DOT_COUNT = Math.floor(Math.random() * 4) + 5; // 5 – 8
    const COLORS = [
      "59,130,246",   // blue
      "139,92,246",   // purple
      "6,182,212",    // cyan
    ];

    /* ------------------------------------------
       Utility Helpers
       ------------------------------------------ */
    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    /* ------------------------------------------
       Particle Class — Small dots
       ------------------------------------------ */
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = random(-0.3, 0.3);
        this.vy = random(-0.3, 0.3);
        this.radius = random(0.5, 2);
        this.opacity = random(0.1, 0.5);
        this.color = pick(COLORS);
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + this.color + "," + this.opacity + ")";
        ctx.fill();
      }

      update() {
        /* Edge wrapping */
        if (this.x > width + this.radius) this.x = -this.radius;
        else if (this.x < -this.radius) this.x = width + this.radius;

        if (this.y > height + this.radius) this.y = -this.radius;
        else if (this.y < -this.radius) this.y = height + this.radius;

        /* Mouse attraction (subtle parallax) */
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.vx += (dx / dist) * force * 0.02;
            this.vy += (dy / dist) * force * 0.02;
          }
        }

        /* Damping so particles don't accelerate forever */
        this.vx *= 0.999;
        this.vy *= 0.999;

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    /* ------------------------------------------
       AI-Themed Dot Class — Larger, slower, brighter
       ------------------------------------------ */
    class AiDot {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = random(-0.15, 0.15);
        this.vy = random(-0.15, 0.15);
        this.radius = random(2, 4);
        this.opacity = random(0.35, 0.7);
        this.color = pick(COLORS);
        this.pulse = random(0, Math.PI * 2); // phase offset for glow pulse
        this.pulseSpeed = random(0.005, 0.015);
      }

      draw() {
        /* Pulsing glow effect */
        this.pulse += this.pulseSpeed;
        const glow = 0.5 + 0.5 * Math.sin(this.pulse);
        const currentOpacity = this.opacity * (0.7 + 0.3 * glow);
        const currentRadius = this.radius + glow * 0.8;

        /* Outer glow ring */
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius + 3, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(" + this.color + "," + currentOpacity * 0.15 + ")";
        ctx.fill();

        /* Core dot */
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(" + this.color + "," + currentOpacity + ")";
        ctx.fill();
      }

      update() {
        /* Edge wrapping */
        if (this.x > width + this.radius) this.x = -this.radius;
        else if (this.x < -this.radius) this.x = width + this.radius;

        if (this.y > height + this.radius) this.y = -this.radius;
        else if (this.y < -this.radius) this.y = height + this.radius;

        /* Mouse attraction — even more subtle for these */
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.vx += (dx / dist) * force * 0.01;
            this.vy += (dy / dist) * force * 0.01;
          }
        }

        this.vx *= 0.9995;
        this.vy *= 0.9995;

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    /* ------------------------------------------
       Populate Particle Arrays
       ------------------------------------------ */
    const particles = [];
    const aiDots = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
    for (let i = 0; i < AI_DOT_COUNT; i++) {
      aiDots.push(new AiDot());
    }

    /* ------------------------------------------
       Draw Connecting Lines Between Close Particles
       ------------------------------------------ */
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINE_MAX_DIST) {
            const opacity = (1 - dist / LINE_MAX_DIST) * 0.05;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(59,130,246," + opacity + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        /* Lines from small particles to AI dots */
        for (let a = 0; a < aiDots.length; a++) {
          const dx = particles[i].x - aiDots[a].x;
          const dy = particles[i].y - aiDots[a].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINE_MAX_DIST) {
            const opacity = (1 - dist / LINE_MAX_DIST) * 0.03;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(aiDots[a].x, aiDots[a].y);
            ctx.strokeStyle =
              "rgba(139,92,246," + opacity + ")";
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
    }

    /* ------------------------------------------
       Animation Loop
       ------------------------------------------ */
    function animate() {
      ctx.clearRect(0, 0, width, height);

      /* Update & draw connecting lines */
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      for (let i = 0; i < aiDots.length; i++) {
        aiDots[i].update();
      }

      drawLines();

      /* Draw all particles */
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
      }

      /* Draw AI dots on top */
      for (let i = 0; i < aiDots.length; i++) {
        aiDots[i].draw();
      }

      requestAnimationFrame(animate);
    }

    /* ------------------------------------------
       Handle Resize — Reposition Particles In-Bounds
       ------------------------------------------ */
    const originalResize = resize;
    window.removeEventListener("resize", resize);

    window.addEventListener("resize", function () {
      originalResize.call(window);

      /* Push particles that ended up outside new bounds back in */
      particles.forEach(function (p) {
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      });
      aiDots.forEach(function (d) {
        if (d.x > width) d.x = Math.random() * width;
        if (d.y > height) d.y = Math.random() * height;
      });
    });

    /* ------------------------------------------
       Kick Off
       ------------------------------------------ */
    animate();
  }
})();
