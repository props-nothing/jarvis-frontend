---
integration: frontend-visuals
status: adopted
last_verified: 2026-10-18
selected_spec_version: MediaPipe a908d668c730da128dfa8d9f6bd25d519d006692
selected_sdk: three 0.186.1; lucide-react 1.56.0; @types/three 0.186.0
---

# Website Visuals

## Scope

Render the same canonical face geometry used by the JARVIS HUD, locally in the public install website. Use named Lucide React icons for controls. No tracking, camera, microphone, assistant connection, provider API or runtime face recognition.

## Official Sources

Checked 2026-10-13:

- https://threejs.org/llms.txt
- https://threejs.org/docs/pages/WebGLRenderer.html
- https://threejs.org/docs/pages/BufferGeometry.html
- https://raw.githubusercontent.com/mrdoob/three.js/r186/examples/jsm/loaders/OBJLoader.js
- https://raw.githubusercontent.com/mrdoob/three.js/r186/src/renderers/WebGLRenderer.js
- https://lucide.dev/llms.txt
- https://lucide.dev/guide/react/getting-started.md
- https://lucide.dev/guide/react/advanced/accessibility.md
- https://raw.githubusercontent.com/google-ai-edge/mediapipe/a908d668c730da128dfa8d9f6bd25d519d006692/mediapipe/modules/face_geometry/data/canonical_face_model.obj
- https://raw.githubusercontent.com/google-ai-edge/mediapipe/a908d668c730da128dfa8d9f6bd25d519d006692/LICENSE

## Verified Contract

### Autonomous hero refresh (2026-10-18)

Rechecked the official `llms.txt` and renderer docs above, plus
https://threejs.org/docs/pages/BufferAttribute.html,
https://threejs.org/docs/pages/OrthographicCamera.html,
https://raw.githubusercontent.com/mrdoob/three.js/r186/src/core/BufferAttribute.js
and https://github.com/mrdoob/three.js/releases/tag/r186.
The installed 0.186.1 source confirms `setY`, `needsUpdate`, `setUsage` and camera
projection updates. No relevant contract change observed; versions stay pinned.
No repository-local llms index ships in the installed package.

Update the existing position attribute for eyelids and brows, flag it for GPU
upload, and reuse the same geometry/materials. Fit both camera axes to the scene
so narrow screens retain the whole face. Autonomous pose and expression timing
uses active animation time, never pointer coordinates. A native button triggers
a short energy response; reduced motion suppresses movement. Authentication,
privacy and limits remain as below. No new dependency or external operation.

The owner's follow-up removes visible pause/greeting controls. Rechecked
https://threejs.org/docs/pages/PointsMaterial.html and
https://threejs.org/docs/pages/Material.html, and the installed r186 material
source: vertex colors multiply material color; point size is in pixels and is
hardware bounded. Use small additive points, shared face geometry, a bounded
ambient particle buffer, and a vertex-color light sweep. No new texture or effect
dependency. Reduced motion remains static; pointer position remains unused.

Verification: check changing face pixels without pointer input, a click/keyboard
energy response, reduced-motion stillness, responsive
framing, and nonblank WebGL failure/context-loss fallback. Native device coverage
remains an open limitation.

Three.js uses WebGL2; WebGL1 support was removed in r163. `OBJLoader.parse` accepts local OBJ text and returns a group containing mesh geometry. `setAnimationLoop(null)` stops the renderer loop. Geometry, materials and renderer each need disposal. `setSize(width, height, false)` preserves CSS layout dimensions. The canonical face has 468 vertices and 898 triangles, with positive z pointing out of the face.

Lucide supports named, tree-shakable React imports. SVG props, including `aria-hidden`, are supported. Icon-only controls need accessible names on the button.

### Authentication, Limits And Privacy

No authentication, scopes, credentials, webhooks, retries, pagination, provider quotas or billing apply. Dependencies and geometry are bundled locally. No data leaves the browser. Use a pixel-ratio cap, stop off-screen and in hidden tabs, honor motion preferences; visible pause controls are omitted at the owner's request. A failed or lost WebGL context falls back to a local, static canvas projection.

### Versions And Compliance

Exact npm versions are pinned in the website manifest and lockfile. Three.js is MIT; Lucide is ISC with MIT portions. Preserve package license files when producing dependency notices. The unmodified face asset is Apache-2.0, Copyright 2019-2023 The MediaPipe Authors. Its upstream license is included at `public/licenses/mediapipe.txt`. No code or geometry is copied from the removed Python prototype.

## JARVIS Mapping And Decisions

Presentation only, outside Rust authority and domain boundaries. The scene does not claim to be a live assistant or expose simulated security telemetry. Reuse the actual HUD geometry, not a procedural approximation. Load Three.js through a separate lazy component so the install page remains usable while the scene loads. Reject an external model CDN, textures, bloom passes and a React 3D framework: unnecessary network, GPU and bundle costs.

## Verification Plan

The cheapest falsifier is parsing the bundled OBJ with the installed loader and checking exactly 898 finite triangles. Node tests also verify the upstream asset digest and that screenshot references and stale navigation targets are absent. Browser checks must prove nonblank desktop/mobile canvas pixels, autonomous movement, reduced-motion resize, context-loss fallback, no horizontal overflow and usable keyboard install/navigation/approval controls. Run website tests, typecheck, installer validation and production build.

## Unresolved Questions

No blocking API uncertainty. Integrated Chromium validation is not evidence of native Safari/iOS behavior. At the visual-research baseline the project license was undecided; **resolved 2026-10-14:** original platform and website code/docs now use Apache-2.0. MediaPipe and all other third-party notices remain separate; no geometry or provider contract changed.

## Design References

Reviewed Anthropic's frontend-design skill and Vercel's web-design-guidelines skill from their official repositories, plus the current https://openclaw.ai/ install-site structure. Adopt distinctive product imagery, direct installation, clear scope, visible focus, restrained motion and honest illustrative examples; do not copy another site's content or branding.
