/*====================================================
DHTM STUDIO
SCRIPT V3 (cleaned & fixed)
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /*=========================================
  ELEMENTS
  =========================================*/

  const startupLoader = $("#startup-loader");
  const pageLoader     = $("#page-loader");
  const emailLoader    = $("#email-loader");

  const successPopup      = $("#success-popup");
  const errorPopup        = $("#error-popup");
  const popupClose        = $("#popup-close");
  const popupErrorClose   = $("#popup-error-close");

  const header = $("header");

  /*=========================================
  STARTUP LOADER
  =========================================*/

  window.addEventListener("load", () => {
    if (!startupLoader) return;

    document.body.style.overflow = "hidden";
    setTimeout(() => {
      startupLoader.classList.add("hide");
      document.body.style.overflow = "";
    }, 5200);
  });

  /*=========================================
  PAGE TRANSITION LOADER
  =========================================*/

  $$(".page-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.href;
      pageLoader?.classList.add("active");
      setTimeout(() => { window.location.href = url; }, 1800);
    });
  });

  /*=========================================
  HEADER ON SCROLL + NAV ACTIVE LINK
  =========================================*/

  const sections  = $$("section[id]");
  const navLinks  = $$("nav a");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 30);

    let current = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  });

  /*=========================================
  MOBILE NAV (HAMBURGER TOGGLE)
  =========================================*/

  const navToggle = $("#navToggle");
  const mainNav    = $("header nav");

  if (navToggle && mainNav) {
    const closeNav = () => {
      navToggle.classList.remove("active");
      mainNav.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isActive = mainNav.classList.toggle("active");
      navToggle.classList.toggle("active", isActive);
      navToggle.setAttribute("aria-expanded", String(isActive));
    });

    $$("a", mainNav).forEach(link => link.addEventListener("click", closeNav));

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /*=========================================
  SCROLL REVEAL
  =========================================*/

  const revealItems = $$(".about-card, .product-card, .gallery-item, .testimonial-card, .contact-wrapper");

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(item => {
      item.classList.add("reveal");
      revealObserver.observe(item);
    });
  }

  /*=========================================
  SMOOTH SCROLL FOR ANCHOR LINKS
  =========================================*/

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = $(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /*=========================================
  COUNTER ANIMATION
  =========================================*/

  const counters = $$(".counter-number");

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
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

    counters.forEach(item => counterObserver.observe(item));
  }

  /*=========================================
  FAQ ACCORDION
  =========================================*/

  $$(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item   = btn.parentElement;
      const answer = $(".faq-answer", item);

      item.classList.toggle("active");
      answer.style.maxHeight = item.classList.contains("active")
        ? answer.scrollHeight + "px"
        : null;
    });
  });

  /*=========================================
  GALLERY LIGHTBOX
  =========================================*/

  const galleryImages = $$(".gallery-item img");
  const lightbox       = $("#lightbox");
  const lightboxImage  = $("#lightbox-image");
  const btnClose       = $(".lightbox-close");
  const btnPrev        = $(".lightbox-prev");
  const btnNext        = $(".lightbox-next");

  if (lightbox && galleryImages.length) {
    let currentImage = 0;

    const showImage = () => {
      lightbox.classList.add("active");
      lightboxImage.src = galleryImages[currentImage].src;
      lightboxImage.alt = galleryImages[currentImage].alt || "";
    };

    galleryImages.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentImage = index;
        showImage();
      });
    });

    btnClose?.addEventListener("click", () => lightbox.classList.remove("active"));

    lightbox.addEventListener("click", (e) => {
      if (e.target.classList.contains("lightbox-bg")) lightbox.classList.remove("active");
    });

    btnPrev?.addEventListener("click", () => {
      currentImage = (currentImage - 1 + galleryImages.length) % galleryImages.length;
      showImage();
    });

    btnNext?.addEventListener("click", () => {
      currentImage = (currentImage + 1) % galleryImages.length;
      showImage();
    });

    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape")     lightbox.classList.remove("active");
      if (e.key === "ArrowLeft")  btnPrev?.click();
      if (e.key === "ArrowRight") btnNext?.click();
    });
  }

  /*=========================================
  CARD GLOW (mouse-tracking gradient)
  =========================================*/

  $$(".product-card, .about-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", (e.clientX - rect.left) + "px");
      card.style.setProperty("--y", (e.clientY - rect.top) + "px");
    });
  });

  /*=========================================
  SCROLL PROGRESS BAR
  =========================================*/

  const progress = $("#scroll-progress");

  if (progress) {
    window.addEventListener("scroll", () => {
      const total   = document.documentElement.scrollHeight - window.innerHeight;
      const percent = total > 0 ? (window.scrollY / total) * 100 : 0;
      progress.style.width = percent + "%";
    });
  }

  /*=========================================
  BACK TO TOP
  =========================================*/

  const backTop = $("#backTop");

  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 600);
    });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /*=========================================
  PARTICLE BACKGROUND
  =========================================*/

  const particleCanvas = $("#particle-bg");

  if (particleCanvas) {
    const ctx = particleCanvas.getContext("2d");
    let particles = [];

    const resizeParticleCanvas = () => {
      particleCanvas.width  = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };

    const spawnParticles = () => {
      particles = Array.from({ length: 90 }, () => ({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4
      }));
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > particleCanvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(57,255,20,.7)";
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    };

    resizeParticleCanvas();
    spawnParticles();
    animateParticles();

    window.addEventListener("resize", () => {
      resizeParticleCanvas();
      spawnParticles();
    });
  }

  /*=========================================
  CONFETTI (brand-colored canvas burst)
  =========================================*/

  const confettiCanvas = $("#confetti-canvas");
  let confettiPieces = [];

  const startConfetti = () => {
    if (!confettiCanvas) return;

    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = "block";

    const colors = ["#39ff14", "#8f00ff", "#00e5ff", "#ffffff", "#ffd400"];

    confettiPieces = Array.from({ length: 180 }, () => ({
      x: Math.random() * confettiCanvas.width,
      y: -20,
      size: Math.random() * 10 + 6,
      speed: Math.random() * 4 + 3,
      angle: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    const animateConfetti = () => {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      confettiPieces.forEach(c => {
        c.y += c.speed;
        c.x += Math.sin(c.angle) * 2;
        c.angle += 0.05;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.45);
        ctx.restore();
      });

      confettiPieces = confettiPieces.filter(c => c.y < confettiCanvas.height + 30);

      if (confettiPieces.length) {
        requestAnimationFrame(animateConfetti);
      } else {
        confettiCanvas.style.display = "none";
      }
    };

    animateConfetti();
  };

  /*=========================================
  CONTACT FORM (validation + EmailJS + popups)
  =========================================*/

  const contactForm = $("#contactForm");

  if (contactForm && window.emailjs) {
    emailjs.init({ publicKey: "YU6fGJ78khw8d-5bW" });

    const shake = (el) => {
      el.animate([
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(0)" }
      ], { duration: 400 });
      el.focus();
    };

    const showSuccess = () => {
      successPopup?.classList.add("active");
      startConfetti();
    };

    const showError = () => {
      errorPopup?.classList.add("active");
    };

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fields = [this.from_name, this.from_email, this.from_number, this.message];
      const invalidField = fields.find(field => field.value.trim() === "");

      if (invalidField) {
        shake(invalidField);
        return;
      }

      emailLoader?.classList.add("active");

      emailjs.sendForm("service_hmge1m4", "template_tv4mhdr", this)
        .then(() => {
          emailLoader?.classList.remove("active");
          showSuccess();
          this.reset();
        })
        .catch((err) => {
          console.error(err);
          emailLoader?.classList.remove("active");
          showError();
        });
    });
  }

  /*=========================================
  POPUP CLOSE (click button / click backdrop / ESC)
  =========================================*/

  popupClose?.addEventListener("click", () => successPopup?.classList.remove("active"));
  popupErrorClose?.addEventListener("click", () => errorPopup?.classList.remove("active"));

  successPopup?.addEventListener("click", (e) => {
    if (e.target === successPopup) successPopup.classList.remove("active");
  });

  errorPopup?.addEventListener("click", (e) => {
    if (e.target === errorPopup) errorPopup.classList.remove("active");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      successPopup?.classList.remove("active");
      errorPopup?.classList.remove("active");
    }
  });

});
