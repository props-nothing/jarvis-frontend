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
| `--amber` | `#efc078` | Approval, reasoning and experimental states |
| `--red` | `#fa817b` | Capability adapters and deferred work |

Bahnschrift, Avenir Next and Trebuchet MS form the display stack; Cascadia and other local monospace fonts serve code. No font downloads. Type uses explicit breakpoint sizes, never viewport-scaled fonts or negative letter spacing.

## Face And Motion

The unmodified canonical MediaPipe face has 468 vertices and 898 triangles, matching the production HUD. Three.js renders a dark surface with cyan triangulation. The face follows a mouse pointer and moves gently at rest; touch users scroll normally. It is decorative, not connected to a daemon, model or microphone.

The loop stops under reduced motion, on explicit pause, off-screen and in hidden tabs. Resize still repaints. WebGL2 failure or context loss displays a static 2D projection of the same geometry. Geometry, materials, renderer, observers and event listeners are disposed on unmount. The canvas is capped at 1.5 device-pixel ratio.

The mission demo starts only when requested. Progress animation is confined to its running state, with pause and stop controls; reduced motion uses fast, unanimated transitions. No example can progress past its owner decision on a timer. The policy inspector and architecture connection wires do not animate continuously. Scroll reveals cannot hide page content.

## Interactive Sections

The mission view replaces the disconnected terminal/approval examples with three selectable workflows: email, read-only research and files. A deterministic reducer owns progress and decisions. One pending tick carries a run ID and step index; old ticks cannot resume an interrupted or replaced example. A trace row exposes example context and sources. Email/file approvals gate the final step; research has no external effect. Outcomes, denial and stopped states are explicit, and replay resets the decision. On phones the outcome/question precedes the trace. No model, account or filesystem is connected.

Trust centers the authority boundary between model intent and authorized effect, followed by seven keyboard-accessible gate tabs and a labelled explanation panel. Architecture uses a Rust-centered blueprint with separate interface, reasoning, capability and local-storage lanes. ACP and phone providers are experimental, not planned or generally verified. Worktrees are explicitly not operating-system isolation. The roadmap has four evidence states and a dated acceptance-backlog link. The FAQ is removed entirely.

## Accessibility And Content

Install, workflow and policy tabs support arrow-key wrapping, Home/End and labelled panels. Copy success/failure is announced; changing methods invalidates stale requests. Workflow status is announced; approval/denial moves focus to the outcome pane without scrolling. Icon controls have button labels and titles. Examples describe hypothetical outcomes, never real sent mail or written files.

Mobile navigation uses ordinary links and a disclosure button, not a modal or fake menubar. Opening resets the dropdown scroll and focuses the first link. Escape restores toggle focus; outside pointer/focus dismisses; selecting an anchor closes and focuses its section. Breakpoint changes clear expanded state. Icons stay centered, safe-area insets are respected, and a bounded dropdown scrolls on short screens. No body-scroll lock or focus trap was added to this nonmodal menu.

The platform table includes recorded Ubuntu evidence. Tool discovery and model routing are no longer presented as unbuilt; ACP sign-in/cancellation and broader call verification remain clearly unverified. Source-install prerequisites remain visible. Apache-2.0 is selected for original code/docs; signed public downloads still need dependency notices and verification. Screenshot social metadata is removed.

## Performance And Verification

The main script is about 88 kB gzip and CSS about 7 kB. The lazy face scene adds about 153 kB gzip, including geometry. This is an intentional cost for a real interactive face; install controls do not wait for it. Vite reports the scene's minified chunk above 500 kB. No remote textures, asset CDN, telemetry or provider calls were added. Third-party licenses ship under `public/licenses/`.

Node tests check the pinned asset, navigation/FAQ removal, roadmap classifications, gate ordering, menu contracts and the workflow reducer's approval/pause/stop/stale-tick behavior. Installer regressions remain in the same test command. Integrated Chromium checks cover keyboard menus/tabs, clipboard feedback, all three workflows, source inspection, approval/denial, replay, pause/resume/stop, scenario replacement and outcome focus.

The initial redesign on 2026-10-13 passed 24 Node tests, typecheck/build and installer contracts, with no editor or normal-load browser errors. Renderer instrumentation observed 12 draw calls during motion and zero during pause, reduced motion and off-screen intervals. Forced context loss produced 8,068 painted fallback pixels and restored successfully. A fresh WebGL-unavailable load produced 12,164 painted pixels. Pause/replay hit areas are 44x44 pixels.

Follow-up verification on 2026-10-13: all 30 Node tests, typecheck/production build and whitespace checks pass. A fresh browser load reports no runtime exceptions. All changed sections pass width/clip checks at 320, 390, 768, 1024, 1440 and 1920 pixels. Menu checks also cover 844x240, including last-link scroll followed by Escape/reopen with the first link visible. Native Safari/iOS and Android checks remain open.

Layout checks pass at 320x568, 320x640, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080 and 844x390: no horizontal page overflow, hero actions stay on one row and the next install section is visible. Canvas-pixel checks prove a rendered face on desktop and mobile. These checks are not native Safari/iOS or Android evidence; those remain release-device checks.
