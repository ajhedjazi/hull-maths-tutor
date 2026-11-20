// The tiny head marker sets the initial layout; this script remains deferred.
// Its script error handler (or JS being off) leaves the full navigation available.
document.documentElement.classList.add("hmt-nav");

const initialiseNavigation = () => {
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
