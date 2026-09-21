/* ============================================================================
 * SITE CONFIGURATION
 * ----------------------------------------------------------------------------
 * This is the only file you need to edit to update the website.
 * Change a value, save, and redeploy. No build step, no tooling.
 *
 * Every value marked "TODO: replace" is placeholder content.
 * ========================================================================== */

window.SITE_CONFIG = {

  /* ==========================================================================
   * 1. STATUS NOTICE
   * --------------------------------------------------------------------------
   * The banner at the very top of the page. This is the thing you'll change
   * most often, so it lives first.
   *
   *   active   true shows the banner, false hides it completely.
   *   level    Controls the color and icon. One of:
   *              "good"     green   — e.g. "Walk-ins welcome"
   *              "info"     blue    — e.g. "New Saturday hours"
   *              "warning"  amber   — e.g. "Not accepting new customers"
   *              "closed"   red     — e.g. "Closed for the holidays"
   *   title    Short headline. Keep it under ~50 characters.
   *   message  One or two sentences of detail. Optional.
   *   until    Optional end date, "YYYY-MM-DD". Renders as "Through Oct 31".
   *            Delete this line if it doesn't apply.
   * ======================================================================== */
  status: {
    active: true,
    level: "info",
    title: "Referral-only shop",
    message:
      "We operate exclusively on a referral basis. All services require a referral from a vetted and verified individual who is already part of our network."
  },


  /* ==========================================================================
   * 2. SHOP DETAILS                                    TODO: replace all below
   * ======================================================================== */
  shop: {
    name: "Advanced Automotive Clinic",
    tagline: "Bring it in sick, drive it home well",
    phone: "(301) 782-7778",
    email: "aac14806@gmail.com",
    address: {
      street: "14806 Crain Hwy",
      city: "Brandywine",
      state: "MD",
      zip: "20613",
    },

    // Google Maps embed URL. To get yours: open Google Maps → find your shop →
    // Share → Embed a map → copy the src="..." value out of the iframe.
    // Leave as an empty string to hide the map entirely.
    mapEmbedUrl:
      "https://www.google.com/maps?q=14806+Crain+Hwy+Brandywine+MD+20613&output=embed",
  },


  /* ==========================================================================
   * 3. IMAGES
   * --------------------------------------------------------------------------
   * All files live in assets/.
   * ======================================================================== */
  images: {
    // Header logo. The shop name still renders as real text for screen
    // readers and search engines — the image just replaces it visually.
    // Set to "" to show the shop name as plain text instead.
    logo: "assets/logo-wordmark.png",

    // The photo beside the shop name, above the fold.
    // Set `hero: null` to remove it and go back to a text-only hero.
    //
    // Files are named <base>-<width>.<ext>, and the browser picks the
    // smallest one that fits the visitor's screen — a phone downloads the
    // 480px file, not the full-size one.
    hero: {
      base: "assets/shopfront",
      widths: [480, 768, 960],
      ext: "jpg",
      // Describes the photo for screen readers and for when it fails to load.
      alt: "The Advanced Automotive Clinic shop front on Crain Highway, " +
        "with cars parked in the lot outside the service bays.",
    },
  },


  /* ==========================================================================
   * 4. HOURS                                              TODO: replace below
   * --------------------------------------------------------------------------
   * Drives both the hours table AND the live "Open now / Closed" indicator.
   *
   * Format: ["HH:MM", "HH:MM"] in 24-hour time. Use null for a closed day.
   * ======================================================================== */
  timezone: "America/New_York",
  hours: {
    mon: ["08:30", "23:30"],
    tue: ["08:30", "23:30"],
    wed: ["08:30", "23:30"],
    thu: ["08:30", "23:30"],
    fri: ["08:30", "18:00"],
    sat: ["08:30", "13:00"],
    sun: null,
  },


  /* ==========================================================================
   * 5. SERVICES                                           TODO: replace below
   * --------------------------------------------------------------------------
   * Add or remove entries freely — the grid reflows on its own.
   *
   * icon: one of "engine", "brake", "oil", "battery", "tire", "diagnostic",
   *       "ac", "transmission", "suspension", "steering", "inspection".
   *       An unknown name falls back to a generic wrench icon.
   * ======================================================================== */
  services: [
    {
      name: "Diagnostics",
      icon: "diagnostic",
      description:
        "Check-engine lights, intermittent faults, and electrical gremlins. " +
        "We read the codes, then actually trace the cause.",
    },
    {
      name: "Brakes",
      icon: "brake",
      description:
        "Pads, rotors, calipers, lines, and fluid service. Full inspection " +
        "with measurements before we quote anything.",
    },
    {
      name: "Oil & Routine Maintenance",
      icon: "oil",
      description:
        "Conventional and synthetic oil changes, filters, fluids, belts, and " +
        "manufacturer-scheduled service intervals.",
    },
    {
      name: "Engine Repair",
      icon: "engine",
      description:
        "Timing components, head gaskets, cooling systems, and driveability " +
        "problems on both domestic and import engines.",
    },
    {
      name: "Suspension & Steering",
      icon: "steering",
      description:
        "Struts, shocks, control arms, bushings, wheel bearings, and " +
        "alignment-related handling complaints.",
    },
    {
      name: "Heating & A/C",
      icon: "ac",
      description:
        "Compressor and condenser service, leak detection, evacuate and " +
        "recharge, blend door and blower motor repair.",
    },
    {
      name: "Batteries & Charging",
      icon: "battery",
      description:
        "Battery testing and replacement, alternators, starters, and parasitic " +
        "draw diagnosis on vehicles that won't stay charged.",
    },
    {
      name: "MD State Safety Inspection Repairs",
      icon: "inspection",
      description:
        "Repairs to bring your vehicle up to Maryland state safety inspection " +
        "standards, including work on items flagged for re-inspection.",
    },
  ],


  /* ==========================================================================
   * 6. ABOUT                                              TODO: replace below
   * --------------------------------------------------------------------------
   * Delete this whole block to remove the About section from the page.
   * ======================================================================== */
  about: {
    // TODO: replace this copy and these numbers with your real details.
    heading: "A small shop that does the work itself",
    body: [
      "We're an independent shop on Crain Highway in Brandywine. The people " +
      "who look at your car are the same people who'll explain what they found.",
      "We don't work on commission and we don't sell service you don't need. " +
      "If something can wait, we'll tell you it can wait.",
    ],
    stats: [
      { value: "20+", label: "Years in business" },
      { value: "3", label: "Certified technicians" },
      { value: "6-12mo", label: "Parts & labor warranty" },
      { value: "4.8", label: "Average review rating" },
    ],
  },
};
