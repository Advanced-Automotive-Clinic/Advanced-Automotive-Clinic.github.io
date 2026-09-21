/* ============================================================================
 * main.js — renders the page from site.config.js
 *
 * You shouldn't need to edit this file to update the site. Everything that
 * changes lives in site.config.js.
 *
 * Design notes:
 *   - All config-supplied text is inserted with textContent, never innerHTML,
 *     so an apostrophe or an angle bracket in the config can't break the page.
 *   - Any section whose config is missing or empty hides itself, so a partly
 *     filled config still renders a clean page rather than empty headings.
 *   - Open/closed is computed in the SHOP's timezone, not the visitor's.
 * ========================================================================== */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG;
  if (!cfg) {
    console.error("[site] site.config.js did not load — nothing to render.");
    return;
  }

  var DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var DAY_LABELS = {
    mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
    fri: "Friday", sat: "Saturday", sun: "Sunday",
  };
  var DAY_SCHEMA = {
    mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
    fri: "Friday", sat: "Saturday", sun: "Sunday",
  };

  /* -- small helpers ------------------------------------------------------ */

  function $(sel, root) { return (root || document).querySelector(sel); }

  function field(name) { return document.querySelector('[data-field="' + name + '"]'); }

  function setText(name, value) {
    var el = field(name);
    if (el) el.textContent = value == null ? "" : String(value);
    return el;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  /* Builds an <svg> from a path spec. Icons are trusted, app-authored markup,
     so innerHTML is safe here — config values never reach this function. */
  function svg(paths, opts) {
    var o = opts || {};
    var node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    node.setAttribute("viewBox", o.viewBox || "0 0 24 24");
    node.setAttribute("fill", o.fill || "none");
    node.setAttribute("stroke", o.stroke || "currentColor");
    node.setAttribute("stroke-width", o.width || "2");
    node.setAttribute("stroke-linecap", "round");
    node.setAttribute("stroke-linejoin", "round");
    node.setAttribute("aria-hidden", "true");
    node.innerHTML = paths;
    return node;
  }

  /* Strips everything but digits so "(301) 782-7778" becomes a tel: href.
     Assumes a North American number when no country code is present. */
  function telHref(phone) {
    var digits = String(phone || "").replace(/\D/g, "");
    if (!digits) return null;
    if (digits.length === 10) digits = "1" + digits;
    return "tel:+" + digits;
  }

  function formatAddress(addr) {
    if (!addr) return "";
    var line2 = [addr.city, addr.state].filter(Boolean).join(", ");
    if (addr.zip) line2 = (line2 ? line2 + " " : "") + addr.zip;
    return [addr.street, line2].filter(Boolean).join(", ");
  }

  /* "08:30" -> "8:30am"; "13:00" -> "1:00pm"; "17:00" -> "5pm" is avoided,
     minutes are always shown so the column stays aligned. */
  function formatTime(hhmm) {
    var parts = String(hhmm).split(":");
    var h = parseInt(parts[0], 10);
    var m = parts[1] || "00";
    if (isNaN(h)) return String(hhmm);
    var suffix = h >= 12 ? "pm" : "am";
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ":" + m + suffix;
  }

  function toMinutes(hhmm) {
    var parts = String(hhmm).split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || "0", 10);
  }

  /* -- icons -------------------------------------------------------------- */

  /* Service icons.
   *
   * Paths are from Tabler Icons (https://tabler.io/icons) — MIT licensed,
   * Copyright (c) 2020-2024 Paweł Kuna. They're inlined rather than installed
   * so the site stays dependency-free: no npm, no build step, no CDN request.
   *
   * All are drawn on a 24x24 grid at stroke-width 2. To add one, copy the `d`
   * attributes out of the icon's .svg file and keep that convention.
   */
  var ICONS = {
    // A trace line, not a gauge. Brakes, steering, and tire are all circles
    // already — a fourth ring would be indistinguishable at a glance.
    diagnostic: '<path d="M3 12h4l3 8l4 -16l3 8h4"/>',
    brake:
      '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>' +
      '<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>' +
      '<path d="M7 12a5 5 0 0 1 5 -5"/><path d="M12 17a5 5 0 0 0 5 -5"/>',
    oil:
      '<path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 ' +
      '-5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 ' +
      '1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546z"/>',
    engine:
      '<path d="M3 10v6"/><path d="M12 5v3"/><path d="M10 5h4"/><path d="M5 13h-2"/>' +
      '<path d="M6 10h2l2 -2h3.382a1 1 0 0 1 .894 .553l1.448 2.894a1 1 0 0 0 .894 ' +
      '.553h1.382v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2v-2h-3v2a1 1 0 0 1 -1 ' +
      '1h-3.465a1 1 0 0 1 -.832 -.445l-1.703 -2.555h-2v-6z"/>',
    steering:
      '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>' +
      '<path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M12 14l0 7"/><path d="M10 12l-6.75 -2"/><path d="M14 12l6.75 -2"/>',
    ac:
      '<path d="M8 16a3 3 0 0 1 -3 3"/><path d="M16 16a3 3 0 0 0 3 3"/>' +
      '<path d="M12 16v4"/>' +
      '<path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/>' +
      '<path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3"/>',
    battery:
      '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/>' +
      '<path d="M6 5v-2"/><path d="M18 3v2"/><path d="M6.5 12h3"/>' +
      '<path d="M14.5 12h3"/><path d="M16 10.5v3"/>',
    tire:
      '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>' +
      '<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>' +
      '<path d="M3 12h6"/><path d="M15 12h6"/><path d="M13.6 9.4l3.4 -4.8"/>' +
      '<path d="M10.4 14.6l-3.4 4.8"/><path d="M7 4.6l3.4 4.8"/>' +
      '<path d="M13.6 14.6l3.4 4.8"/>',
    transmission:
      '<path d="M5 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M12 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M19 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M5 8l0 8"/><path d="M12 8l0 8"/>' +
      '<path d="M19 8v2a2 2 0 0 1 -2 2h-12"/>',
    // Tabler has no suspension icon, so this one stays hand-drawn: a coil
    // spring between two mounting plates.
    suspension:
      '<path d="M5 4h14M5 20h14"/><path d="M12 4v3M12 17v3"/>' +
      '<path d="M7 7h10l-10 5h10l-10 5h10"/>',
    inspection:
      '<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/>' +
      '<path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/>' +
      '<path d="M9 14l2 2l4 -4"/>',
    car:
      '<path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>' +
      '<path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"/>',
    wrench:
      '<path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"/>',
  };

  var STATUS_ICONS = {
    good:
      '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
    info:
      '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    warning:
      '<path d="M10.3 3.9L2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>' +
      '<path d="M12 9v4"/><path d="M12 17h.01"/>',
    closed:
      '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
  };


  /* == Timezone-aware "now" ================================================
   * Reads the wall-clock time in the shop's timezone, so a visitor in another
   * timezone still sees the shop's real open/closed state. Falls back to the
   * browser's local time if the timezone string is invalid.
   * ====================================================================== */
  function shopNow() {
    var tz = cfg.timezone;
    var now = new Date();
    if (!tz) return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };

    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(now);

      var got = {};
      parts.forEach(function (p) { got[p.type] = p.value; });

      var dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        .indexOf(got.weekday);
      // "24" is a legal hour12:false rendering of midnight in some engines.
      var hour = parseInt(got.hour, 10) % 24;

      if (dayIndex < 0 || isNaN(hour)) throw new Error("unparsable");

      return { day: dayIndex, minutes: hour * 60 + parseInt(got.minute, 10) };
    } catch (e) {
      console.warn('[site] timezone "' + tz + '" is not valid; using local time.');
      return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
    }
  }

  function openState() {
    var hours = cfg.hours;
    if (!hours) return null;

    var now = shopNow();
    var todayKey = DAYS[now.day];
    var today = hours[todayKey];

    if (today && today.length === 2) {
      var start = toMinutes(today[0]);
      var end = toMinutes(today[1]);
      if (now.minutes >= start && now.minutes < end) {
        return { open: true, text: "Open now · until " + formatTime(today[1]) };
      }
      if (now.minutes < start) {
        return { open: false, text: "Closed · opens today at " + formatTime(today[0]) };
      }
    }

    // Walk forward to the next day that has hours.
    for (var i = 1; i <= 7; i++) {
      var key = DAYS[(now.day + i) % 7];
      var slot = hours[key];
      if (slot && slot.length === 2) {
        var when = i === 1 ? "tomorrow" : DAY_LABELS[key];
        return {
          open: false,
          text: "Closed · opens " + when + " at " + formatTime(slot[0]),
        };
      }
    }
    return { open: false, text: "Closed" };
  }


  /* == 1. Status banner ==================================================== */
  function renderStatus() {
    var mount = document.getElementById("status-banner");
    var s = cfg.status;
    if (!mount) return;

    mount.textContent = "";
    document.body.removeAttribute("data-status-level");

    if (!s || !s.active || !s.title) return;

    var level = STATUS_ICONS[s.level] ? s.level : "info";
    document.body.setAttribute("data-status-level", level);

    var wrap = el("div", "status");
    wrap.setAttribute("data-level", level);

    var inner = el("div", "shell status__inner");

    var icon = svg(STATUS_ICONS[level], { width: "2" });
    icon.setAttribute("class", "status__icon");
    inner.appendChild(icon);

    var body = el("div", "status__body");
    body.appendChild(el("p", "status__title", s.title));
    if (s.message) body.appendChild(el("p", "status__message", s.message));

    if (s.until) {
      var label = formatUntil(s.until);
      if (label) body.appendChild(el("p", "status__until", label));
    }

    inner.appendChild(body);
    wrap.appendChild(inner);
    mount.appendChild(wrap);
  }

  /* "2026-10-31" -> "Through Oct 31". Parsed as a plain date, not a UTC
     instant, so it can't shift a day backwards west of Greenwich. */
  function formatUntil(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    if (isNaN(d.getTime())) return null;
    return "Through " + d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }


  /* == 2. Header, hero, footer ============================================ */
  function renderIdentity() {
    var shop = cfg.shop || {};
    var addr = shop.address || {};
    var tel = telHref(shop.phone);

    document.title = shop.name
      ? shop.name + " — Auto Repair" + (addr.city ? " in " + addr.city : "")
      : document.title;

    setText("shop-name", shop.name || "");
    setText("hero-name", shop.name || "");
    setText("hero-tagline", shop.tagline || "");

    var eyebrow = [addr.city, addr.state].filter(Boolean).join(", ");
    var eyebrowEl = setText("hero-location", eyebrow);
    if (eyebrowEl && !eyebrow) eyebrowEl.hidden = true;

    renderLogo(shop);

    // Header phone: a tel: link on touch devices, a jump to the location
    // section on desktop where "call" isn't an action the device can take.
    var headerPhone = field("header-phone");
    if (headerPhone) {
      if (shop.phone && tel) {
        headerPhone.href = tel;
        headerPhone.setAttribute("aria-label", "Call " + shop.phone);
        setText("header-phone-text", shop.phone);
      } else {
        headerPhone.hidden = true;
      }
    }

    // Footer. Deliberately does NOT restate the address and phone: the
    // "Find us" block sits directly above it with the same details in
    // clickable form, so repeating them here was noise. That convention
    // belongs to multi-page sites, where the footer is the global fallback.
    setText("footer-name", shop.name || "");
    setText(
      "footer-legal",
      "© " + new Date().getFullYear() +
      " · Hours and availability are subject to change — please call to confirm."
    );
  }


  /* == 2b. Header logo =====================================================
   * When a logo image is configured it replaces the car icon and the text
   * name visually. The text name stays in the DOM as .sr-only so the link
   * still has an accessible name and the markup still says who this is even
   * if the image fails to load.
   * ====================================================================== */
  function renderLogo() {
    var img = field("brand-logo");
    var mark = document.querySelector(".brand__mark");
    var text = field("shop-name");
    var src = (cfg.images && cfg.images.logo) || "";

    if (!img) return;
    if (!src) { img.hidden = true; return; }

    img.src = src;
    img.alt = "";                        // decorative: the text name carries it
    img.hidden = false;
    if (mark) mark.hidden = true;
    if (text) text.classList.add("sr-only");
  }


  /* == 2c. Hero photo ======================================================
   * Builds a srcset from images.hero so the browser downloads the smallest
   * file that suits the screen rather than the full-size one every time.
   * ====================================================================== */
  function renderHeroImage() {
    var mount = field("hero-media");
    var h = cfg.images && cfg.images.hero;
    if (!mount) return;

    if (!h || !h.base || !h.widths || !h.widths.length) {
      mount.hidden = true;
      document.body.removeAttribute("data-hero-media");
      return;
    }

    var ext = h.ext || "jpg";
    var widths = h.widths.slice().sort(function (a, b) { return a - b; });
    var largest = widths[widths.length - 1];

    var img = document.createElement("img");
    img.src = h.base + "-" + largest + "." + ext;
    img.srcset = widths.map(function (w) {
      return h.base + "-" + w + "." + ext + " " + w + "w";
    }).join(", ");
    // Two-column above 900px, full width below it.
    img.sizes = "(min-width: 900px) 46vw, 100vw";
    img.alt = h.alt || "";
    img.width = largest;
    img.height = Math.round(largest * 2 / 3);
    // Above the fold: load it immediately rather than lazily.
    img.loading = "eager";
    img.decoding = "async";
    img.setAttribute("fetchpriority", "high");

    mount.textContent = "";
    mount.appendChild(img);
    mount.hidden = false;
    document.body.setAttribute("data-hero-media", "");
  }


  /* == 3. Open/closed pill ================================================= */
  function renderOpenPill() {
    var pill = field("open-pill");
    if (!pill) return;

    var state = openState();
    if (!state) { pill.hidden = true; return; }

    pill.hidden = false;
    pill.setAttribute("data-open", String(state.open));
    setText("open-pill-text", state.text);
  }


  /* == 4. Services ========================================================= */
  function renderServices() {
    var section = document.querySelector('[data-section="services"]');
    var list = field("services");
    var items = cfg.services || [];
    if (!section || !list) return;

    if (!items.length) { section.hidden = true; return; }
    section.hidden = false;
    list.textContent = "";

    items.forEach(function (item) {
      if (!item || !item.name) return;

      var li = el("li", "service-card");

      var iconWrap = el("div", "service-card__icon");
      iconWrap.appendChild(svg(ICONS[item.icon] || ICONS.wrench));
      li.appendChild(iconWrap);

      li.appendChild(el("h3", "service-card__name", item.name));
      if (item.description) {
        li.appendChild(el("p", "service-card__desc", item.description));
      }
      list.appendChild(li);
    });
  }


  /* == 5. About ============================================================ */
  function renderAbout() {
    var section = document.querySelector('[data-section="about"]');
    var about = cfg.about;
    if (!section) return;

    if (!about || (!about.body && !about.stats)) { section.hidden = true; return; }
    section.hidden = false;

    setText("about-heading", about.heading || "");

    var bodyMount = field("about-body");
    if (bodyMount) {
      bodyMount.textContent = "";
      var paras = Array.isArray(about.body) ? about.body : [about.body];
      paras.filter(Boolean).forEach(function (text) {
        bodyMount.appendChild(el("p", null, text));
      });
    }

    var statMount = field("about-stats");
    if (statMount) {
      statMount.textContent = "";
      var stats = about.stats || [];
      if (!stats.length) {
        statMount.hidden = true;
      } else {
        statMount.hidden = false;
        stats.forEach(function (stat) {
          if (!stat || stat.value == null) return;
          var li = el("li", "stat");
          li.appendChild(el("span", "stat__value", stat.value));
          if (stat.label) li.appendChild(el("span", "stat__label", stat.label));
          statMount.appendChild(li);
        });
      }
    }
  }


  /* == 6. Hours table ====================================================== */
  function renderHours() {
    var mount = field("hours");
    var hours = cfg.hours;
    if (!mount) return;

    mount.textContent = "";
    if (!hours) return;

    var todayKey = DAYS[shopNow().day];
    var order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    order.forEach(function (key) {
      if (!(key in hours)) return;
      var slot = hours[key];

      var tr = el("tr");
      if (key === todayKey) {
        tr.setAttribute("data-today", "");
        tr.setAttribute("aria-current", "date");
      }

      tr.appendChild(el("td", "hours-day", DAY_LABELS[key]));

      var td = el("td", "hours-time");
      if (slot && slot.length === 2) {
        td.textContent = formatTime(slot[0]) + " – " + formatTime(slot[1]);
      } else {
        td.textContent = "Closed";
        td.classList.add("hours-closed");
      }
      tr.appendChild(td);
      mount.appendChild(tr);
    });

    var note = "Closed on major holidays. Call ahead if you're coming near closing time.";
    setText("hours-note", note);
  }


  /* == 7. Contact & map ==================================================== */
  function renderLocation() {
    var shop = cfg.shop || {};
    var addr = shop.address || {};
    var mount = field("contact");

    if (mount) {
      mount.textContent = "";

      var fullAddress = formatAddress(addr);
      if (fullAddress) {
        var row = el("div", "contact__row");
        var pin = svg(
          '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>' +
          '<circle cx="12" cy="10" r="3"/>'
        );
        pin.setAttribute("class", "contact__icon");
        row.appendChild(pin);

        var link = el("a", null, fullAddress);
        link.href = "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(fullAddress);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        row.appendChild(link);
        mount.appendChild(row);
      }

      if (shop.phone) {
        var phoneRow = el("div", "contact__row");
        var phoneIcon = svg(
          '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'
        );
        phoneIcon.setAttribute("class", "contact__icon");
        phoneRow.appendChild(phoneIcon);

        var phoneLink = el("a", null, shop.phone);
        phoneLink.href = telHref(shop.phone);
        phoneRow.appendChild(phoneLink);
        mount.appendChild(phoneRow);
      }

      if (shop.email) {
        var emailRow = el("div", "contact__row");
        var mailIcon = svg(
          '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/>' +
          '<path d="M3 6.5l9 6 9-6"/>'
        );
        mailIcon.setAttribute("class", "contact__icon");
        emailRow.appendChild(mailIcon);

        var emailLink = el("a", null, shop.email);
        emailLink.href = "mailto:" + shop.email;
        emailRow.appendChild(emailLink);
        mount.appendChild(emailRow);
      }
    }

    var mapMount = field("map");
    if (mapMount) {
      if (shop.mapEmbedUrl) {
        mapMount.hidden = false;
        mapMount.textContent = "";
        var frame = document.createElement("iframe");
        frame.src = shop.mapEmbedUrl;
        frame.loading = "lazy";
        frame.referrerPolicy = "no-referrer-when-downgrade";
        frame.title = "Map showing the location of " + (shop.name || "the shop");
        mapMount.appendChild(frame);
      } else {
        mapMount.hidden = true;
      }
    }
  }


  /* == 8. LocalBusiness structured data ====================================
   * Gives search engines the shop's name, address, phone, and hours in a
   * machine-readable form, built from the same config as the visible page.
   * ====================================================================== */
  function renderSchema() {
    var shop = cfg.shop || {};
    if (!shop.name) return;

    var addr = shop.address || {};
    var data = {
      "@context": "https://schema.org",
      "@type": "AutoRepair",
      name: shop.name,
      description: shop.tagline || undefined,
      telephone: shop.phone || undefined,
      email: shop.email || undefined,
      url: window.location.origin + window.location.pathname,
    };

    if (addr.street || addr.city) {
      data.address = {
        "@type": "PostalAddress",
        streetAddress: addr.street || undefined,
        addressLocality: addr.city || undefined,
        addressRegion: addr.state || undefined,
        postalCode: addr.zip || undefined,
        addressCountry: "US",
      };
    }

    if (cfg.hours) {
      var spec = [];
      Object.keys(cfg.hours).forEach(function (key) {
        var slot = cfg.hours[key];
        if (!slot || slot.length !== 2 || !DAY_SCHEMA[key]) return;
        spec.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "https://schema.org/" + DAY_SCHEMA[key],
          opens: slot[0],
          closes: slot[1],
        });
      });
      if (spec.length) data.openingHoursSpecification = spec;
    }

    if (cfg.services && cfg.services.length) {
      data.makesOffer = cfg.services
        .filter(function (s) { return s && s.name; })
        .map(function (s) {
          return {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name },
          };
        });
    }

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }


  /* == 9. Sticky header shadow ============================================ */
  function bindHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    var ticking = false;
    function update() {
      if (window.scrollY > 8) header.setAttribute("data-scrolled", "");
      else header.removeAttribute("data-scrolled");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }


  /* == Boot ================================================================ */
  function render() {
    renderStatus();
    renderIdentity();
    renderHeroImage();
    renderOpenPill();
    renderServices();
    renderAbout();
    renderHours();
    renderLocation();
  }

  render();
  renderSchema();
  bindHeader();

  // Keep the open/closed pill honest without a reload, and roll the hours
  // table over to the next day at midnight.
  setInterval(function () {
    renderOpenPill();
    renderHours();
  }, 60 * 1000);
})();
