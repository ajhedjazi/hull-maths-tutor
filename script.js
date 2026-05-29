const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const internalLinks = document.querySelectorAll('a[href^="#"]');
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});

const toggleHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

if (header) {
  window.addEventListener("scroll", toggleHeaderState, { passive: true });
  toggleHeaderState();
}

const revealElements = document.querySelectorAll(
  [
    ".section-heading",
    ".section-lead",
    ".copy-stack",
    ".visual-card",
    ".soft-card",
    ".comparison-card",
    ".baseline-line",
    ".pillar-card",
    ".process-step",
    ".diagnostic-visual-panel__copy",
    ".clinical-note",
    ".client-card",
    ".not-for",
    ".image-band",
    ".included-item",
    ".proof-card",
    ".application-copy",
    ".application-form",
    ".footer-review",
  ].join(", ")
);

revealElements.forEach((element, index) => {
  element.classList.add("reveal");
  element.dataset.revealDelay = String(index % 4);
});

if (prefersReducedMotion) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

const navTargets = Array.from(navLinks)
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

const setActiveNavLink = (id) => {
  navTargets.forEach(({ link, target }) => {
    link.classList.toggle("is-active", target.id === id);
  });
};

if ("IntersectionObserver" in window && navTargets.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveNavLink(visibleEntry.target.id);
      }
    },
    {
      rootMargin: "-24% 0px -56% 0px",
      threshold: [0.12, 0.24, 0.4],
    }
  );

  navTargets.forEach(({ target }) => navObserver.observe(target));
}

const applicationForm = document.querySelector(".application-form");
const formStatus = document.querySelector("#form-status");

if (applicationForm && formStatus) {
  applicationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent =
      "Thanks. This placeholder form is ready to connect to your booking or CRM workflow.";
    applicationForm.reset();
  });
}

const floatingActions = document.querySelectorAll(".floating-action");
const backToTopButton = document.querySelector(".floating-action--top");

const toggleFloatingActions = () => {
  const shouldShow = window.scrollY > 300;

  floatingActions.forEach((action) => {
    action.classList.toggle("is-visible", shouldShow);
  });
};

if (floatingActions.length) {
  window.addEventListener("scroll", toggleFloatingActions, { passive: true });
  toggleFloatingActions();
}

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}
