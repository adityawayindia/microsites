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

Since there's only one doctor, "one post per owner" no longer applies —
instead, show that doctor's **N most recent qualifying posts** (across all
their connected Facebook accounts, if they have more than one).

## Core rules

1. **No doctor-list step — the slug is given, not discovered.**
   Do not call the list endpoint at all. Fail fast (show the empty-state
   fallback) if `DOCTOR_SLUG` is unset/blank, rather than silently calling
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
   anything on pages/users who never scroll to it.

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

11. **Retry the data fetch once, but fail to an empty state, not a crash.**
    - `fetchJson` retries a failed request once after a short delay
      (network blips are common on mobile).
    - If the fetch ultimately fails, or the doctor has zero qualifying
      posts after filtering, show a text fallback ("Posts are taking a
      moment to load...") instead of an empty section.

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

## Order of operations (summary)

1. `IntersectionObserver` fires → `start()`.
2. Validate `DOCTOR_SLUG` is set → call the per-doctor API directly
   (`/api/MicrositeSocialFeed/{slug}`) — no list API involved.
3. Flatten posts across all of that doctor's Facebook accounts → drop
   videos → drop stale posts → sort newest-first → slice to `MAX_CARDS`.
4. If empty, show the fallback message; otherwise build DOM for each card
   (embed div + fallback link), insert once.
5. Lazy-load Facebook SDK (memoized) → `FB.init` with a pinned version →
   `FB.XFBML.parse(container)`.
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
- [ ] Fail to an explicit empty/fallback state — never a blank section —
      on missing slug, API failure, or zero qualifying posts.
