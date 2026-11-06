/*========================================================
DHTM STUDIO — HALAMAN LAYANAN (product.js)
Semua fitur di file ini KHUSUS untuk halaman ini saja.
Fitur umum (header scroll, hamburger, back-to-top, loader
halaman, particle background) sudah ditangani Script.js
yang juga di-load di halaman ini, supaya tidak dobel.
========================================================*/

document.addEventListener("DOMContentLoaded", () => {

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /*=========================================
  1. SCROLL REVEAL (fade-up) — IntersectionObserver
  =========================================*/

  const revealTargets = $$(".fade-up");

  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /*=========================================
  2. TIMELINE STEP REVEAL (muncul satu per satu saat discroll)
  =========================================*/

  const timelineSteps = $$(".timeline-step");

  if (timelineSteps.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    timelineSteps.forEach((step) => timelineObserver.observe(step));
  }

  /*=========================================
  3. TILT + GLOW EFFECT PADA CARD
     (help-card & service-card ikut miring ringan
     mengarah ke posisi mouse, plus titik glow)
  =========================================*/

  const tiltCards = $$(".help-card, .service-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;

      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /*=========================================
  4. CTA GLOW MENGIKUTI MOUSE
  =========================================*/

  const ctaGlass = $(".cta-glass");

  if (ctaGlass) {
    ctaGlass.addEventListener("mousemove", (e) => {
      const rect = ctaGlass.getBoundingClientRect();
      ctaGlass.style.setProperty("--x", (e.clientX - rect.left) + "px");
      ctaGlass.style.setProperty("--y", (e.clientY - rect.top) + "px");
    });
  }

  /*=========================================
  5. SMOOTH SCROLL UNTUK ANCHOR LINK
  =========================================*/

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = $(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /*=========================================
  6. ACTIVE NAVBAR SAAT SCROLL
  =========================================*/

  const sections = $$("section[id]");
  const navLinks = $$("nav a");

  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", () => {
      let current = "";

      sections.forEach((sec) => {
        const top = sec.offsetTop - 130;
        if (window.scrollY >= top) current = sec.id;
      });

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
      });
    });
  }

  /*=========================================
  7. COUNTER ANIMATION
     (siap dipakai kalau nanti ditambahkan section statistik,
     tinggal beri elemen class="counter-number" + data-target)
  =========================================*/

  const counters = $$(".counter-number");

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = +el.dataset.target;
        const speed  = Math.max(1, Math.ceil(target / 80));
        let current  = 0;

        const timer = setInterval(() => {
          current += speed;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + "+";
        }, 20);

        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach((el) => counterObserver.observe(el));
  }

  /*=========================================
  8. LAZY LOADING GALERI
     (native loading="lazy" sudah membantu, ditambah
     IntersectionObserver supaya gambar benar-benar
     hanya dimuat saat mendekati viewport)
  =========================================*/

  const galleryImages = $$(".masonry-item img[data-src]");

  if (galleryImages.length) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: "200px" });

    galleryImages.forEach((img) => lazyObserver.observe(img));
  }

  /*=========================================
  9. RIPPLE EFFECT PADA TOMBOL
  =========================================*/

  $$(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);

      ripple.classList.add("ripple");
      ripple.style.width  = size + "px";
      ripple.style.height = size + "px";
      ripple.style.left   = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top    = (e.clientY - rect.top - size / 2) + "px";

      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

});
