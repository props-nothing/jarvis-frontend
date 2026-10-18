import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pages, legacyDestination } from "../src/site.ts";
import { SITE_URL } from "../src/config.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("each public destination has unique document metadata, an entry and a sitemap URL", () => {
  assert.deepEqual(pages.map((page) => page.path), ["/", "/product", "/integrations", "/how-it-works", "/install", "/roadmap"]);
  assert.equal(new Set(pages.map((page) => page.title)).size, pages.length);
  assert.equal(new Set(pages.map((page) => page.description)).size, pages.length);
  for (const page of pages) {
    const html = read(page.file);
    assert.ok(html.includes(`<title>${page.title}</title>`));
    assert.ok(html.includes(`name="description" content="${page.description}"`));
    assert.ok(html.includes(`rel="canonical" href="${SITE_URL}${page.path}"`));
    assert.ok(html.includes(`property="og:url" content="${SITE_URL}${page.path}"`));
    assert.ok(html.includes(`src="/src/entries/${page.id}.tsx"`));
    assert.ok(read(`src/entries/${page.id}.tsx`).includes(`mount("${page.id}",`));
    assert.ok(read("public/sitemap.xml").includes(`<loc>${SITE_URL}${page.path}</loc>`));
  }
});

test("historical section links lead to the new page without capturing home anchors", () => {
  const moved = {
    "#capabilities": "/product", "#trust": "/how-it-works#trust",
    "#architecture": "/how-it-works#architecture", "#install": "/install", "#roadmap": "/roadmap",
  };
  for (const [hash, destination] of Object.entries(moved)) assert.equal(legacyDestination(hash), destination);
  for (const hash of ["", "#top", "#film", "#everyday", "#missing", "toString"]) assert.equal(legacyDestination(hash), undefined);
});

test("public HTML routing preserves installer and security contracts", () => {
  const config = JSON.parse(read("vercel.json"));
  assert.equal(config.cleanUrls, true);
  assert.equal(config.rewrites, undefined, "no catch-all homepage rewrite");
  for (const path of ["/install.sh", "/install.ps1"]) {
    const headers = config.headers.find((entry) => entry.source === path).headers;
    assert.ok(headers.some((header) => header.key === "Content-Type" && header.value.startsWith("text/plain")));
    assert.ok(headers.some((header) => header.key === "X-Content-Type-Options" && header.value === "nosniff"));
  }
  assert.match(read("vite.config.ts"), /appType: "mpa"/);
});
