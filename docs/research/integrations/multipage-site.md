---
integration: multipage-site
status: locally-verified
last_verified: 2026-10-18
selected_spec_version: Vite 8.3.4 / Vercel static configuration
selected_sdk: existing Vite 8.3.4 and React plugin 6.1.2
---

# Static website pages

## Scope and official sources

Serve six independent public HTML pages using the existing Vite build. No new router, hosted API, framework, or provider integration.

Official sources accessed 2026-10-18 UTC, in discovery order:

- [Vite documentation index](https://vite.dev/llms.txt).
- [Vite multipage build contract](https://vite.dev/guide/build.html#multi-page-app).
- [Vite appType](https://vite.dev/config/shared-options.html#apptype) and [build options](https://vite.dev/config/build-options.html#build-rolldownoptions).
- [Vite preview JavaScript API](https://vite.dev/guide/api-javascript.html#preview), used to check production files over local HTTP after building.
- Installed `vite@8.3.4` source: `node_modules/vite/dist/node/chunks/node.js`, `htmlFallbackMiddleware`; types in `node_modules/vite/dist/node/index.d.ts`.
- [Selected Vite release changelog](https://raw.githubusercontent.com/vitejs/vite/v8.3.4/packages/vite/CHANGELOG.md). No relevant multipage deprecation observed; use the documented `rolldownOptions` name.
- [Vercel documentation index](https://vercel.com/llms.txt), [configuration index](https://vercel.com/docs/project-configuration), and [clean URLs](https://vercel.com/docs/project-configuration/vercel-json#cleanurls).

## Verified contract

Vite accepts multiple HTML build inputs and preserves their filenames in output. `appType: "mpa"` retains HTML handling without a catch-all homepage fallback. The selected version's development middleware resolves `/product` to an existing `product.html`. Vercel's existing `cleanUrls: true` exposes static HTML without its extension. The existing public directory continues to supply installers and media unchanged.

Authentication, scopes, secrets, webhooks, retries, idempotency, quotas and provider retention are not applicable: these are public static GET/HEAD resources. No new visitor data collection, network service, credentials or JARVIS tool effects are introduced. The browser requests only the selected page's entry and shared assets; the optional face chunk belongs to home.

## Decisions and boundary

- Six native document destinations: home, product, integrations, how-it-works, install, roadmap. Normal links preserve browser history, refresh and new-tab behavior.
- Generate checked-in HTML metadata and sitemap from a small page catalog. Each document has its own entry, title, description and canonical URL.
- Keep existing hosting security headers and installer content-type rules. No SPA rewrite over installer endpoints or unknown URLs.
- Translate historical homepage hashes to their new destinations before mounting. Keep the film and hero hashes on home.
- Preserve existing capability limitations and dated verification claims when moving content. No changes to Rust ownership or trust boundaries.

A client router and framework migration were rejected as unnecessary runtime/dependency work for six static pages. Runtime SSR is not required; the React content remains client rendered, as before.

## Verification plan

Disprove the central routing assumption by building and serving the output with Vite preview in MPA mode, requesting every clean URL directly, refreshing it, and checking unique metadata. Check that an unknown path is 404 and both installer URLs return their original bytes. Verify entry separation, sitemap coverage and legacy anchor destinations. In Chromium, exercise page navigation, active/mobile links, back/forward, keyboard menus, installer tabs and policy tabs. Inspect narrow layouts and manual-only film playback. Existing reduced-motion face behavior remains required.

## Unresolved questions

Vercel production headers and redirect behavior need verification after a separately requested deployment. Native Safari/iOS and Android verification remains open. Neither blocks a locally reviewable implementation.

## Verification log

- 2026-10-18: live official documentation, installed source/types and selected release checked before implementation. Existing dependency versions retained.
- 2026-10-18: six-page build and local HTTP contract pass, including 404 and installer bytes; 22 frontend tests and installer parsers pass. Chromium layout checks cover all six destinations at 320–1440 pixels, page/history navigation, keyboard menus/tabs and manual film playback. Details in [the design record](../../DESIGN.md).
