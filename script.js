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

const enquiryForm = document.querySelector(".enquiry-form");
const appointmentPicker = document.querySelector("[data-appointment-picker]");

let resetAppointmentPicker = () => {};

if (appointmentPicker) {
  const dateList = appointmentPicker.querySelector("[data-appointment-dates]");
  const timeList = appointmentPicker.querySelector("[data-appointment-times]");
  const dateLabel = appointmentPicker.querySelector(
    "[data-appointment-date-label]",
  );
  const appointmentInput = appointmentPicker.querySelector(
    "[data-appointment-value]",
  );
  const appointmentDateInput = appointmentPicker.querySelector(
    "[data-appointment-date]",
  );
  const appointmentTimeInput = appointmentPicker.querySelector(
    "[data-appointment-time]",
  );
  const appointmentFeedback = appointmentPicker.querySelector(
    "[data-appointment-feedback]",
  );

  const weekdaySlots = ["4:00pm", "5:30pm", "7:00pm"];
  const saturdaySlots = ["9:30am", "11:00am"];
  const sundaySlots = ["10:00am"];
  const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const longDateFormatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const getSlotsForDate = (date) => {
    const day = date.getDay();

    if (day === 6) {
      return saturdaySlots;
    }

    if (day === 0) {
      return sundaySlots;
    }

    return weekdaySlots;
  };

  const toIsoDate = (date) => {
    const yearValue = date.getFullYear();
    const monthValue = String(date.getMonth() + 1).padStart(2, "0");
    const dayValue = String(date.getDate()).padStart(2, "0");
    return `${yearValue}-${monthValue}-${dayValue}`;
  };

  const dateOptions = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);

    return {
      date,
      iso: toIsoDate(date),
      label: longDateFormatter.format(date),
      shortParts: shortDateFormatter.formatToParts(date),
      slots: getSlotsForDate(date),
    };
  });

  let selectedDate = null;
  let selectedTime = "";

  const updateAppointmentFields = () => {
    const appointmentValue =
      selectedDate && selectedTime
        ? `${selectedDate.label} at ${selectedTime}`
        : "";

    appointmentInput.value = appointmentValue;
    appointmentDateInput.value = selectedDate?.label || "";
    appointmentTimeInput.value = selectedTime;

    if (!appointmentFeedback) {
      return;
    }

    appointmentFeedback.classList.remove("is-error");
    appointmentFeedback.textContent = appointmentValue
      ? `Selected Maths MOT: ${appointmentValue}.`
      : "No appointment selected yet.";
  };

  const renderDateButtons = () => {
    dateList.innerHTML = "";

    dateOptions.forEach((option) => {
      const dayName =
        option.shortParts.find((part) => part.type === "weekday")?.value || "";
      const dayNumber =
        option.shortParts.find((part) => part.type === "day")?.value || "";
      const monthName =
        option.shortParts.find((part) => part.type === "month")?.value || "";
      const button = document.createElement("button");
      const isSelected = selectedDate?.iso === option.iso;

      button.type = "button";
      button.className = "appointment-date-button";
      button.dataset.date = option.iso;
      button.setAttribute("aria-pressed", String(isSelected));
      button.setAttribute("aria-label", option.label);
      button.innerHTML = `
        <span class="appointment-date-day">${dayName}</span>
        <span class="appointment-date-number">${dayNumber}</span>
        <span class="appointment-date-month">${monthName}</span>
      `;

      if (isSelected) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        selectedDate = option;
        selectedTime = "";
        renderDateButtons();
        renderTimeButtons();
        updateAppointmentFields();
      });

      dateList.append(button);
    });
  };

  const renderTimeButtons = () => {
    timeList.innerHTML = "";

    if (!selectedDate) {
      dateLabel.textContent = "Select a date to see available times.";
      return;
    }

    dateLabel.textContent = `Available times for ${selectedDate.label}`;

    selectedDate.slots.forEach((slot) => {
      const button = document.createElement("button");
      const isSelected = selectedTime === slot;

      button.type = "button";
      button.className = "appointment-time-button";
      button.dataset.time = slot;
      button.setAttribute("aria-pressed", String(isSelected));
      button.textContent = slot;

      if (isSelected) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        selectedTime = slot;
        renderTimeButtons();
        updateAppointmentFields();
      });

      timeList.append(button);
    });
  };

  resetAppointmentPicker = () => {
    selectedDate = null;
    selectedTime = "";
    renderDateButtons();
    renderTimeButtons();
    updateAppointmentFields();
  };

  resetAppointmentPicker();
}

if (enquiryForm) {
  const formStatus = enquiryForm.querySelector("[data-form-status]");
  const submitButton = enquiryForm.querySelector("[type='submit']");
  const submitLabel = enquiryForm.querySelector("[data-submit-label]");
  const submitSpinner = enquiryForm.querySelector("[data-submit-spinner]");
  const subjectInput = enquiryForm.querySelector("[data-subject-field]");
  const parentNameInput = enquiryForm.querySelector("[name='parent-name']");
  const studentYearGroupInput = enquiryForm.querySelector(
    "[name='student-year-group']",
  );
  const parentEmailInput = enquiryForm.querySelector("input[name='email']");
  const replyToInput = enquiryForm.querySelector("[data-reply-to]");
  const appointmentInput = enquiryForm.querySelector("[data-appointment-value]");
  const appointmentFeedback = enquiryForm.querySelector(
    "[data-appointment-feedback]",
  );
  const defaultSubmitText =
    submitLabel?.textContent || submitButton?.textContent || "Book the Maths MOT";

  const setFormStatus = (message, isError = false) => {
    if (!formStatus) {
      return;
    }

    formStatus.hidden = false;
    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", isError);
  };

  const setSubmitState = (isSending) => {
    if (!submitButton) {
      return;
    }

    submitButton.disabled = isSending;
    submitButton.setAttribute("aria-busy", String(isSending));

    if (submitLabel) {
      submitLabel.textContent = isSending
        ? " Sending Maths MOT request..."
        : defaultSubmitText;
    } else {
      submitButton.textContent = isSending
        ? "Sending Maths MOT request..."
        : defaultSubmitText;
    }

    if (submitSpinner) {
      submitSpinner.hidden = !isSending;
    }
  };

  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!appointmentInput?.value) {
      appointmentFeedback?.classList.add("is-error");

      if (appointmentFeedback) {
        appointmentFeedback.textContent =
          "Please choose a Maths MOT date and time before booking.";
      }

      appointmentPicker?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
      return;
    }

    if (!enquiryForm.checkValidity()) {
      enquiryForm.reportValidity();
      return;
    }

    if (replyToInput && parentEmailInput) {
      replyToInput.value = parentEmailInput.value.trim();
    }

    if (subjectInput && parentNameInput && studentYearGroupInput) {
      const parentName = parentNameInput.value.trim();
      const studentYearGroup = studentYearGroupInput.value.trim();
      subjectInput.value = `New Maths MOT Booking \u2013 ${parentName} (${studentYearGroup})`;
    }

    const formData = new FormData(enquiryForm);

    setSubmitState(true);

    if (formStatus) {
      formStatus.hidden = true;
      formStatus.classList.remove("is-error");
    }

    try {
      const response = await fetch(enquiryForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Form submission failed.");
      }

      enquiryForm.reset();
      resetAppointmentPicker();
      setFormStatus(
        "Thank you. Your Maths MOT request has been received. I'll personally review your enquiry and get back to you shortly to confirm your appointment.",
      );
    } catch (error) {
      setFormStatus(
        "Sorry, something went wrong. Please try again or contact me directly via WhatsApp.",
        true,
      );
    } finally {
      setSubmitState(false);
    }
  });
}
