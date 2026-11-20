// Basic, opt-in analytics. No Google code, pings or event queue before consent.
(() => {
  const measurementId = "G-FTB362ESXH";
  // Earlier v1/v2 permissions are not migrated: this version needs fresh opt-in.
  const preferenceCookie = "hmt_analytics_v3";
  const analyticsEnabled = document.currentScript?.hasAttribute("data-analytics");
  const eventNames = new Set(["generate_lead", "phone_click", "whatsapp_click", "maths_mot_click"]);
  const parameterNames = new Set(["event_category", "link_location", "form_name", "page_path"]);
  const readChoice = () => {
    try {
      return document.cookie.split("; ")
        .find((cookie) => cookie.startsWith(`${preferenceCookie}=`))?.split("=")[1];
    } catch { return undefined; }
  };
  let choice = readChoice();
  let storageFailed = false;
  let initialised = false;
  let gtag;
  let lastFocus;
  let channel;

  const clearAnalyticsCookies = () => {
    const domains = ["", `; Domain=${location.hostname}`];
    if (location.hostname.endsWith(".hullmathstutor.co.uk")) domains.push("; Domain=hullmathstutor.co.uk");
    for (const name of ["_ga", "_ga_FTB362ESXH"]) {
      domains.forEach((domain) => {
        try { document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`; }
        catch { /* Blocked storage already leaves analytics disabled. */ }
      });
    }
  };

  const permitted = () => !storageFailed && choice === "allow" && readChoice() === "allow";
  window[`ga-disable-${measurementId}`] = !permitted();
  if (!permitted()) clearAnalyticsCookies();

  const safePage = () => `${location.origin}${location.pathname}`;
  const safeReferrer = () => {
    try { return document.referrer ? `${new URL(document.referrer).origin}/` : ""; }
    catch { return ""; }
  };
  const startAnalytics = () => {
    if (!analyticsEnabled || !permitted()) return;
    window[`ga-disable-${measurementId}`] = false;
    if (initialised) return;
    initialised = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag = function () { window.dataLayer.push(arguments); };
    gtag("consent", "default", {
      analytics_storage: "denied", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied",
    });
    gtag("set", "ads_data_redaction", true);
    gtag("set", "url_passthrough", false);
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: "none",
      cookie_expires: 0,
      page_location: safePage(),
      page_referrer: safeReferrer(),
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  };
  const stopAnalytics = () => {
    // Google's documented opt-out flag stops collection without discarding a
    // visitor's unfinished enquiry. Do not send denied/cookieless consent pings.
    window[`ga-disable-${measurementId}`] = true;
    clearAnalyticsCookies();
  };

  const settingsButtons = document.querySelectorAll("[data-privacy-settings]");
  const statuses = document.querySelectorAll("[data-privacy-state]");
  const updateStatus = () => {
    statuses.forEach((status) => {
      status.textContent = permitted() ? "Measurement: on" : "Measurement: off";
    });
  };
  const dialog = document.createElement("dialog");
  dialog.id = "privacy-settings";
  dialog.className = "privacy-dialog";
  dialog.setAttribute("aria-labelledby", "privacy-dialog-title");
  dialog.setAttribute("aria-describedby", "privacy-dialog-description");
  dialog.innerHTML = `
    <h2 id="privacy-dialog-title" tabindex="-1">Privacy choices</h2>
    <p id="privacy-dialog-description">Website analytics is optional. Forms and downloads work when it is off.</p>
    <div class="privacy-purposes">
      <label><input type="checkbox" data-privacy-purpose="analytics" /><span><strong>Website analytics</strong><span>Google Analytics measures visits and clicks using browser identifiers and cookies.</span></span></label>
    </div>
    <p>A first-party session cookie remembers your choice. Change it here any time.</p>
    <p><a href="/privacy/">Read the privacy and cookies notice</a></p>
    <div class="privacy-actions">
      <button type="button" data-privacy-choice="reject">Reject analytics</button>
      <button type="button" data-privacy-choice="save">Save choice</button>
    </div>
    <p class="privacy-feedback" role="status" aria-live="polite"></p>
    <button class="privacy-close" type="button">Close without changing</button>`;
  document.body.appendChild(dialog);
  const closeSettings = () => { dialog.close(); lastFocus?.focus({ preventScroll: true }); };
  const openSettings = (trigger) => {
    if (dialog.open) return;
    lastFocus = trigger;
    dialog.querySelector(".privacy-feedback").textContent = "";
    dialog.querySelector('[data-privacy-purpose="analytics"]').checked = permitted();
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector("h2").focus({ preventScroll: true });
  };
  dialog.querySelector(".privacy-close").addEventListener("click", closeSettings);
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeSettings(); });
  settingsButtons.forEach((button) => {
    button.hidden = false;
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", dialog.id);
    if (button.tagName === "A") {
      button.setAttribute("role", "button");
      button.addEventListener("keydown", (event) => {
        if (event.key === " ") { event.preventDefault(); openSettings(button); }
      });
    }
    button.addEventListener("click", (event) => { event.preventDefault(); openSettings(button); });
  });
  dialog.querySelectorAll("[data-privacy-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const analytics = dialog.querySelector('[data-privacy-purpose="analytics"]').checked;
      const next = button.dataset.privacyChoice === "save" && analytics ? "allow" : "reject";
      // A session cookie has no invented business-record retention period or ID.
      try { document.cookie = `${preferenceCookie}=${next}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; }
      catch { /* Keep analytics off when the preference cannot be recorded. */ }
      choice = readChoice();
      storageFailed = choice !== next;
      if (storageFailed) {
        stopAnalytics();
        dialog.querySelector(".privacy-feedback").textContent = "Your browser could not save the change, so optional measurement is off on this page. Clear this site's cookies to apply the choice across visits. The forms still work.";
        updateStatus();
        channel?.postMessage("reject");
        return;
      }
      if (permitted()) startAnalytics(); else stopAnalytics();
      updateStatus();
      // Also disables an already-open tab running the earlier two-purpose code.
      channel?.postMessage(permitted() ? "choice-changed" : "reject");
      closeSettings();
    });
  });
  const syncChoice = () => {
    choice = readChoice();
    if (permitted()) startAnalytics(); else stopAnalytics();
    updateStatus();
  };
  try {
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel("hmt-privacy");
      channel.addEventListener("message", (event) => {
        if (event.data === "reject") storageFailed = readChoice() !== "reject";
        syncChoice();
      });
    }
  } catch { /* Visibility/pageshow checks also synchronise the session cookie. */ }
  window.addEventListener("pageshow", syncChoice);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) syncChoice(); });
  window.HMTPrivacy = {
    track(name, params = {}) {
      if (!permitted() || !analyticsEnabled || !eventNames.has(name)) return;
      startAnalytics();
      const safeParams = Object.fromEntries(Object.entries(params).filter(([key]) => parameterNames.has(key)));
      gtag("event", name, { ...safeParams, page_location: safePage(), page_referrer: safeReferrer() });
    },
  };
  updateStatus();
  startAnalytics();
})();
