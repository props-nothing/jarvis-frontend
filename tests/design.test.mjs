import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { pipeline, roadmap, roadmapReviewedAt } from "../src/content.ts";
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
  assert.equal(roadmapReviewedAt, "2026-10-13");
  assert.deepEqual(roadmap.map((section) => section.status), ["built", "experimental", "next", "planned"]);
  const section = (status) => roadmap.find((entry) => entry.status === status).items;
  assert.ok(section("built").some((item) => /knowledge search/i.test(item.name)));
  assert.match(section("experimental").find((item) => /ACP/.test(item.name)).note, /Codex tasks verified.*sign-in.*cancellation/);
  assert.match(section("experimental").find((item) => /calls/.test(item.name)).note, /Owner outbound.*Inbound.*broader proof/);
  assert.match(section("planned").find((item) => /workflow engine/.test(item.name)).note, /Parked/);
  assert.match(section("planned").find((item) => /downloads/.test(item.name)).note, /licence/);
  assert.match(read("src/components/Architecture.tsx"), /Worktrees, not OS isolation/);
  assert.doesNotMatch(read("src/components/Architecture.tsx"), /planned:\s*true/);
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