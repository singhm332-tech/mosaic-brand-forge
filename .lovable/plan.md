# Social Reel Portfolio

## What will be added
- Add a single “Content we’ve created.” portfolio section to the Social Media Marketing service page only.
- Present four vertical 9:16 Reel slots in a horizontal, touch-friendly strip: roughly four visible on wide screens and one-and-a-half on mobile.
- Give every item a restrained Reel marker, client name, and “View on Instagram ↗” link.
- Use polished placeholder covers until the real Instagram Reel URLs and client names are supplied, without implying they are real client work.

## Interaction and presentation
- Preserve the existing ivory, charcoal, serif/sans typography, spacing, and reveal motion.
- Use scroll snapping and native horizontal scrolling rather than a generic social feed or heavy carousel controls.
- Once real links are added, supported Instagram Reel URLs will render as playable Instagram embeds; the original post remains available through its external link.
- Keep borders and hover movement subtle, with no gradients, oversized cards, or decorative effects.

## Technical details
- Create a reusable Reel showcase component and keep all Reel entries in one clearly labeled data array.
- Add an optional page-content slot to the shared service-page layout so the showcase sits between the service details and process section without affecting other service pages.
- Validate desktop and mobile layouts, external link behavior, page metadata, and reduced-motion behavior.
