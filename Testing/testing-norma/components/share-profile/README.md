# Profile sharing

Copy this folder into another microsite's `components` directory. Load the two files on its profile page. The icons use the Font Awesome 6.7.2 stylesheet included in DigiDr microsites.

```html
<link rel="stylesheet" href="./components/share-profile/share-profile.css">
<script defer src="./components/share-profile/share-profile.js"></script>
```

Place the component wherever visitors should be able to share the profile.

For a fixed right-side bar, add `side-rail`, `with-whatsapp`, and `call-number` to the element. Supply the clinic number with country code, using digits and a leading plus. The testing site uses a fictional number.

```html
<digidr-share-profile with-whatsapp></digidr-share-profile>
```

Both actions use the page's HTTP or HTTPS canonical URL. **Share profile** passes the page heading and URL to the device share menu. If sharing is unavailable, it copies the link or shows a selectable URL. **WhatsApp** opens the profile link in a composer where the visitor chooses a recipient. Omit `with-whatsapp` for the single-button version.

The share button inherits the site's `--brand`, `--brand-dark`, `--font-body` and `--radius-pill` tokens. WhatsApp uses its signature green and dark lettering across themes. Set the optional properties on the component if a site's brand palette needs a different text or focus color.

```css
digidr-share-profile {
  --profile-share-bg: #284c64;
  --profile-share-hover: #193449;
  --profile-share-ink: #fff;
  --profile-share-focus: #193449;
}
```

The component works with English labels out of the box. Sites using the DigiDr language picker can supply `share.share_profile`, `share.link_copied`, and `share.copy_this_link_manually` in their catalogs. Sites using DigiDr analytics receive `share_profile_click` and `whatsapp_share_click` through the usual click handler.
