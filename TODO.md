- [x] I'd like to consider the following
  - [x] SEO
    - Added: canonical + `og:url`, a 1200x630 `og:image` with Twitter card,
      `robots.txt`, `sitemap.xml`, and `priceRange`/`areaServed` in the schema.
    - The LocalBusiness JSON-LD was JS-injected, so it only existed after the
      page rendered. There's now a static copy in `index.html` that `main.js`
      swaps out, so Google's first raw-HTML pass sees it too.
      (Correction to an earlier note here: Facebook's scraper does *not* read
      JSON-LD — it reads the Open Graph tags, which were already static.)
    - Deliberately skipped: `aggregateRating` markup for the 4.8 stat. Self-
      reported ratings with no review source are a manual-action risk, so it
      stays a visual stat only.
    - Still worth doing, but needs info I don't have:
      - `geo` coordinates in the schema (helps the local map pack)
      - Claim/refresh the Google Business Profile — for a local shop that
        outranks anything on the site itself
  - [x] a link to their facebook page
    - Wired up end to end: `shop.social.facebook` in `site.config.js` renders a
      row in "Find us" and feeds the schema's `sameAs`. Verified with a
      placeholder, then blanked out. Just needs the real URL pasted in.


## Next
- [x] could the `shop-schema` script be sourced in such a way as to keep a single source of truth?
  - Not by reference: `src` is ignored on `<script type="application/ld+json">`,
    so the content has to be inline. The only real options were to generate it
    from the config at edit time, or to carry less in it.
- [x] I'm seeing business hours re-written in there
  - Fair — that was a regression I introduced, taking hours from two places to
    three. The static block is now identity facts only (type, name, address,
    phone, email, priceRange); hours, services, and areaServed come solely from
    `site.config.js` via `main.js`. Back to two places, and the remaining one
    (the `noscript` block) follows the same near-static rule it always did.
  - If you ever want a true single source: a `build.js`/`sync-schema.py` that
    generates the static block from the config, with a `--check` mode to fail on
    drift. Rejected for now — it adds a step someone has to remember to run,
    which is its own drift risk on a site this small.
