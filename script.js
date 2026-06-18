const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const header = document.querySelector(".site-header");
const internalLinks = document.querySelectorAll('a[href^="#"]');
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const year = document.querySelector("#copyright-year");

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

if (year) {
  year.textContent = String(new Date().getFullYear());
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
    },
  );

  navTargets.forEach(({ target }) => navObserver.observe(target));
}
