# Facebook Post Widget — Logic Reference (Single Doctor)

Portable notes on how to render a carousel of live Facebook post embeds for
**one specific doctor**, identified by a `slug` you pass in directly (no
doctor-list lookup). Adapted from this project's multi-doctor carousel:
[js/script.js](js/script.js) (Facebook SDK/data logic) and
[js/script.js:201-229](js/script.js#L201-L229) (carousel paging).

## Goal

Given a single known `slug`, fetch that doctor's Facebook posts from the
per-doctor API, filter/sort them, and render up to N cards as live embeds via
the official Facebook JS SDK (`FB.XFBML.parse`), with manual prev/next
paging — without ever breaking an already-rendered embed.

## APIs involved

Base URL: `https://digidrapi.digidr.app`

| # | Endpoint | Used by | Purpose |
|---|----------|---------|---------|
| 1 | `GET /api/MicrositeSocialFeed` | Multi-doctor version only | Lists all doctors with a connected social feed. **Not used** in this single-doctor variant. |
| 2 | `GET /api/MicrositeSocialFeed/{slug}?limit={n}` | This variant | Returns one doctor's Facebook post feed(s), given their `slug`. This is the only API this widget calls. |

Example request for API #2:
```
GET https://digidrapi.digidr.app/api/MicrositeSocialFeed/dr-jane-doe?limit=3
```

Expected shape (fields actually used by the widget):
```json
{
  "success": true,
  "feeds": [
    {
      "platform": "facebook",
      "accountName": "Dr. Jane Doe Clinic",
      "posts": [
        { "permalink": "https://www.facebook.com/.../posts/123", "createdAt": "2026-09-10T12:00:00Z" },
        { "permalink": "https://www.facebook.com/.../videos/456", "createdAt": "2026-09-05T09:00:00Z" }
      ]
    }
  ]
}
```
A doctor can have more than one `feeds` entry (multiple connected accounts);
only entries with `platform === "facebook"` are used.

## Key difference from the multi-doctor version

The original widget calls a **list API** (`/api/MicrositeSocialFeed`) to
discover many doctors, then fetches one post from each. This variant skips
that entirely: the `slug` is a fixed config value (hardcoded, from a URL
param, from page data — whatever fits your app), and only the **per-doctor
API** is called:

```js
const DOCTOR_SLUG = 'dr-jane-doe'; // <-- set this per deployment/page

const url = API_BASE + '/api/MicrositeSocialFeed/' +
    encodeURIComponent(DOCTOR_SLUG) + '?limit=' + POSTS_PER_ACCOUNT;
```

**On the DigiDr live microsites** the slug comes from the page, never a
hardcoded string: only the HTML pages are templated (see
`parameterization.md`), so a literal `{{slug}}` inside `script/index.js` would
never be replaced. Read it from `<body data-slug="{{slug}}">` instead, and
treat an unreplaced placeholder as unset:

```js
const RAW_SLUG = (document.body.dataset.slug || "").trim();
const DOCTOR_SLUG = RAW_SLUG.includes("{{") ? "" : RAW_SLUG;
```

The slug is the microsite's real URL slug, which often differs from the
folder name (e.g. `Raj-kumar` → `drraj`, `deepak-dabkara` → `deepak-dabkara-3`,
`samir-shah` → `dr-samir-shah`). `GET /api/MicrositeSocialFeed` lists them all.

Since there's only one doctor, "one post per owner" no longer applies —
instead, show that doctor's **N most recent qualifying posts** (across all
their connected Facebook accounts, if they have more than one).

## Core rules

1. **No doctor-list step — the slug is given, not discovered.**
   Do not call the list endpoint at all. Fail fast (hide the section — see
   rule 11) if `DOCTOR_SLUG` is unset/blank, rather than silently calling
   an API with an empty slug.

2. **Cap the number of cards shown at once.**
   `MAX_CARDS = 5` (tune as needed) — the doctor's N most recent posts
   across all their Facebook accounts, not one-per-account. Keeps the embed
   count (and SDK/iframe cost) bounded even if a doctor has many accounts
   or a very active feed.

3. **Block video posts entirely.**
   Facebook video posts autoplay inside Facebook's own cross-origin iframe,
   which the host page cannot mute, pause, or control. Rather than show an
   autoplaying video in a small carousel card, video permalinks are filtered
   out before rendering:
   ```js
   function isVideoPermalink(url) {
       return /\/videos\//i.test(url);
   }
   ```
   Detection is done by URL shape (`/videos/` vs `/posts/` in the permalink)
   since the API response has no explicit post-type field.

4. **Only show recent posts.**
   Posts older than a window (`MAX_POST_AGE_DAYS = 30`) are dropped so the
   feed never looks abandoned. A missing or unparseable `createdAt` is
   treated as "too old" rather than shown blindly (fail closed, not open).

5. **Merge posts across the doctor's accounts, then sort newest-first.**
   A doctor can have more than one connected Facebook account (multiple
   `feeds` entries in the API response). Flatten all `platform === 'facebook'`
   posts from every account into one list, filter (video / stale), sort by
   `createdAt` descending, then slice to `MAX_CARDS`:
   ```js
   function fetchDoctorPosts(slug) {
       const url = API_BASE + '/api/MicrositeSocialFeed/' +
           encodeURIComponent(slug) + '?limit=' + POSTS_PER_ACCOUNT;

       return fetchJson(url).then(function (data) {
           if (!data || data.success === false || !Array.isArray(data.feeds)) return [];

           const entries = [];
           data.feeds.forEach(function (feed) {
               if (!feed || feed.platform !== 'facebook' || !Array.isArray(feed.posts)) return;
               feed.posts.forEach(function (post) {
                   if (!post || !post.permalink) return;
                   if (isVideoPermalink(post.permalink)) return;
                   if (!isRecent(post.createdAt)) return;
                   entries.push({
                       accountName: (feed.accountName || '').trim(),
                       permalink: post.permalink,
                       createdAt: post.createdAt || ''
                   });
               });
           });

           entries.sort(function (a, b) {
               return new Date(b.createdAt) - new Date(a.createdAt);
           });
           return entries.slice(0, MAX_CARDS);
       }).catch(function () {
           return []; // API/network failure -> empty state, not a crash
       });
   }
   ```

6. **Never clone or re-parent a rendered embed.**
   Once `FB.XFBML.parse()` builds an iframe for a `.fb-post` div, cloning
   that node renders blank, and re-parenting it reloads/breaks the iframe.
   So: build the full card DOM once, append it, and never touch it again.
   Any carousel paging must operate on the *container* (e.g.
   `scrollLeft`/transform), never on the individual cards:
   ```js
   // Posts Carousel — manual, button-driven paging.
   // Cards hold live Facebook embeds, which must never be cloned (a cloned embed
   // renders blank) nor re-parented (that reloads the iframe). So the DOM is built
   // once and left alone: paging only changes the container's scrollLeft, which
   // the browser handles natively without touching any card.
   ```

7. **Lazy-load the Facebook SDK, once, only when needed.**
   The SDK script (`connect.facebook.net/.../sdk.js`) is only injected when
   the carousel is about to be used, and only once (`fbSdkPromise` memoized).
   Loading is deferred until the carousel nears the viewport via
   `IntersectionObserver` (`rootMargin: '400px 0px'`), so it doesn't cost
   anything on pages/users who never scroll to it. The paint watchdog
   (`watchCards()`) starts with the SDK, not when the cards are built —
   otherwise its deadline would expire before a slow scroller ever reaches the
   section and every card would turn into a fallback link.
   Only the SDK is lazy: the small feed request runs at page load (rule 11).

8. **Pin the Graph API version explicitly, and don't let it go stale.**
   ```js
   window.FB.init({ xfbml: false, version: FB_GRAPH_VERSION }); // e.g. 'v23.0'
   ```
   Deprecated Graph API versions don't fail loudly — the SDK still builds
   iframes, but Facebook redirects the request to a login page, so every
   embed silently renders blank. If embeds go blank with no console error,
   check this version first. `xfbml: false` at init time is intentional:
   parsing is triggered manually later (`FB.XFBML.parse(carousel)`) after
   the cards exist in the DOM, not automatically on page load.

9. **Build each embed with a real `<div class="fb-post">`, not an iframe src.**
   The Facebook plugin URL responds with `X-Frame-Options: DENY`, so it can
   never be used as a direct iframe `src`. The only supported path is the
   SDK's XFBML div (`data-href`, `data-width`, `data-show-text`), parsed by
   `FB.XFBML.parse()`.

10. **Always render a non-JS fallback link inside the embed div.**
    A `<blockquote class="fb-xfbml-parse-ignore">` with a plain link to the
    post is nested inside the `.fb-post` div. If the SDK fails to load or is
    blocked (ad blockers, cookie restrictions), the fallback link is what's
    left visible instead of an empty box.

11. **Show the section only when there are posts; otherwise hide it entirely.**
    - The feed is fetched **at page load** (not when the section scrolls into
      view), so the show/hide decision is normally made before the visitor
      gets there and the section never collapses under them mid-read.
    - `fetchJson` retries a failed request once after a short delay
      (network blips are common on mobile).
    - Wait up to **`FEED_TIMEOUT_MS = 7000`** (7 s) for an answer, showing the
      skeleton cards meanwhile.
    - **Hide the whole section** (`hideSection()`: `hidden` + inline
      `display: none`, since templates may set `display` on `<section>`) when:
      the slug is unset, no Facebook feed is connected, the feed has zero
      qualifying posts after filtering (all videos / older than
      `MAX_POST_AGE_DAYS`), the API fails, or there is no answer within 7 s.
    - The decision is **final**: a reply that arrives after the 7 s timeout is
      ignored and the section stays hidden (no late pop-in / layout shift).
    - There is no "Posts are taking a moment to load…" empty-state message any
      more — a doctor without posts simply has no social section.

12. **Read the embed width from CSS, not a hardcoded constant.**
    ```js
    const raw = getComputedStyle(carousel).getPropertyValue('--post-card-width');
    ```
    So the pixel width the SDK needs (`data-width`) always matches the
    actual card size defined in CSS, with a sane fallback (`300`) if the
    custom property is missing.

13. **Manual carousel paging moves by whole visible "pages", not one card.**
    Step size = (card width + gap) × number of fully-visible cards, so a
    click never leaves a card half-cut-off at the edge:
    ```js
    function stepSize() {
        const card = items[0];
        const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
        const span = card.offsetWidth + gap;
        const perPage = Math.max(1, Math.floor(carousel.clientWidth / span));
        return span * perPage;
    }
    ```

14. **Card look is fixed — every microsite must match `dhara-sharma` exactly.**
    The section header (kicker, `h2`, subtitle), the prev/next buttons and the
    section band colour follow each microsite's own palette, but the **cards
    themselves are identical everywhere**. Never remap these values to the
    local theme:

    | Property | Value |
    |---|---|
    | Card size (desktop, >1100px) | `--post-card-width: 300px; --post-card-height: 400px` |
    | Card size (tablet, 641–1100px) | `300px × 400px` |
    | Card size (mobile, ≤640px) | `280px × 375px` (Facebook's embed floor is ~250px) |
    | Gap between cards | `30px` |
    | Corner radius | `24px` |
    | Surface | `#ffffff` |
    | Border | `1px solid hsl(155, 18%, 85%)` |
    | Shadow | `0 4px 18px hsla(168, 40%, 18%, 0.10)` |
    | Overflow | `hidden` on the card **and** on `.fb-post` — the post is **clipped, never scrolled** |
    | Bottom fade | `44px` linear-gradient, transparent → `#ffffff` (skipped on fallback cards) |

    The card height is deliberately fixed (`height: var(--post-card-height)
    !important`), overriding the global auto-height rule: Facebook sizes its
    iframe to the post's content (one long post measured ~3700px), so an
    auto-height card would stretch the whole row. Do **not** add an inner
    scrollbar (it traps swipes on mobile inside a horizontal carousel) and do
    **not** add a "View on Facebook" button over the card.

15. **Skeleton loading — never a blank card or an empty band.**
    Loading is shown in two phases, both using the same skeleton that mirrors a
    Facebook post (round 44px avatar + two name lines, a large image block,
    two text lines), shimmering between `hsl(150, 24%, 94%)` and
    `hsl(150, 25%, 99%)`:

    1. **Before the API responds:** `showSkeletons()` fills the track with 3
       placeholder cards (`.social-post-card.is-placeholder`) and sets
       `aria-busy="true"` on the track. It runs at init, together with the
       feed request, and stays up for at most 7 s (rule 11) before the
       section either shows its posts or is hidden.
    2. **After the cards are built, until Facebook paints:** each real card
       gets the same skeleton (`buildSkeleton()`) as an absolutely positioned
       layer *behind* the `.fb-post` (`z-index: 0`). It is hidden with
       `.social-post-card.is-loaded .social-post-skeleton { display: none; }`
       when the card settles — the card DOM is still built once and never
       cloned or re-parented (rule 6).

    `renderPosts()` clears the placeholders (`track.innerHTML = ""`)
    immediately before inserting the real cards and removes `aria-busy`.
    Skeletons are `aria-hidden="true"`, and the shimmer animation is disabled
    under `prefers-reduced-motion: reduce`.

16. **Integrating into a microsite whose CSS has a global reset — gotchas.**
    - The DigiDr global reset sets `div { max-width: 100% }`. The track uses
      `width: max-content; min-width: 100%; justify-content: safe center` (centred
      while the posts fit, left-aligned once they overflow — never plain
      `center`, see rule 17), so it **must** also set `max-width: none` —
      otherwise the track is capped at the carousel width and centring pushes
      the first cards off the left edge, where they can never be scrolled to.
    - Several older templates still carry CSS for a removed mock social section
      (`.social-post-card` hover lift, flex layout, `.social-media-carousel {
      overflow: hidden }`) and an old "Social Media Carousel" JS IIFE. Append
      the widget CSS at the **end** of `style.css`, scope card rules under
      `.social-media-section`, and reset `transform`/`transition`/hover. The
      old IIFE is harmless (it exits when the track has no cards at load).
    - Give the prev/next buttons their own class (`.social-carousel-btn`)
      instead of reusing the testimonials `.carousel-btn`, whose rules differ
      per template.
    - Facebook embeds don't load from `file://` (unique origin) — test over
      `http(s)`.

17. **Alignment and prev/next visibility follow whether the cards fit.**
    - Posts fit the carousel → cards are **centred** and the prev/next buttons
      are **hidden**. Posts overflow → cards are **left-aligned** (first card
      next to the prev button) and the buttons are **shown**.
    - Alignment is pure CSS: `.social-media-track { justify-content: safe
      center; }`. `safe` makes the browser fall back to start alignment on
      overflow; plain `center` must not be used.
    - Visibility is JS, inside `syncButtons()` (runs after the SDK loads, on
      scroll and on resize):
      ```js
      const fits = carousel.scrollWidth <= carousel.clientWidth + 1;
      prevBtn.hidden = fits;
      nextBtn.hidden = fits;
      ```
      The `+ 1` absorbs sub-pixel rounding. Keep the existing `disabled`
      logic after it.
    - `.carousel-btn` sets `display: flex`, which defeats `[hidden]`, so the
      stylesheet must also contain:
      ```css
      .social-carousel-prev[hidden],
      .social-carousel-next[hidden] { display: none; }
      ```
    - Test with 2 posts (centred, no buttons) **and** 5+ posts (left-aligned,
      buttons visible), at desktop and ≤900px.

## Order of operations (summary)

1. At page load: validate `DOCTOR_SLUG` (unset → hide the section, stop).
2. Show 3 skeleton placeholder cards (`aria-busy="true"`), start the 7 s
   timeout, and call the per-doctor API directly
   (`/api/MicrositeSocialFeed/{slug}`) — no list API involved.
3. Flatten posts across all of that doctor's Facebook accounts → drop
   videos → drop stale posts → sort newest-first → slice to `MAX_CARDS`.
4. Zero posts, API failure or the 7 s timeout → hide the section (final).
   Otherwise clear the placeholders and build DOM for each card (skeleton
   layer + embed div + fallback link), insert once.
5. `IntersectionObserver` sees the section near the viewport → start the paint
   watchdog → lazy-load Facebook SDK (memoized) → `FB.init` with a pinned
   version → `FB.XFBML.parse(container)`.
6. Init manual carousel paging (container-level scroll only, cards untouched).

## Porting checklist

- [ ] Supply `DOCTOR_SLUG` from your config/route/page data — validate it's
      non-empty before calling the API.
- [ ] Set `MAX_CARDS`, `MAX_POST_AGE_DAYS`, `POSTS_PER_ACCOUNT` for your case.
- [ ] Keep the video-permalink filter (or equivalent) if autoplay-without-
      control is unacceptable in your layout.
- [ ] Memoize SDK loading; gate it behind `IntersectionObserver` if the
      widget isn't always above the fold.
- [ ] Pin `FB_GRAPH_VERSION` and note it needs periodic bumping.
- [ ] Never clone/re-parent a card holding a parsed `.fb-post` embed.
- [ ] Always include the `fb-xfbml-parse-ignore` fallback link.
- [ ] Hide the whole section — never a blank or empty band — on missing
      slug, no connected feed, zero qualifying posts, API failure, or no
      answer within 7 s; a late reply must not bring it back (rule 11).
- [ ] Fetch the feed at page load; keep only the SDK behind
      `IntersectionObserver`.
- [ ] Slug read from `<body data-slug="{{slug}}">`, not hardcoded in the JS.
- [ ] Cards match the fixed `dhara-sharma` spec (rule 14) — 300×400 /
      280×375, 24px radius, clipped with the 44px fade, no inner scroll.
- [ ] Skeleton loading in both phases (rule 15); test with a slow network.
- [ ] Track has `max-width: none` (rule 16); test with 5 posts, not just 2 —
      the clipping bug is invisible when the posts fit.
- [ ] Verify over `http(s)` at 1440px and 390px: cards render, Next pages
      the carousel, no horizontal page overflow.
- [ ] Track uses `justify-content: safe center`, buttons hide via `hidden` when
      the cards fit, and the `[hidden]` CSS rule is present (rule 17); test with
      2 posts and with 5+.
