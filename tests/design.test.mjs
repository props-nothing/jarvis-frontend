import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { features, pipeline, platforms, projectLicense, roadmap, roadmapReviewedAt } from "../src/content.ts";
import { demoReducer, demoScenarios, initialDemoState } from "../src/demoFlow.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the JARVIS mask is the unmodified, pinned canonical HUD face", () => {
  const asset = read("src/assets/canonical-face.obj");
  assert.equal(createHash("sha256").update(asset).digest("hex"), "8bac80443397e113f41a8b565ea72c59390bc031d9defab289dba7bc0c54e618");
  const group = new OBJLoader().parse(asset);
  assert.equal(group.children.length, 1);
  const mesh = group.children[0];
  const positions = mesh.geometry.getAttribute("position");
  assert.equal(positions.count, 898 * 3);
  assert.ok(Array.from(positions.array).every(Number.isFinite));
  mesh.geometry.computeBoundingBox();
  const bounds = mesh.geometry.boundingBox;
  assert.ok(bounds.min.y < -9 && bounds.max.y > 8, "the chin and forehead are present");
  assert.ok(bounds.max.z > 7.5, "the nose protrudes from the face");
  mesh.geometry.dispose();
  mesh.material.dispose();
  assert.match(read("public/licenses/mediapipe.txt"), /Apache License/);
});

test("all navigation targets exist, with no obsolete screenshot or orb", () => {
  const app = read("src/App.tsx");
  const navigation = read("src/components/Nav.tsx");
  const ids = new Set([...app.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of navigation.matchAll(/\["([a-z]+)",\s*"/g)) {
    assert.ok(ids.has(target), `missing navigation target: ${target}`);
  }
  assert.doesNotMatch(app, /console\.jpg|<Orb|id="console"/);
  assert.doesNotMatch(app, /id="faq"|faqs/);
  assert.doesNotMatch(navigation, /"faq"|"FAQ"/);
  assert.doesNotMatch(read("src/content.ts"), /export const faqs/);
  assert.doesNotMatch(read("src/styles.css"), /\.faq\b/);
  assert.doesNotMatch(read("index.html"), /console\.jpg/);
  assert.equal(existsSync(new URL("../public/console.jpg", import.meta.url)), false);
  assert.match(app, /lazy\(\(\) => import\("\.\/components\/JarvisMask"\)\)/);
  assert.match(app, /Pause face animation/);
});

test("the public site uses bounded type and does not hide content behind animation", () => {
  const styles = read("src/styles.css");
  assert.doesNotMatch(styles, /font-size:[^;]*vw/);
  assert.doesNotMatch(styles, /letter-spacing:\s*-/);
  assert.doesNotMatch(styles, /transition:\s*all/);
  assert.match(styles, /\[data-reveal\]\s*\{\s*opacity:\s*1/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("roadmap distinguishes delivered capability, limited proof and deliberate deferral", () => {
  assert.equal(roadmapReviewedAt, "2026-10-16");
  assert.deepEqual(roadmap.map((section) => section.status), ["built", "experimental", "next", "planned"]);
  const section = (status) => roadmap.find((entry) => entry.status === status).items;
  assert.ok(section("built").some((item) => /knowledge search/i.test(item.name)));
  assert.match(section("experimental").find((item) => /ACP/.test(item.name)).note, /In-place jobs.*independent checks.*real Codex dependency-install check passed.*Windows Codex cancellation is verified.*full website delivery, fresh sign-in and other-agent\/platform cancellation remain open/);
  assert.match(section("experimental").find((item) => /calls/.test(item.name)).note, /Owner outbound.*Inbound.*broader proof/);
  assert.match(section("planned").find((item) => /workflow engine/.test(item.name)).note, /Parked/);
  assert.match(section("built").find((item) => /Open-source/.test(item.name)).note, /Apache-2\.0/);
  assert.match(section("planned").find((item) => /Signed distribution/.test(item.name)).note, /Public unsigned prerelease archives are verified.*dependency-license inventory.*signing\/notarization.*clean-machine.*website installers still build from source/);
  assert.match(platforms.find((platform) => /macOS/.test(platform.os)).state, /Native CI passed.*Intel runtime smoke and clean-machine acceptance pending/);
  assert.match(read("src/components/Architecture.tsx"), /In-place or worktree jobs, without OS isolation/);
  assert.match(read("src/components/Architecture.tsx"), /Windows Codex cancellation verified.*fresh sign-in and other agents\/platforms need proof/);
  assert.doesNotMatch(read("src/components/Architecture.tsx"), /planned:\s*true/);
});

test("capability copy preserves tool limits and does not promise universal access or exact recovery", () => {
  const feature = (tag) => features.find((entry) => entry.tag === tag);
  assert.equal(features.length, 12);
  assert.match(feature("Files").body, /recoverable \.jarvis-trash.*never a permanent purge/);
  assert.match(feature("Web").body, /configured key.*ask by default/);
  assert.match(feature("Google").body, /Gmail Trash.*new sign-in/);
  assert.match(feature("Autonomy").body, /one new continuation.*not exact replay.*Docker/);
  assert.match(feature("MCP").body, /named keys.*browser sign-in.*registered provider app.*compatibility still needs verification/);
  assert.match(feature("Voice").body, /browser support.*not offline local voice/);
  assert.match(feature("Documents").body, /existing XLSX.*formulas are not recalculated/);
  assert.match(feature("Contacts").body, /do-not-contact.*Authorized deletion removes the contact and its suppression.*permission policy/);
  assert.match(feature("Experimental").body, /Independent checks report separately.*not a sandbox.*no automatic commit, merge or push/);
  const app = read("src/App.tsx");
  const icons = app.match(/const featureIcons = \[([^\]]+)\]/)[1].split(",");
  assert.equal(icons.length, features.length);
  assert.doesNotMatch(read("src/content.ts"), /Add any MCP server|always ask you first|resume after a restart|Blocked on the owner choosing/);
  assert.match(app, /illustrative, not live runs/);
  assert.doesNotMatch(app, /jarvis stop && jarvis service install/);
});

test("Apache-2.0 metadata and served notices remain consistent without relicensing third parties", () => {
  assert.equal(projectLicense.spdx, "Apache-2.0");
  assert.equal(JSON.parse(read("package.json")).license, projectLicense.spdx);
  assert.equal(JSON.parse(read("package-lock.json")).packages[""].license, projectLicense.spdx);
  const license = read("LICENSE");
  assert.equal(createHash("sha256").update(license).digest("hex"), "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30");
  assert.equal(read(`public${projectLicense.path}`), license);
  assert.match(read(".gitattributes"), /\/LICENSE text eol=lf/);
  assert.match(read(".gitattributes"), /public\/licenses\/\*\.txt text eol=lf/);
  assert.match(read("src/App.tsx"), /href=\{projectLicense.path\}/);
  const notice = read("public/licenses/notice.txt");
  for (const [, path] of notice.matchAll(/\/licenses\/([\w.-]+\.txt)/g)) {
    assert.ok(read(`public/licenses/${path}`).length > 500, `missing license text: ${path}`);
  }
  assert.match(notice, /React.*React DOM.*Scheduler/);
  const react = read("node_modules/react/LICENSE");
  assert.equal(read("public/licenses/react.txt"), react);
  assert.equal(read("node_modules/react-dom/LICENSE"), react);
  assert.equal(read("node_modules/scheduler/LICENSE"), react);
  assert.match(read("NOTICE"), /CC BY-NC 4\.0.*prototype/);
  assert.match(read("README.md"), /Third-party|third-party|respective licenses/);
});

test("policy inspection preserves gate order and accessible labelled controls", () => {
  assert.deepEqual(pipeline.map((gate) => gate.step), ["Schema", "Authenticate", "Authorize", "Risk", "Approval", "Execute", "Audit"]);
  assert.ok(pipeline.every((gate) => gate.detail.length > 40));
  const component = read("src/components/Pipeline.tsx");
  assert.match(component, /role="tablist"/);
  assert.match(component, /role="tabpanel"/);
  assert.match(component, /aria-selected=/);
  assert.match(component, /aria-labelledby=/);
  assert.match(component, /ArrowRight/);
  assert.match(component, /ArrowLeft/);
  assert.match(component, /case "Home"/);
  assert.match(component, /case "End"/);
  assert.doesNotMatch(component, /setInterval|setTimeout|onMouseEnter/);
});

test("mobile navigation retains dismissal, focus and bounded-layout contracts", () => {
  const navigation = read("src/components/Nav.tsx");
  assert.match(navigation, /aria-expanded=\{open\}/);
  assert.match(navigation, /querySelector<HTMLAnchorElement>\("a"\)\?\.focus/);
  assert.match(navigation, /links\.current\.scrollTop = 0/);
  assert.match(navigation, /addEventListener\("pointerdown", outside\)/);
  assert.match(navigation, /addEventListener\("focusin", outside\)/);
  assert.match(navigation, /removeEventListener\("pointerdown", outside\)/);
  assert.match(navigation, /removeEventListener\("focusin", outside\)/);
  assert.match(navigation, /desktop\.addEventListener\("change", resize\)/);
  assert.match(navigation, /target\?\.focus\(\{ preventScroll: true \}\)/);
  const styles = read("src/styles.css");
  assert.match(styles, /\.nav__actions \.nav__menu \{ display: inline-grid/);
  assert.match(styles, /max-height: calc\(100dvh - 96px - env\(safe-area-inset-bottom\)\)/);
});

const tick = (state) => demoReducer(state, { type: "tick", runId: state.runId, step: state.step });

test("illustrative workflows cannot advance through an approval without an owner decision", () => {
  for (const scenario of demoScenarios.filter((entry) => entry.approval)) {
    let state = demoReducer(initialDemoState, { type: "select", scenarioId: scenario.id });
    state = demoReducer(state, { type: "start" });
    for (let step = 0; step < scenario.steps.length; step += 1) state = tick(state);
    assert.equal(state.status, "approval");
    assert.equal(state.step, scenario.steps.length - 1);
    assert.deepEqual(tick(state), state);
    assert.equal(tick(demoReducer(state, { type: "approve" })).status, "completed");
    const denied = demoReducer(state, { type: "deny" });
    assert.equal(denied.status, "denied");
    assert.deepEqual(tick(denied), denied);
  }
});

test("pause, stop and scenario changes reject stale illustrative-workflow ticks", () => {
  const running = demoReducer(initialDemoState, { type: "start" });
  const paused = demoReducer(running, { type: "pause" });
  assert.deepEqual(tick(paused), paused);
  assert.equal(tick(demoReducer(paused, { type: "resume" })).step, 1);
  const stopped = demoReducer(running, { type: "stop" });
  assert.deepEqual(tick(stopped), stopped);
  const changed = demoReducer(running, { type: "select", scenarioId: "research" });
  const restarted = demoReducer(changed, { type: "start" });
  assert.deepEqual(demoReducer(restarted, { type: "tick", runId: running.runId, step: 0 }), restarted);
  assert.equal(restarted.decision, null);
  assert.equal(demoReducer(running, { type: "approve" }).decision, null);
});

test("a read-only illustrative workflow completes without an approval or persistent effect", () => {
  let state = demoReducer(initialDemoState, { type: "select", scenarioId: "research" });
  state = demoReducer(state, { type: "start" });
  for (const step of demoScenarios.find((entry) => entry.id === "research").steps) {
    assert.equal(step.approval, undefined);
    state = tick(state);
  }
  assert.equal(state.status, "completed");
  assert.equal(state.decision, null);
});

test("the capability film is lazy, honest about being a rendered visualization, and respects reduced motion", async () => {
  const { film } = await import("../src/content.ts");
  const component = read("src/components/Film.tsx");
  const app = read("src/App.tsx");
  assert.match(app, /id="film"/);
  assert.match(read("src/components/Nav.tsx"), /\["film",\s*"Watch"\]/);
  assert.match(component, /preload="none"/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /userPaused/);
  assert.match(component, /muted=\{muted\}/);
  assert.match(film.disclosure, /scripted run/);
  assert.match(film.disclosure, /not a recording of a live session/);
  assert.equal(film.chapters.length, 9);
  for (let i = 1; i < film.chapters.length; i += 1) assert.ok(film.chapters[i].at > film.chapters[i - 1].at);
  assert.ok(film.chapters.at(-1).at < film.durationSeconds);
  for (const [file, limit] of [["jarvis-film.mp4", 12e6], ["jarvis-film-720.mp4", 7e6], ["jarvis-film-poster.jpg", 2e5]]) {
    const url = new URL(`../public/media/${file}`, import.meta.url);
    assert.ok(existsSync(url), `missing ${file}`);
    assert.ok(statSync(url).size < limit, `${file} exceeds its size budget`);
  }
});
