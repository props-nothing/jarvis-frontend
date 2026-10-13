# Design

Reviewed and redesigned 2026-10-13. This repository is the public install site, not the authenticated Rust console.

## Direction

The actual JARVIS face is the defining visual. A centered, unframed scene leads into the JARVIS name, concise supporting copy and direct install/docs actions. The next install section remains visible in the first viewport. OpenClaw is a reference for the install path and concrete capabilities, not copied branding or content.

Reviewed the official Anthropic frontend-design skill and Vercel web-design-guidelines. The result uses a graphite base, cyan face, white text, amber approval states and restrained red capability accents. Content sections are unframed; tools alone use small-radius borders. No background orbs, gradient headlines, blue card wall or screenshot section.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#080a0a` | Graphite page |
| `--text` | `#eef2ee` | Main text |
| `--dim` | `#a1aeaa` | Supporting text |
| `--cyan` | `#68e7e0` | Face, links, actions |
| `--amber` | `#efc078` | Approval and planned states |
| `--red` | `#fa817b` | Secondary capability accent |

Bahnschrift, Avenir Next and Trebuchet MS form the display stack; Cascadia and other local monospace fonts serve code. No font downloads. Type uses explicit breakpoint sizes, never viewport-scaled fonts or negative letter spacing.

## Face And Motion

The unmodified canonical MediaPipe face has 468 vertices and 898 triangles, matching the production HUD. Three.js renders a dark surface with cyan triangulation. The face follows a mouse pointer and moves gently at rest; touch users scroll normally. It is decorative, not connected to a daemon, model or microphone.

The loop stops under reduced motion, on explicit pause, off-screen and in hidden tabs. Resize still repaints. WebGL2 failure or context loss displays a static 2D projection of the same geometry. Geometry, materials, renderer, observers and event listeners are disposed on unmount. The canvas is capped at 1.5 device-pixel ratio.

Terminal content is immediately readable. Replay is user-triggered and stoppable. The policy pipeline and connection wires no longer animate continuously. Scroll reveals cannot hide page content.

## Accessibility And Content

Install tabs retain arrow-key wrapping, Home/End, roving focus and unique labelled panels. Copy success/failure is announced; changing methods invalidates stale requests. The skip link, visible focus, native FAQ disclosures, mobile navigation and Escape focus restoration remain. Icon controls have button labels and titles. Approval examples explicitly describe hypothetical outcomes; no email is sent.

The platform table includes recorded Ubuntu evidence. Tool discovery and model routing are no longer presented as unbuilt; ACP sign-in/cancellation and broader call verification remain clearly unverified. Source-install prerequisites and the unresolved JARVIS distribution licence remain visible. Screenshot social metadata is removed.

## Performance And Verification

The main script is about 82 kB gzip and CSS about 5 kB. The lazy face scene adds about 153 kB gzip, including geometry. This is an intentional cost for a real interactive face; install controls do not wait for it. Vite reports the scene's minified chunk above 500 kB. No remote textures, asset CDN, telemetry or provider calls were added. Third-party licenses ship under `public/licenses/`.

Node tests check the pinned asset digest, finite geometry and triangle count, license retention, navigation targets, removed screenshot references, bounded type and visible content. Installer regressions remain in the same test command. Integrated Chromium checks cover menu/focus, install-tab keyboard behavior, clipboard feedback, approval/denial/reset and terminal replay/stop.

Recorded checks on 2026-10-13: 24 Node tests pass; typecheck, production build and installer syntax/contracts pass; no editor errors or normal-load browser exceptions. Renderer instrumentation observed 12 draw calls during motion and zero during pause, reduced motion and off-screen intervals. Forced context loss produced 8,068 painted fallback pixels and restored successfully. A fresh WebGL-unavailable load produced 12,164 painted pixels. Pause/replay hit areas are 44x44 pixels.

Layout checks pass at 320x568, 320x640, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080 and 844x390: no horizontal page overflow, hero actions stay on one row and the next install section is visible. Canvas-pixel checks prove a rendered face on desktop and mobile. These checks are not native Safari/iOS or Android evidence; those remain release-device checks.
