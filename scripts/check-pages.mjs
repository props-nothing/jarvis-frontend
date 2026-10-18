import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { preview } from "vite";
import { pages } from "../src/site.ts";
import { SITE_URL } from "../src/config.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const manifest = JSON.parse(read("dist/.vite/manifest.json"));
const server = await preview({ root, preview: { host: "127.0.0.1", port: 0, open: false } });
try {
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  for (const page of pages) {
    const response = await fetch(`${origin}${page.path}`);
    assert.equal(response.status, 200, page.path);
    assert.match(response.headers.get("content-type"), /text\/html/);
    const html = await response.text();
    assert.ok(html.includes(`<title>${page.title}</title>`), page.path);
    assert.ok(html.includes(`rel="canonical" href="${SITE_URL}${page.path}"`), page.path);
    for (const [, path] of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      assert.equal((await fetch(`${origin}${path}`)).status, 200, path);
    }
    const reachable = new Set();
    const visit = (key) => {
      if (reachable.has(key)) return;
      reachable.add(key);
      for (const dependency of [...(manifest[key].imports ?? []), ...(manifest[key].dynamicImports ?? [])]) visit(dependency);
    };
    visit(page.file);
    assert.equal(reachable.has("src/components/JarvisMask.tsx"), page.id === "home", `face isolation: ${page.path}`);
    console.log(`PASS ${page.path}: direct document, metadata, assets, face isolation`);
  }
  assert.equal((await fetch(`${origin}/page-that-does-not-exist`, { headers: { Accept: "text/html" } })).status, 404);
  for (const file of ["install.sh", "install.ps1"]) {
    const response = await fetch(`${origin}/${file}`);
    assert.equal(response.status, 200);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), read(`public/${file}`));
  }
  console.log("PASS unknown route returns 404; installer bytes remain intact.");
} finally {
  await server.close();
}
