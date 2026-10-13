# Design

## Language

The site borrows the JARVIS console's palette so product and site feel like one thing.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#02060c` | Page |
| `--cyan` | `#5ee3ff` | Primary accent, links, active states |
| `--amber` | `#ffb454` | Approvals, prompts, planned items |
| `--green` | `#6be2a0` | Verified, success |
| `--violet` | `#9fb8ff` | Gradient partner |

Type uses system stacks only (Bahnschrift or Segoe UI Variable on Windows, system-ui elsewhere, Cascadia or Consolas for code). No font downloads.

## Motion

- **Hero head:** canvas, 760 points on a Fibonacci sphere, latitude lines, three tilted rings, a core that brightens on hover, voice bars. It tilts toward the pointer, pauses off-screen and renders one still frame under `prefers-reduced-motion`.
- **Terminal and pipeline:** scripted, start when scrolled into view.
- **Reveal on scroll:** opacity and 22 px translate, once.

## Accessibility

- All motion is disabled under `prefers-reduced-motion`; content stays visible.
- Install tabs link to unique labelled panels, with one tab stop per group, arrow-key wrapping and Home/End navigation. Copy failures are announced; changing tabs clears stale copy feedback.
- A skip link and mobile/tablet menu support keyboard use; Escape closes the menu and restores focus. FAQ uses native `<details>`.
- The canvas has a text alternative, stays painted after reduced-motion resizing, and responds when the motion preference changes.
- Focus rings are visible; contrast of body text on the background is above 7:1.

## Performance

About 79 kB gzip of JavaScript and 5 kB of CSS, no network requests other than the page. The canvas loop stops when off-screen.

## Responsive

Two breakpoints (1020 px and 720 px). The head moves above the headline on narrow screens, grids collapse, HUD labels hide, install box wraps the copy button. Navigation becomes an expandable menu below 1020 px. Overflow checks cover 320, 390, 768, 1024 and 1440 px; long commands scroll inside their boxes instead of pushing the page off-screen.
