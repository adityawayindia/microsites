# 🇮🇳 Independence Day Module — DigiDr Microsites

A modular, plug-and-play Independence Day overlay designed to seamlessly attach to any DigiDr doctor microsite.

---

## Features

| Feature | Description |
|---|---|
| **Vibrant Tricolor Banner** | Glossy Saffron-to-Green gradient bar embedded inside `.site-header` with 24-spoke vector Ashoka Chakra wheel emblems, navy text, pill badge, and dismissal button. Scrolls & sticks naturally with the header. |
| **Pole-Free Floating Flags** | Clean fluttering flag banners at side corners on **both Desktop and Mobile**. |
| **Directional Scroll Hiding** | Floating flags **hide smoothly on scroll DOWN** and **reappear on scroll UP** throughout the website. Always visible at top of page (`scrollY <= 20px`). |
| **Booking Modal Defense** | Floating flags AND Ashoka Chakra button **automatically hide** when any Booking Modal is open so they never overlap modal forms or overlays. |
| **Tricolor Confetti** | Canvas-based particle rain (saffron, white, green, navy, gold) on page load. |
| **Interactive Fireworks** | Spark explosions on 15 Aug or triggered via Ashoka Chakra badge. |
| **Risen Ashoka Chakra Badge** | Spinning 24-spoke badge in bottom-right (`bottom: 50px` desktop / `44px` mobile); click to celebrate. |

---

## Auto-Activation Window

The module **automatically activates** between **10 August** and **15 August** (IST, inclusive).  
Outside this window, the script does nothing — no DOM is modified, no styles are injected.

---

## How to Add to Any Microsite

Add **two lines** in `<head>`:
```html
<link rel="stylesheet" href="../independence-day/independence-day.css" />
```

And **one line** before `</body>`:
```html
<script src="../independence-day/independence-day.js"></script>
```

---

## Testing & Preview Parameters

- `?id_preview=1`: Forces the module active regardless of current date.
- `?id_day15=1`: Simulates 15 August full celebration (fireworks + 79th Independence Day greeting).
