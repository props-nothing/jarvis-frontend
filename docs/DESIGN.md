# Design

Reviewed and redesigned 2026-10-13; hero, copy and multipage structure refreshed 2026-10-18. This repository is the public install site, not the authenticated Rust console.

## Direction

The actual JARVIS face is the defining visual. A large, unframed face occupies the right side of the desktop hero, beside a left-aligned name, short introduction and a compact installer. On phones the face leads a centered introduction. The hero installer has only macOS/Linux and Windows tabs, one command and a copy button; it has no explanation text or multiline source build. The Install page retains the detailed guide and source alternative. Repeated ownership slogans, the four-column summary, the closing pitch, and the Local-first / Owner-controlled badges beside the face are removed.

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

## Inner-page refinement, 2026-10-18

Reference: [OpenClaw Install](https://openclaw.ai/install), inspected live. Borrow the
clear reading column, compact title and direct route to installation. Keep JARVIS's
own palette and type: graphite `#080a0a`, surface `#101414`, text `#eef2ee`, supporting
text `#a1aeaa`, cyan `#68e7e0`. Bahnschrift/Avenir/Trebuchet remain the reading stack;
monospace is reserved for commands. The homepage face remains the visual signature.

Inner pages use a left-aligned 896 px content column (736 px for installation),
40 px titles and 24 px section headings. Install begins with its tabs and command;
two short follow-up steps lead to the console. Product uses unframed two-column
summaries, Integrations uses concise directory rows, and Roadmap uses expandable
evidence groups. How it works leads with three plain-language steps; policy and
architecture inspectors remain available on request. Native details elements retain
keyboard interaction and the full requirements, limitations and evidence.

```text
Shared navigation
Page title + one sentence
Primary task or short overview
Supporting sections with room between them
Optional detail / next destination
```

Critique before implementation: another set of large technical cards would repeat
the existing problem. Use spacing and meaningful headings instead of decorative
labels, colored icons, outlined numbers or additional animations. Retain essential
setup requirements and experimental labels where they affect a visitor's choice.

## Face And Motion

The unmodified canonical MediaPipe asset has 468 vertices and 898 triangles, matching the production HUD. Three.js renders cyan triangulation, illuminated eyes, a traveling light sweep and sparse orbiting fragments. A local rig turns and tilts the head, breathes, blinks, and moves the brows and jaw on its own timeline. Pointer position never drives movement. Click, tap, Enter or Space triggers a light pulse, a turn toward the visitor and a stronger facial response. The owner requested no visible pause control or greeting text. The face retains a native button with an accessible name and keyboard focus outline. It is an illustrative interaction, not connected to a daemon, model or microphone.

The loop stops under reduced motion, off-screen and in hidden tabs. Reduced motion disables the animation interaction. Resize still repaints, fitting both camera axes so the enlarged face stays in frame on narrow screens. WebGL2 failure or context loss displays a static 2D projection and disables the animation button. Geometry, materials, renderer, observers and event listeners are disposed on unmount. The canvas is capped at 1.5 device-pixel ratio; animation updates do not render React every frame.

The policy inspector and architecture connection wires do not animate continuously. Scroll reveals cannot hide page content.

## Film

Added 2026-10-17, revised 2026-10-18. "Watch it work" follows the three short homepage use cases: a 59-second film of one request moving through the web, mail and calendar, files, memory, agents, schedules, an approval and voice. It is rendered offline from the production console's own `head.js` face and `mission.js` live mission view, driven by a scripted run with JARVIS's real tool names. The request, files and messages are examples, and the section says so in plain text under the player. It is a visualization, not a recording, and is not presented as one.

Only the poster loads initially. The film source is attached after the visitor chooses Play or a chapter; there is no autoplay, loop or automatic resume, including under reduced motion. It pauses when off screen or in a hidden tab. Wide screens (1100 px and up) get the 1080p file, others the 720p file. Native video controls provide seeking, sound and playback after starting. Nine chapter buttons are tucked into a disclosure below the plain-language visualization note. A browser that cannot decode H.264 is offered the MP4 link instead of an empty player. Media are self-hosted under `public/media/` and allowed by the existing `default-src 'self'` policy.

## Interactive Sections

The owner removed the entire "Less chatting. More doing." workflow-demo section on 2026-10-18. The hero now leads into three short use cases, the manual film and two links to deeper pages; no workflow demo is rendered or imported by the page. The earlier reducer and its tests remain as historical implementation coverage.

How it works leads with a three-step explanation and concise permission/data guidance. An expandable policy inspector retains the authority boundary, seven keyboard-accessible gate tabs and labelled explanation panel. The architecture disclosure retains its Rust-centered blueprint with separate interface, reasoning, capability and local-storage lanes. ACP and phone providers remain experimental; worktrees are explicitly not operating-system isolation. Roadmap has four expandable evidence states, with Available now initially open and a dated acceptance-backlog link. The FAQ is removed entirely.

## Accessibility And Content

Install and policy tabs support arrow-key wrapping, Home/End and labelled panels. Copy success/failure is announced; changing methods invalidates stale requests. Icon controls have button labels and titles. The film describes hypothetical outcomes, never real sent mail or written files.

Mobile navigation uses ordinary links and a disclosure button, not a modal or fake menubar. Opening resets the dropdown scroll and focuses the first link. Escape restores toggle focus; outside pointer/focus dismisses; page links use native document navigation and active pages expose `aria-current`. Breakpoint changes clear expanded state. Icons stay centered, safe-area insets are respected, and a bounded dropdown scrolls on short screens. No body-scroll lock or focus trap was added to this nonmodal menu.

The platform table includes recorded Ubuntu evidence. Tool discovery and model routing are no longer presented as unbuilt. The 2026-10-16 evidence update distinguishes passed Windows `codex-acp 2.2.2` cancellation from still-open fresh sign-in, other-agent/platform cancellation and complete website delivery. Broader call verification remains open. Source-install prerequisites remain visible. Apache-2.0 is selected for original code/docs; [public unsigned c48 archives](https://github.com/props-nothing/jarvis-core/releases/tag/ci-c48da8880e20304da4b13e4016d896ad22fc2e04) are verified, while a generated dependency-license inventory, signing/notarization and clean-machine distribution checks remain. Screenshot social metadata is removed. The dated design/browser measurements below retain their original scope.

## Performance And Verification

2026-10-18 inner-page refinement: all 22 frontend tests, TypeScript/production
build, six-page HTTP/asset checks and documentation links pass. Installer script
bytes are unchanged. Chromium checks cover all five inner pages at 320, 768 and
1440 pixels, with every disclosure expanded: one H1 per page and no horizontal
page overflow. The 390-pixel Install view keeps all three method labels on one
line; long commands scroll within their own area. Installer keyboard navigation,
source requirements, copy confirmation, Product/Integration details, policy tabs,
Roadmap expansion and mobile-menu Escape/focus behavior pass. The homepage retains
its two-tab quick installer and face. No application console errors observed.
Desktop and mobile previews are saved in the task's visualization directory.
Native Safari/iOS/Android checks and deployment are not claimed.

The required core baseline also passes: `cargo fmt --check`, strict workspace
Clippy and `cargo test --workspace` including doc tests (3,305 passed, 8 ignored).
Logs are in the outer workspace's ignored `target/calm-pages-*.log`. This revision
does not change Rust sources, dependencies or external service contracts.

2026-10-18 compact installer follow-up: the installer is visible beneath the hero
text, replacing the extra install CTA. Keyboard wrapping between two platform tabs
and copy confirmation pass in Chromium. The box contains one line and no note;
layout checks at widths 320, 390, 768 and 1440 find no horizontal page overflow.
At 390 × 844 its bottom is at 806 pixels. The existing large face is unchanged.
The focused 15-test suite, TypeScript/build and six-page HTTP checks pass.
This presentation change does not alter installer scripts or Rust code.

2026-10-18 refresh: all 19 frontend tests, installer syntax checks, TypeScript /
production build, whitespace and documentation links pass. Main JavaScript is
86.23 kB gzip; the lazy face is 153.75 kB gzip and retains Vite's existing large
chunk advisory. Integrated Chromium checks cover 320, 390, 768 and 1440 pixel
layouts without horizontal overflow, autonomous pose changes without pointer
input, click and keyboard activation, absent pause/greeting/workflow UI, and a
static reduced-motion render with the interaction disabled. The 390-pixel
WebGL-unavailable fixture paints 30,486 fallback pixels. The final 390-pixel
scene measures 339 by 377 CSS pixels, versus the former 200-pixel scene height.
Native Safari/iOS/Android and deployment remain unverified.

Rust baseline checks: formatting and strict workspace Clippy pass. The workspace
run reports 3,293 passing tests and eight ignored before a `DesignedVoice`
doctest compilation error in concurrently changing core voice code. After that
export was present, `cargo test --workspace --doc` passed. This frontend change
does not modify Rust sources; no fresh full-workspace rerun is claimed after the
concurrent core changes.

### Calmer multipage structure: review, 2026-10-18

Reviewed the current [OpenClaw homepage](https://openclaw.ai/),
[installation page](https://openclaw.ai/install),
[integrations directory](https://openclaw.ai/integrations) and
[ecosystem page](https://openclaw.ai/ecosystem). Its useful pattern is a shared
navigation with dedicated destination pages and short links into deeper material.
Its homepage itself is still long and includes moving social content; JARVIS can
be calmer by keeping less on the landing page.

Implemented navigation: Product, Integrations, How it works, Docs, with Install
as the primary action. Put Roadmap, GitHub and legal links in the footer.

| Destination | Content |
| --- | --- |
| `/` | Large autonomous face, concise introduction, three practical use cases, one film preview and links to the deeper pages |
| `/product` | The existing twelve capabilities, grouped by everyday work, knowledge and automation; full limitations stay beside the relevant feature |
| `/integrations` | Google, Telegram, models, voice and MCP; distinguish built-in support, adapters and experimental paths |
| `/how-it-works` | The existing policy inspector and architecture, explained in plain language before technical detail |
| `/install` | One installer, prerequisites, first run, platform evidence, service setup and troubleshooting links |
| `/roadmap` | The existing dated delivery/verification states and acceptance links |

Below the hero, use a flat graphite background without the fixed grid, a narrower
reading width, quiet headings and generous spacing. Limit accents to actions and
meaningful status. Make the film play on request and keep continuous motion in the
hero. Replace the twelve-card homepage grid and large technical diagrams with
short summaries linking to their destination pages.

Implemented with six static HTML entries, shared React layout and native page links.
The [page catalog](../src/site.ts) generates distinct document metadata and the
sitemap. Vite MPA mode and Vercel clean URLs keep direct loads and refreshes working,
with a real 404 for unknown paths. Historical hashes redirect to their new pages;
initial section fragments scroll after React mounts. The optional face is reachable
only from the home entry. Installer script URLs, bytes and hosting headers are
preserved. No dependencies or framework migration were added. The external build
contract is recorded in [multipage-site.md](research/integrations/multipage-site.md).

### Multipage implementation verification, 2026-10-18

- All 22 frontend tests pass, including metadata/sitemap coverage, historical
  destinations, capability grouping and manual film contracts. Both installer
  parsers pass.
- TypeScript and production build pass. The local HTTP check verifies all six
  clean URLs, title/canonical metadata, referenced assets, face chunk isolation,
  unknown-route 404 and unchanged installer bytes. This check is now part of CI.
- Chromium: all six pages render with one H1 and no horizontal overflow at viewport
  widths 320, 390, 720, 1024 and 1440. Native mobile-menu opening focuses Product;
  Escape closes and returns focus. Policy/installer arrow keys, active page links,
  refresh and browser back/forward pass.
- Direct and same-document historical hashes reach the right destination; a direct
  architecture fragment is positioned after rendering. The film begins with no
  source and time zero, plays after clicking, pauses off screen and stays paused
  when revisited. No application console errors observed.
- The shared script is about 75.83 kB gzip, home adds 3.09 kB, and CSS is 6.22 kB.
  The existing optional face is 153.76 kB gzip and retains Vite's size advisory.
- Native Safari/iOS/Android verification, pushed CI and deployment are not claimed.
- Required core baseline also passes for this revision: `cargo fmt --check`,
  strict workspace Clippy and `cargo test --workspace`, including doc tests:
  3,304 passed, 8 ignored. Logs are in the outer workspace's ignored
  `target/multipage-*.log`. This task changed no Rust source.

### Earlier verification history

The film adds no script weight beyond its component. The poster is about 75 kB and loads with the page; the 720p film (about 6 MB) or 1080p film (about 11.5 MB) loads only near the section. Size budgets are enforced by a Node test.

The main script is about 88 kB gzip and CSS about 7 kB. The lazy face scene adds about 153 kB gzip, including geometry. This is an intentional cost for a real interactive face; install controls do not wait for it. Vite reports the scene's minified chunk above 500 kB. No remote textures, asset CDN, telemetry or provider calls were added. Third-party licenses ship under `public/licenses/`.

Node tests check the pinned asset, navigation/FAQ removal, roadmap classifications, gate ordering, menu contracts and the workflow reducer's approval/pause/stop/stale-tick behavior. Installer regressions remain in the same test command. Integrated Chromium checks cover keyboard menus/tabs, clipboard feedback, all three workflows, source inspection, approval/denial, replay, pause/resume/stop, scenario replacement and outcome focus.

The initial redesign on 2026-10-13 passed 24 Node tests, typecheck/build and installer contracts, with no editor or normal-load browser errors. Renderer instrumentation observed 12 draw calls during motion and zero during pause, reduced motion and off-screen intervals. Forced context loss produced 8,068 painted fallback pixels and restored successfully. A fresh WebGL-unavailable load produced 12,164 painted pixels. Pause/replay hit areas are 44x44 pixels.

Follow-up verification on 2026-10-13: all 30 Node tests, typecheck/production build and whitespace checks pass. A fresh browser load reports no runtime exceptions. All changed sections pass width/clip checks at 320, 390, 768, 1024, 1440 and 1920 pixels. Menu checks also cover 844x240, including last-link scroll followed by Escape/reopen with the first link visible. Native Safari/iOS and Android checks remain open.

Layout checks pass at 320x568, 320x640, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080 and 844x390: no horizontal page overflow, hero actions stay on one row and the next install section is visible. Canvas-pixel checks prove a rendered face on desktop and mobile. These checks are not native Safari/iOS or Android evidence; those remain release-device checks.
