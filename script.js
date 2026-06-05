import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ---------- Lenis smooth scroll ----------
if (typeof Lenis !== "undefined" && !prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.08,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    lerp: 0.08,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ---------- Cursor premium ----------
const cursor = document.querySelector(".cursor");
if (cursor && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    gsap.to(cursor, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.15,
      ease: "power2.out",
    });
  });

  document
    .querySelectorAll("a, button, input, textarea, [data-tilt]")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("active"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("active"),
      );
    });
}

// ---------- Magnetic buttons ----------
if (window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const factor = 20;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * factor;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * factor;

      gsap.to(el, {
        x,
        y,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.45)",
      });
    });
  });
}

// ---------- Menu móvil ----------
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", String(expanded));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });
}

// ---------- Navbar state ----------
const nav = document.querySelector(".nav");
window.addEventListener(
  "scroll",
  () => {
    nav?.classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true },
);

// ---------- GSAP matchMedia for responsive animations ----------
const mm = gsap.matchMedia();

// Desktop animations
mm.add("(min-width: 1025px)", () => {
  // Hero image intro
  gsap.to(".hero-media img", {
    scale: 1,
    duration: prefersReducedMotion ? 0.01 : 2,
    ease: "power2.out",
  });

  if (!prefersReducedMotion) {
    gsap.fromTo(
      ".hero-media img",
      { yPercent: -4, scale: 1.14 },
      {
        yPercent: 20,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }

  // Parallax cards
  gsap.utils.toArray(".property-card").forEach((card, i) => {
    gsap.from(card, {
      y: 120,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: i * 0.08,
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
      },
    });

    gsap.to(card.querySelector("img"), {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Tilt interaction
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      gsap.to(card, {
        rotateY: (x - 0.5) * 24,
        rotateX: (0.5 - y) * 20,
        scale: 1.05,
        transformPerspective: 600,
        duration: 0.28,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    });
  });
});

// Tablet landscape
mm.add("(max-width: 1024px) and (orientation: landscape)", () => {
  gsap.to(".hero-media img", {
    scale: 1,
    duration: prefersReducedMotion ? 0.01 : 1.5,
    ease: "power2.out",
  });

  gsap.utils.toArray(".property-card").forEach((card, i) => {
    gsap.from(card, {
      y: 80,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: i * 0.06,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
      },
    });
  });
});

// Tablet portrait
mm.add("(max-width: 1024px) and (orientation: portrait)", () => {
  gsap.to(".hero-media img", {
    scale: 1,
    duration: prefersReducedMotion ? 0.01 : 1.5,
    ease: "power2.out",
  });

  gsap.utils.toArray(".property-card").forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      delay: i * 0.05,
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
      },
    });
  });
});

// Mobile portrait
mm.add("(max-width: 599px)", () => {
  gsap.to(".hero-media img", {
    scale: 1,
    duration: prefersReducedMotion ? 0.01 : 1,
    ease: "power2.out",
  });

  gsap.utils.toArray(".property-card").forEach((card, i) => {
    gsap.from(card, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      delay: i * 0.04,
      scrollTrigger: {
        trigger: card,
        start: "top 94%",
      },
    });
  });
});

// Mobile landscape
mm.add("(max-width: 768px) and (orientation: landscape)", () => {
  gsap.to(".hero-media img", {
    scale: 1,
    duration: prefersReducedMotion ? 0.01 : 1,
    ease: "power2.out",
  });

  gsap.utils.toArray(".property-card").forEach((card, i) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: i * 0.05,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
      },
    });
  });
});

// ---------- Universal reveal & counters (all breakpoints) ----------
gsap.to(".reveal-title", {
  y: 0,
  opacity: 1,
  duration: prefersReducedMotion ? 0.01 : 1.2,
  ease: "power3.out",
  delay: 0.12,
});

gsap.utils.toArray(".reveal").forEach((item) => {
  gsap.fromTo(
    item,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 86%",
      },
    },
  );
});

// ---------- Counters ----------
const counters = gsap.utils.toArray(".counter");
counters.forEach((counter) => {
  const target = Number(counter.dataset.target || 0);
  const snap = { val: 0 };

  gsap.to(snap, {
    val: target,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: counter,
      start: "top 90%",
      once: true,
    },
    onUpdate: () => {
      const suffix = "+";
      counter.textContent = `${Math.round(snap.val)}${suffix}`;
    },
  });
});

// ---------- Three.js ambient particles (azul cobalto) ----------
const canvas = document.getElementById("luxCanvas");
if (canvas) {
  if (prefersReducedMotion) {
    canvas.style.display = "none";
  } else {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 35;

    const pointsCountPrimary = window.innerWidth < 768 ? 2200 : 3500;
    const pointsCountSecondary = window.innerWidth < 768 ? 700 : 1200;

    const createField = ({
      count,
      color,
      size,
      opacity,
      spreadX,
      spreadY,
      spreadZ,
    }) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * spreadX;
        pos[i + 1] = (Math.random() - 0.5) * spreadY;
        pos[i + 2] = (Math.random() - 0.5) * spreadZ;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

      const mat = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const field = new THREE.Points(geo, mat);
      scene.add(field);
      return { field, mat };
    };

    // Azul cobalto – partículas principales en el hero oscuro
    const primary = createField({
      count: pointsCountPrimary,
      color: "#60a5fa",
      size: 0.18,
      opacity: 0.5,
      spreadX: 96,
      spreadY: 56,
      spreadZ: 70,
    });

    // Blanco puro – sutiles puntos de luz
    const secondary = createField({
      count: pointsCountSecondary,
      color: "#ffffff",
      size: 0.1,
      opacity: 0.35,
      spreadX: 78,
      spreadY: 46,
      spreadZ: 90,
    });

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      primary.field.rotation.y += 0.0018;
      primary.field.rotation.x += 0.00075;
      secondary.field.rotation.y -= 0.0011;
      secondary.field.rotation.x += 0.00045;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        primary.field.rotation.z = self.progress * 0.8;
        secondary.field.rotation.z = -self.progress * 0.55;
        primary.mat.opacity = 0.6 - self.progress * 0.3;
        secondary.mat.opacity = 0.4 - self.progress * 0.18;
      },
    });
  }
}

// ---------- Form UX ----------
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  const feedback = leadForm.querySelector(".form-feedback");

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(feedback instanceof HTMLElement)) return;

    feedback.textContent =
      "¡Solicitud enviada! Nuestro equipo de especialistas te contactará en menos de 24 horas.";
    leadForm.reset();

    gsap.fromTo(
      feedback,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    );
  });
}
