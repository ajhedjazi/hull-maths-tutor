const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const header = document.querySelector(".site-header");
const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const year = document.querySelector("#copyright-year");
const mobileCta = document.querySelector("[data-mobile-cta]");
const floatingActions = document.querySelector("[data-floating-actions]");
const backToTopButton = document.querySelector("[data-back-to-top]");
const enquirySection = document.querySelector("#enquire");

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

const toggleFloatingControls = () => {
  if (mobileCta) {
    const enquiryBounds = enquirySection?.getBoundingClientRect();
    const enquiryIsVisible = enquiryBounds
      ? enquiryBounds.top < window.innerHeight && enquiryBounds.bottom > 0
      : false;
    const showMobileCta = window.scrollY > 140 && !enquiryIsVisible;
    mobileCta.hidden = !showMobileCta;
    mobileCta.inert = !showMobileCta;
  }

  if (floatingActions) {
    const showFloatingActions = window.scrollY >= 450;
    floatingActions.classList.toggle("is-visible", showFloatingActions);
    floatingActions.setAttribute(
      "aria-hidden",
      String(!showFloatingActions),
    );
    floatingActions.inert = !showFloatingActions;
  }
};

window.addEventListener("scroll", toggleFloatingControls, { passive: true });
toggleFloatingControls();

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
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
    },
  );

  navTargets.forEach(({ target }) => navObserver.observe(target));
}

const availabilityPicker = document.querySelector(
  "[data-availability-picker]",
);

if (availabilityPicker) {
  const dayButtons = Array.from(
    availabilityPicker.querySelectorAll("[data-day]"),
  );
  const timeButtons = Array.from(
    availabilityPicker.querySelectorAll("[data-time]"),
  );
  const selectedTimesInput = availabilityPicker.querySelector(
    "#selected_times",
  );
  const selectedTimesSummary = availabilityPicker.querySelector(
    "#selected-times-summary",
  );
  const timePickerLabel = availabilityPicker.querySelector(
    "#time-picker-label",
  );
  const selectedTimes = new Set();
  let activeDay = dayButtons[0]?.dataset.day || "Monday";

  const getSelectionValue = (time) => `${activeDay} ${time}`;

  const updateAvailabilityPicker = () => {
    dayButtons.forEach((button) => {
      const isActive = button.dataset.day === activeDay;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    timeButtons.forEach((button) => {
      const isSelected = selectedTimes.has(
        getSelectionValue(button.dataset.time),
      );
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    const selections = Array.from(selectedTimes);
    selectedTimesInput.value = selections.join(", ");
    selectedTimesSummary.textContent = selections.length
      ? selections.join(", ")
      : "None selected yet.";
    timePickerLabel.textContent = `Times for ${activeDay}`;
  };

  dayButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activeDay = button.dataset.day;
      updateAvailabilityPicker();
    });

    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();
      let nextIndex = index;

      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + dayButtons.length) % dayButtons.length;
      } else if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % dayButtons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = dayButtons.length - 1;
      }

      dayButtons[nextIndex].focus();
      dayButtons[nextIndex].click();
    });
  });

  timeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selection = getSelectionValue(button.dataset.time);

      if (selectedTimes.has(selection)) {
        selectedTimes.delete(selection);
      } else {
        selectedTimes.add(selection);
      }

      updateAvailabilityPicker();
    });
  });

  updateAvailabilityPicker();
}
