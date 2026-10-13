import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

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