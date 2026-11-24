// Static checks for the published site. No dependencies: run with `node --test tests/`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://younoahlab.com";

const htmlFiles = [
  "index.html",
  "privacy.html",
  ...readdirSync(join(root, "how")).filter((f) => f.endsWith(".html")).map((f) => `how/${f}`),
];
const read = (f) => readFileSync(join(root, f), "utf8");

test("every page declares a language, a title and a description", () => {
  for (const f of htmlFiles) {
    const html = read(f);
    assert.match(html, /<html[^>]*\blang="[a-z]{2}/i, `${f}: missing <html lang>`);
    assert.match(html, /<title>[^<]{5,}<\/title>/, `${f}: missing or empty <title>`);
    if (f !== "index.html" || /name="description"/.test(html)) {
      assert.match(html, /<meta name="description" content="[^"]{20,}"/, `${f}: missing meta description`);
    }
  }
});

test("article pages have a canonical URL that matches their path", () => {
  for (const f of htmlFiles.filter((f) => f.startsWith("how/") && f !== "how/index.html")) {
    const m = read(f).match(/<link rel="canonical" href="([^"]+)"/);
    assert.ok(m, `${f}: no canonical link`);
    assert.equal(m[1], `${SITE}/${f}`, `${f}: canonical does not match file path`);
  }
});

test("internal links and assets resolve to files in the repo", () => {
  const missing = [];
  for (const f of htmlFiles) {
    const html = read(f);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)/g)) {
      if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url)) continue;
      if (/['+`${}]/.test(url)) continue; // URL built in script code, not a static link
      const target = url.startsWith("/") ? join(root, url) : join(root, dirname(f), url);
      const candidates = [target, join(target, "index.html"), `${target}.html`];
      if (!candidates.some((c) => existsSync(c))) missing.push(`${f} -> ${url}`);
    }
  }
  assert.deepEqual(missing, [], `broken internal links:\n${missing.join("\n")}`);
});

test("sitemap lists every article page and only real pages", () => {
  const locs = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    assert.ok(loc.startsWith(`${SITE}/`), `foreign URL in sitemap: ${loc}`);
    const path = loc.slice(SITE.length + 1);
    const file = path === "" ? "index.html" : path.endsWith("/") ? `${path}index.html` : path;
    assert.ok(existsSync(join(root, file)), `sitemap entry has no file: ${loc}`);
  }
  for (const f of htmlFiles.filter((f) => f.startsWith("how/") && f !== "how/index.html")) {
    assert.ok(locs.includes(`${SITE}/${f}`), `sitemap is missing ${f}`);
  }
});

test("no third-party trackers or cookies are set by the pages", () => {
  const trackers = /(googletagmanager|google-analytics|gtag\(|facebook\.net|hotjar|segment\.com|document\.cookie\s*=)/i;
  for (const f of htmlFiles) assert.doesNotMatch(read(f), trackers, `${f}: tracker or cookie write found`);
});

test("web app manifest is valid JSON with the required fields", () => {
  const m = JSON.parse(read("manifest.webmanifest"));
  for (const k of ["name", "start_url", "icons"]) assert.ok(m[k], `manifest missing ${k}`);
  for (const icon of m.icons) assert.ok(existsSync(join(root, icon.src.replace(/^\//, ""))), `icon missing: ${icon.src}`);
});

test("phone layout only shortens the header switch, not the switches inside labs", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /(?<!header )\.switch span\{font-size:0\}/, "an unscoped .switch rule hides every lab toggle label on phones");
});

test("home page has a Help button and links to the privacy page", () => {
  const html = read("index.html");
  assert.match(html, /id="helpBtn"/, "no Help button in the header");
  assert.match(html, /href="privacy\.html"/, "home page does not link to privacy.html");
});
