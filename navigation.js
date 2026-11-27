// The tiny head marker sets the initial layout; this script remains deferred.
// Its script error handler (or JS being off) leaves the full navigation available.
document.documentElement.classList.add("hmt-nav");

const initialiseBackToTop = () => {
  if (document.querySelector("[data-back-to-top]")) return;
  const desktop = window.matchMedia("(min-width: 1024px)");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.dataset.backToTop = "";
  button.setAttribute("aria-label", "Back to top");
  button.hidden = true;
  button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="m6 12 6-6 6 6M12 6v12" /></svg>';
  document.body.appendChild(button);

  let reachedHalfway = false;
  let frame = 0;
  const focusTop = () => {
    const target = document.querySelector(".site-header .brand, main");
    if (!target) return;
    if (!target.hasAttribute("tabindex") && target.tagName !== "A") {
      target.setAttribute("tabindex", "-1");
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
    target.focus({ preventScroll: true });
  };
  const hide = () => {
    if (document.activeElement === button) focusTop();
    button.hidden = true;
  };
  // CSS can blur the control before the media-query change callback runs.
  button.addEventListener("blur", () => {
    if (!desktop.matches) focusTop();
  });
  const update = () => {
    frame = 0;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const longPage = distance > Math.max(320, window.innerHeight / 2);
    if (!desktop.matches || !longPage || window.scrollY <= 96) reachedHalfway = false;
    else if (window.scrollY >= distance / 2) reachedHalfway = true;
    if (!reachedHalfway) { hide(); return; }

    button.hidden = false;
    button.style.bottom = "24px";
    const bounds = button.getBoundingClientRect();
    const controls = [...document.querySelectorAll("a[href], button, input:not([type='hidden']), select, textarea, summary")]
      .filter((element) => element !== button && element.getClientRects().length && getComputedStyle(element).visibility !== "hidden")
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width && rect.height && rect.left < bounds.right + 8 && rect.right > bounds.left - 8);
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0;
    let top = window.innerHeight - 24 - bounds.height;
    // Keep the normal corner position unless an actual link or field occupies it.
    // Move above that control rather than covering it on narrower desktop layouts.
    let collision;
    while ((collision = controls.find((rect) => rect.top < top + bounds.height + 8 && rect.bottom > top - 8))) {
      top = collision.top - bounds.height - 8;
    }
    if (top < Math.max(24, headerBottom + 12)) { hide(); return; }
    button.style.bottom = `${window.innerHeight - top - bounds.height}px`;
  };
  const scheduleUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  button.addEventListener("click", () => {
    focusTop();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  });
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("pageshow", scheduleUpdate);
  desktop.addEventListener("change", scheduleUpdate);
  if ("ResizeObserver" in window) new ResizeObserver(scheduleUpdate).observe(document.body);
  scheduleUpdate();
};

const initialiseNavigation = () => {
  const header = document.querySelector(".human-site .site-header");
  if (header && "ResizeObserver" in window) {
    const updateClearance = () => {
      if (!header.classList.contains("is-menu-open")) {
        document.documentElement.style.setProperty("--hmt-header-clearance", `${Math.max(108, header.getBoundingClientRect().height + 24)}px`);
      }
    };
    new ResizeObserver(updateClearance).observe(header);
    updateClearance();
  }
  initialiseBackToTop();
  const enquiryForm = document.querySelector(".enquiry-form");
  const serviceSelect = enquiryForm?.querySelector('[name="service"]');
  // A functional navigation instruction, not an identifier or tracking record.
  // Preserve native URLs/new-tab behaviour and accept only known service values.
  const serviceSelections = new Map([
    ["a-level", "A-Level Maths"],
    ["maths-mot", "Maths MOT"],
  ]);
  const requestedService = serviceSelections.get(new URLSearchParams(location.search).get("service"));
  if (serviceSelect && requestedService) serviceSelect.value = requestedService;
  const siteHeader = document.querySelector(".human-site .site-header");
  const menuToggle = siteHeader?.querySelector(".home-menu-toggle");
  const navigation = siteHeader?.querySelector("#home-navigation");

  if (siteHeader && menuToggle && navigation) {
    const mobileMenuQuery = window.matchMedia("(max-width: 1100px)");
    let lastNavigationFocus = null;
    const setMenu = (isOpen) => {
      siteHeader.classList.toggle("is-menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    };

    menuToggle.hidden = false;
    siteHeader.classList.add("home-nav-ready");

    document.addEventListener("focusin", (event) => {
      lastNavigationFocus = siteHeader.contains(event.target) ? event.target : null;
    });

    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    }, true);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && siteHeader.classList.contains("is-menu-open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!siteHeader.contains(event.target)) {
        setMenu(false);
        lastNavigationFocus = null;
      }
    });

    mobileMenuQuery.addEventListener("change", () => {
      // A browser may blur a link as soon as the media query hides its parent,
      // before this callback runs. Remember that focus so it is not lost.
      const focusedControl = document.activeElement === document.body
        ? lastNavigationFocus
        : document.activeElement;
      const focusWasInMenu = navigation.contains(focusedControl);
      const toggleHadFocus = focusedControl === menuToggle;
      setMenu(false);
      if (mobileMenuQuery.matches && focusWasInMenu) menuToggle.focus();
      if (!mobileMenuQuery.matches && toggleHadFocus) navigation.querySelector("a").focus();
    });

    document.querySelectorAll('.human-site a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target && !event.defaultPrevented) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start",
          });
        }
        if (target?.hasAttribute("tabindex")) target.focus({ preventScroll: true });
      });
    });

    document.querySelectorAll(".human-site [data-enquiry-service]").forEach((link) => {
      link.addEventListener("click", () => {
        if (serviceSelect && [...serviceSelect.options].some((option) => option.value === link.dataset.enquiryService)) {
          serviceSelect.value = link.dataset.enquiryService;
        }
      });
    });
  }

};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseNavigation, { once: true });
} else {
  initialiseNavigation();
}
