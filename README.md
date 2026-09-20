# Advanced Automotive Clinic — website

A single-page, information-only site. No build step, no dependencies, no framework.
Open `index.html` in a browser and it works.

The page is **light theme only** by design — it looks the same to every visitor
regardless of their device's dark-mode setting.

---

## The thing you'll do most often: change the status notice

Open **`site.config.js`**. The status block is the first thing in the file.

```js
status: {
  active: true,
  level: "warning",
  title: "Not accepting new customers",
  message: "We're booked to capacity and are pausing new intake.",
  until: "2026-10-31",
},
```

| Field     | What it does                                                          |
|-----------|-----------------------------------------------------------------------|
| `active`  | `true` shows the banner, `false` hides it completely.                 |
| `level`   | Controls color and icon — see below.                                  |
| `title`   | The headline. Keep it short, under ~50 characters.                    |
| `message` | A sentence or two of detail. Optional — delete the line to omit it.   |
| `until`   | Optional end date, `"YYYY-MM-DD"`. Shows as "Through Oct 31".         |

### The four levels

| `level`     | Color | Use it for                                          |
|-------------|-------|-----------------------------------------------------|
| `"good"`    | Green | "Walk-ins welcome", "Back to normal hours"          |
| `"info"`    | Blue  | "New Saturday hours", "We've moved bays"            |
| `"warning"` | Amber | "Not accepting new customers", "2-week backlog"     |
| `"closed"`  | Red   | "Closed for the holidays", "Closed — burst pipe"    |

**To turn the banner off entirely**, set `active: false`. The banner disappears
cleanly; nothing shifts or leaves a gap.

---

## Everything else you can change

All of it is in `site.config.js`, in numbered sections:

1. **Status notice** — above.
2. **Shop details** — name, tagline, phone, email, address, map.
3. **Images** — the header logo and the hero photo.
4. **Hours** — drives both the hours table and the live "Open now" indicator.
5. **Services** — add or remove freely; the grid reflows on its own.
6. **About** — the blurb and the four stat tiles. Delete the block to hide the section.
7. **Updates** — the dated announcement list. Set to `[]` to hide the section.

Sections with no content hide themselves, so you can't end up with an empty heading.

### Hours format

```js
timezone: "America/New_York",   // Maryland. Handles EST/EDT automatically.
hours: {
  mon: ["08:30", "18:00"],      // 24-hour time
  sun: null,                    // null = closed that day
},
```

The "Open now / Closed" pill is computed in **your** timezone, not the visitor's —
someone browsing from California still sees your real open/closed state.

### Images

```js
images: {
  logo: "assets/logo-wordmark.png",
  hero: { base: "assets/shopfront", widths: [480, 768, 960], ext: "jpg", alt: "..." },
},
```

**Header logo** — `assets/logo-wordmark.png`, cropped from your logo scan with the
white paper background removed so it sits on the page rather than in a white box.
The tagline line is deliberately cropped off: at header size it was unreadable, and
the tagline already appears under the shop name in the hero. Set `logo: ""` to fall
back to the plain text name.

The shop name still renders as real text behind the logo (visually hidden), so
screen readers and search engines read a name rather than an image.

**Hero photo** — files are named `<base>-<width>.<ext>`. The browser downloads the
smallest one that suits the screen: a phone pulls the 480px / 32 KB file, not the
full-size one. To swap the photo, drop in new files at those three widths and keep
the naming. Set `hero: null` to remove the photo and go back to a text-only hero.

**Tab icon** — `assets/favicon.png` (plus `apple-touch-icon.png` for iOS home
screens). Both are cut from the logo: the red **"A"** and its speed lines. The full
lockup can't work here — it's three stacked lines of text, so at 16×16 it renders as
a grey smudge and disappears entirely on a dark browser tab. The "A" is the one
fragment that stays recognisable that small, and its red reads on both light and
dark tabs. The car graphic would have been the other candidate, but in the artwork
it's interleaved with the letters of "Automotive" and can't be lifted out cleanly.

The iOS icon sits on a white tile because iOS ignores transparency and would
otherwise composite the artwork onto black.

**Originals** — `assets/logo-source.jpg` and `assets/shopfront-source.jpg` are your
untouched uploads, kept so the derived files can be regenerated. Nothing references
them; they're just the masters.

### Service icons

Each service takes an `icon` name. Available: `engine`, `brake`, `oil`, `battery`,
`tire`, `diagnostic`, `ac`, `transmission`, `suspension`, `steering`,
`inspection`, `car`. Anything unrecognized falls back to a wrench.

The icons come from [Tabler Icons](https://tabler.io/icons) (MIT licensed,
© 2020-2024 Paweł Kuna). They are **pasted inline** into `main.js` rather than
installed as a package — so there's still no npm, no build step, and no request
to a CDN. To add one: find it on tabler.io, open its `.svg`, and copy the `d`
attributes into the `ICONS` object in `main.js`, following the existing pattern.

### The map

`shop.mapEmbedUrl` takes a Google Maps embed URL. To get yours: open Google Maps,
find the shop, **Share → Embed a map**, and copy the `src="..."` value out of the
iframe it gives you. Set it to `""` to hide the map.

---

## Two places that are NOT in the config

Because the page renders with JavaScript, a couple of things have to be written
directly into `index.html` so that search engines and no-JavaScript visitors still
see them. **If you change the shop name, phone, address, or hours, update these too:**

1. The `<title>` and `<meta name="description">` tags at the top of `index.html`.
2. The `<noscript>` block near the bottom of `index.html`.

Both are marked with `TODO` comments. This is the only duplication in the project,
and it's deliberate — everything in it changes rarely. The status notice is
deliberately *not* duplicated there, since a stale status is worse than none.

---

## Running it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly as a file works too, though the embedded map may not
load over `file://`.

## Deploying

Any static host. Drag the folder into Netlify, or point Vercel/GitHub Pages at the
repo. There is no build command and no output directory — serve the root as-is.

## If you later want pre-rendered HTML

Content currently renders client-side. The mitigations above cover search engines
well for a local business, but if you ever want real static HTML, the upgrade path
is a ~20-line dependency-free `build.js` that reads the same `site.config.js` and
writes out a finished `index.html` at deploy time. Nothing about the config format
would need to change.


### Notes
- [x] Very nice
- [x] this design reads more like tech startup, I'm wondering about alternatives in design
  - [x] the theme... I'm wondering if a light theme would be more fitting
- [x] the icons... could open source icons be used? or is this too much dependency? i.e. something like ReactIcons.
  - [x] I'm not sure if I don't like the icons or they're just too small in the site
- [x] I like the dynamic display of whether the shop is open or closed
- [x] also check the assets/logo. I think that could be the tab icon and the header logo? what do you think
  - Header logo: yes, done. Tab icon: no — see **Images** above for why.
- [x] there's a banner/hero image in assets/hero.jpg
  - [x] please rename it accoringly if needed
  - [x] I'd like to use this above the fold, in a responsive way
- [x] the hero looks a little too narrow
- [x] is the `<span data-field="header-phone-text"></span>` really necessary for SEO? seems repetitive since the number is already in the nav
  - what's the case for keeping it?
  - That span **is** the number in the nav — it's the visible text inside the
    header call button. Remove it and the header shows a bare phone icon with
    no number. It does nothing for SEO (Google takes the number from the
    LocalBusiness JSON-LD); the case for keeping it is purely UX: it's the
    one-tap call target that stays on screen while you scroll. It already
    hides itself below 560px, so the button is icon-only on phones. Keeping.
- [x] The footer re-states all the info, the business name, address, and phone. I'm asuming this is fine, what do you think? it's very close to the hours and location section, maybe that's why it feels redundant.
  - Not fine — adjacency was exactly the problem. The footer's address and
    phone sat ~200px below the same details in "Find us", but as plain text
    rather than links, and without the email. Strictly worse than the block
    above it. Restating name/address/phone in a footer is a multi-page
    convention, where the footer is the global fallback; a one-pager has
    nothing to fall back from. Removed the address/phone line, and dropped
    the duplicate name from the © line. No SEO cost — those details still
    reach Google through the LocalBusiness JSON-LD.
- [x] please change the favicon to the logo