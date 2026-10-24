// No dependencies or live services. Node 22.13+ provides WebCrypto + node:sqlite.
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs/promises";
import { randomUUID, webcrypto } from "node:crypto";

const root = new URL("../", import.meta.url);
const sources = new Map();
async function moduleSource(path) {
  if (sources.has(path)) return sources.get(path);
  let code = await readFile(new URL(path, root), "utf8");
  const imports = [...code.matchAll(/from "([^"]+)"/g)];
  for (const match of imports) {
    if (!match[1].startsWith(".")) continue;
    const resolved = new URL(match[1], new URL(path, root));
    const nextPath = decodeURIComponent(resolved.pathname.slice(root.pathname.length));
    code = code.replace(match[0], `from "${await moduleSource(nextPath)}"`);
  }
  const url = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  sources.set(path, url);
  return url;
}
const collector = await import(await moduleSource("functions/api/stats/event.js"));
const config = await import(await moduleSource("functions/api/stats/config.js"));
const report = await import(await moduleSource("functions/ops/analytics/report.js"));
const dashboard = await import(await moduleSource("functions/ops/analytics.js"));
const migration = await readFile(new URL("migrations/0001_bros_stats.sql", root), "utf8");

class D1Statement {
  constructor(db, sql, values = []) { this.db = db; this.sql = sql; this.values = values; }
  bind(...values) { return new D1Statement(this.db, this.sql, values); }
  async run() {
    const out = this.db.raw.prepare(this.sql).run(...this.values);
    return { success: true, meta: { changes: Number(out.changes) }, results: [] };
  }
  async all() { return { success: true, results: this.db.raw.prepare(this.sql).all(...this.values) }; }
}
class D1 {
  constructor() { this.raw = new DatabaseSync(":memory:"); this.raw.exec(migration); }
  prepare(sql) { return new D1Statement(this, sql); }
  async batch(statements) {
    this.raw.exec("BEGIN");
    try {
      const results = [];
      for (const stmt of statements) results.push(await (/^\s*SELECT/i.test(stmt.sql) ? stmt.all() : stmt.run()));
      this.raw.exec("COMMIT");
      return results;
    } catch (error) { this.raw.exec("ROLLBACK"); throw error; }
  }
}
const db = new D1();
const issuer = "https://bros-stats-test.cloudflareaccess.com";
const audience = "test-audience-123456789";
const env = {
  STATS_ENABLED: "true", STATS_DB: db, STATS_ACCESS_TEAM_DOMAIN: issuer,
  STATS_ACCESS_AUD: audience, STATS_ADMIN_EMAILS: "owner@example.test",
  ASSETS: { fetch: async (request) => {
    const path = new URL(request.url).pathname;
    if (path.endsWith('.html')) return Response.redirect('https://broswisata.id/assets/bros-stats-dashboard', 301);
    assert.equal(path, '/assets/bros-stats-dashboard');
    return new Response("<!doctype html><h1>Private shell</h1>");
  } }
};
const pair = await webcrypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
jwk.kid = "test-key"; jwk.alg = "RS256"; jwk.use = "sig";
const originalFetch = globalThis.fetch;
let jwksCalls = 0;
globalThis.fetch = async (url) => {
  assert.equal(url, `${issuer}/cdn-cgi/access/certs`);
  jwksCalls++;
  return Response.json({ keys: [jwk] });
};
const encode = (value) => Buffer.from(typeof value === "string" ? value : JSON.stringify(value)).toString("base64url");
async function token(overrides = {}, headerOverrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const header = encode({ alg: "RS256", kid: "test-key", ...headerOverrides });
  const body = encode({ iss: issuer, aud: [audience], iat: now - 1, nbf: now - 1, exp: now + 3600, email: "owner@example.test", ...overrides });
  const signature = await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", pair.privateKey, Buffer.from(`${header}.${body}`));
  return `${header}.${body}.${Buffer.from(signature).toString("base64url")}`;
}
function event(overrides = {}) {
  return { id: randomUUID(), session: randomUUID(), event: "page_view", path: "/id/", source: "google", device: "mobile", ...overrides };
}
function beacon(value, options = {}) {
  return new Request("https://broswisata.id/api/stats/event", {
    method: "POST", headers: { Origin: "https://broswisata.id", "Content-Type": "application/json", ...options.headers },
    body: typeof value === "string" ? value : JSON.stringify(value)
  });
}
async function send(value, options = {}, bindings = env) { return collector.onRequest({ request: beacon(value, options), env: bindings }); }
function checkPrivate(response) {
  assert.match(response.headers.get("Cache-Control"), /no-store/);
  assert.match(response.headers.get("X-Robots-Tag"), /noindex/);
  assert.match(response.headers.get("Content-Security-Policy"), /frame-ancestors 'none'/);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
}
let assertions = 0;
async function test(name, fn) { await fn(); assertions++; console.log(`PASS ${name}`); }

try {
  await test("published canonical allowlist exactly matches sitemap", async () => {
    const xml = await readFile(new URL("sitemap.xml", root), "utf8");
    const paths = [...xml.matchAll(/<loc>https:\/\/broswisata\.id([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.deepEqual([...collector.ALLOWED_PATHS].sort(), paths.sort());
  });
  await test("config fails closed without every required binding", async () => {
    for (const key of ["STATS_ENABLED", "STATS_DB", "STATS_ACCESS_TEAM_DOMAIN", "STATS_ACCESS_AUD", "STATS_ADMIN_EMAILS"]) {
      const broken = { ...env }; delete broken[key];
      const response = config.onRequest({ request: new Request("https://broswisata.id/api/stats/config"), env: broken });
      checkPrivate(response); assert.deepEqual(await response.json(), { enabled: false });
    }
    for (const domain of ["http://team.cloudflareaccess.com", "https://cloudflareaccess.com", "https://team.cloudflareaccess.com/", "https://team.cloudflareaccess.com.evil.test", "https://team.cloudflareaccess.com:443", "https://evil.test"]) assert.equal(collector.accessConfig({ ...env, STATS_ACCESS_TEAM_DOMAIN: domain }), null);
    const response = config.onRequest({ request: new Request("https://broswisata.id/api/stats/config"), env });
    assert.deepEqual(await response.json(), { enabled: true });
    const preview = config.onRequest({ request: new Request("https://preview.broswisata-website.pages.dev/api/stats/config"), env });
    assert.deepEqual(await preview.json(), { enabled: false });
  });
  await test("method and exact Origin enforcement", async () => {
    for (const origin of ["", "null", "http://broswisata.id", "https://evil.test", "https://broswisata.id.evil.test"]) assert.equal((await send(event(), { headers: { Origin: origin } })).status, 403);
    assert.equal((await collector.onRequest({ request: new Request("https://broswisata.id/api/stats/event"), env })).status, 405);
    assert.equal((await send(event(), { headers: { Origin: "https://www.broswisata.id" } })).status, 204);
    assert.equal((await collector.onRequest({ request: new Request("https://preview.broswisata-website.pages.dev/api/stats/event", { method: "POST", headers: { Origin: "https://broswisata.id", "Content-Type": "application/json" }, body: JSON.stringify(event()) }), env })).status, 403);
  });
  await test("privacy allowlist rejects arbitrary payloads", async () => {
    for (const overrides of [{ path: "/ops/analytics" }, { path: "/id/?email=a@b.com" }, { path: "/id/bros-wisata-about.html" }, { path: "https://broswisata.id/id/" }, { source: "my campaign" }, { device: "raw user agent" }, { event: "form_submit" }, { session: "fingerprint" }, { id: "not-a-uuid" }, { email: "guest@example.com" }, { ip: "127.0.0.1" }, { target: "message text" }]) assert.equal((await send(event(overrides))).status, 400);
    assert.equal((await send(event({ event: "package_select", target: "paket-combo_sumut_6h5m" }))).status, 204);
    assert.equal((await send(event({ event: "package_select" }))).status, 400);
    assert.equal((await send(event({ event: "package_select", target: "<script>" }))).status, 400);
    assert.equal((await send("null")).status, 400);
    assert.equal((await send("[]")).status, 400);
    assert.equal((await send("{broken")).status, 400);
  });
  await test("beacon media types and streamed size limit", async () => {
    assert.equal((await send(event(), { headers: { "Content-Type": "text/plain;charset=UTF-8" } })).status, 204);
    assert.equal((await send(event(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })).status, 415);
    assert.equal((await send("x".repeat(2049))).status, 413);
    assert.equal((await send(event(), { headers: { "Content-Length": "2049" } })).status, 413);
    assert.equal((await send("é".repeat(1025))).status, 413);
    const body = new ReadableStream({ start(controller) {
      controller.enqueue(new Uint8Array(1024)); controller.enqueue(new Uint8Array(1025)); controller.close();
    } });
    const request = new Request("https://broswisata.id/api/stats/event", {
      method: "POST", headers: { Origin: "https://broswisata.id", "Content-Type": "text/plain" }, body, duplex: "half"
    });
    assert.equal((await collector.onRequest({ request, env })).status, 413);
  });
  await test("database and migration failures fail closed without exposing errors", async () => {
    const unavailable = { prepare() { throw new Error("sensitive internal database detail"); }, batch() { throw new Error("sensitive migration detail"); } };
    const response = await send(event(), {}, { ...env, STATS_DB: unavailable });
    assert.equal(response.status, 503); assert.deepEqual(await response.json(), { error: "unavailable" });
    const failed = { prepare() { return { bind() { return {}; } }; }, batch: async () => [{ success: false }] };
    assert.equal((await send(event(), {}, { ...env, STATS_DB: failed })).status, 503);
  });
  await test("UUID deduplication and truthful database storage", async () => {
    const value = event();
    assert.equal((await send(value)).status, 204);
    assert.equal((await send(value)).status, 204);
    assert.equal((await send({ ...value, id: value.id.toUpperCase(), session: value.session.toUpperCase() })).status, 204);
    const rows = db.raw.prepare("SELECT * FROM stats_events WHERE event_id = ?").all(value.id);
    assert.equal(rows.length, 1); assert.equal(rows[0].session_id, value.session); assert.equal(rows[0].day, collector.wibDate());
    assert.deepEqual(Object.keys(rows[0]), ["event_id", "occurred_at", "day", "session_id", "event_name", "path", "source", "device", "target"]);
  });
  await test("WIB date boundary is independent of host timezone", async () => {
    assert.equal(collector.wibDate(Date.parse("2026-10-20T16:59:59Z")), "2026-10-20");
    assert.equal(collector.wibDate(Date.parse("2026-10-20T17:00:00Z")), "2026-10-21");
    assert.equal(collector.dateBefore("2026-03-01", 1), "2026-02-28");
  });
  const valid = await token();
  await test("RS256 signature and allowlisted Access identity required", async () => {
    assert.equal(await collector.authorized(new Request("https://broswisata.id/ops/analytics"), env), false);
    assert.equal(await collector.authorized(new Request("https://broswisata.id/ops/analytics", { headers: { "Cf-Access-Authenticated-User-Email": "owner@example.test" } }), env), false);
    const check = async (jwt, bindings = env) => collector.authorized(new Request("https://broswisata.id/ops/analytics", { headers: { "Cf-Access-Jwt-Assertion": jwt } }), bindings);
    assert.equal(await check(valid), true);
    const calls = jwksCalls; assert.equal(await check(valid), true); assert.equal(jwksCalls, calls);
    for (const changes of [{ email: "outsider@example.com" }, { iss: "https://evil.test" }, { aud: ["wrong-audience"] }, { exp: 1 }, { iat: Math.floor(Date.now() / 1000) + 600 }, { nbf: Math.floor(Date.now() / 1000) + 600 }, { exp: null }, { nbf: "bad" }, { nbf: null }, { iat: "100" }]) assert.equal(await check(await token(changes)), false);
    assert.equal(await check(await token({ nbf: undefined })), true, 'nbf is optional, but validated when supplied');
    assert.equal(await check(await token({}, { alg: "none" })), false);
    assert.equal(await check(await token({}, { alg: "HS256" })), false);
    const parts = valid.split("."); parts[1] = encode({ email: "owner@example.test", iss: issuer, aud: [audience], exp: 9999999999, nbf: 1, iat: 1 });
    assert.equal(await check(parts.join(".")), false);
    assert.equal(await check(valid.slice(0, -10) + "AAAAAAAAAA"), false);
    assert.equal(await check(await token({}, { kid: "unknown-key" })), false);
    const otherIssuer = "https://offline-stats-test.cloudflareaccess.com";
    assert.equal(await check(await token({ iss: otherIssuer }), { ...env, STATS_ACCESS_TEAM_DOMAIN: otherIssuer }), false);
  });
  const authHeaders = { "Cf-Access-Jwt-Assertion": valid };
  await test("dashboard and report fail closed with private response headers", async () => {
    for (const handler of [report.onRequest, dashboard.onRequest]) {
      const denied = await handler({ request: new Request("https://broswisata.id/ops/analytics"), env });
      checkPrivate(denied); assert.equal(denied.status, 403);
      const disabled = await handler({ request: new Request("https://broswisata.id/ops/analytics", { headers: authHeaders }), env: { ...env, STATS_ENABLED: "false" } });
      checkPrivate(disabled); assert.equal(disabled.status, 503);
    }
    const response = await dashboard.onRequest({ request: new Request("https://broswisata.id/ops/analytics", { headers: authHeaders }), env });
    checkPrivate(response); assert.equal(response.status, 200); assert.match(await response.text(), /Private shell/);
  });
  await test("empty database returns actual zeros and no sample rows", async () => {
    const empty = new D1();
    const response = await report.onRequest({ request: new Request("https://broswisata.id/ops/analytics/report?days=28", { headers: authHeaders }), env: { ...env, STATS_DB: empty } });
    checkPrivate(response); assert.equal(response.status, 200);
    const data = await response.json();
    assert.deepEqual(data.totals, { sessions: 0, pageViews: 0, whatsappClicks: 0, packageSelections: 0 });
    for (const key of ["daily", "pages", "sources", "devices", "packages", "languages"]) assert.deepEqual(data[key], []);
    empty.raw.close();
  });
  await test("aggregate math uses distinct sessions, not people or summed daily counts", async () => {
    const aggregate = new D1();
    const today = collector.wibDate(); const yesterday = collector.dateBefore(today, 1);
    const sessionA = randomUUID(); const sessionB = randomUUID();
    const insert = (day, session, eventName, path, source, device, target = null) => aggregate.raw.prepare("INSERT INTO stats_events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(randomUUID(), Date.now(), day, session, eventName, path, source, device, target);
    insert(yesterday, sessionA, "page_view", "/en/", "google", "desktop");
    insert(today, sessionA, "page_view", "/en/", "google", "desktop");
    insert(today, sessionA, "whatsapp_click", "/en/", "google", "desktop");
    insert(today, sessionA, "package_select", "/en/", "google", "desktop", "paket-western_7d6n_ultimate");
    insert(today, sessionB, "page_view", "/id/", "direct", "mobile");
    const response = await report.onRequest({ request: new Request("https://broswisata.id/ops/analytics/report?days=7", { headers: authHeaders }), env: { ...env, STATS_DB: aggregate } });
    const data = await response.json();
    assert.deepEqual(data.totals, { sessions: 2, pageViews: 3, whatsappClicks: 1, packageSelections: 1 });
    assert.equal(data.daily.length, 2); assert.equal(data.daily.reduce((n, row) => n + row.sessions, 0), 3);
    assert.deepEqual(data.pages.find((row) => row.path === "/en/"), { path: "/en/", pageViews: 2, whatsappClicks: 1 });
    assert.deepEqual(data.sources.find((row) => row.source === "google"), { source: "google", sessions: 1, pageViews: 2, whatsappClicks: 1 });
    assert.deepEqual(data.devices.find((row) => row.device === "desktop"), { device: "desktop", sessions: 1, pageViews: 2 });
    assert.deepEqual(data.packages, [{ packageId: "paket-western_7d6n_ultimate", selections: 1 }]);
    assert.deepEqual(data.languages.find((row) => row.language === "en"), { language: "en", pageViews: 2, whatsappClicks: 1 });
    assert.equal(data.range.timezone, "Asia/Jakarta"); assert.equal(JSON.stringify(data).includes(sessionA), false);
    aggregate.raw.close();
  });
  await test("report accepts only supported ranges and never exposes raw events", async () => {
    for (const suffix of ["?days=1", "?days=07", "?days=", "?days=90&days=7", "?raw=1", "?days=7&session=all"]) {
      const response = await report.onRequest({ request: new Request(`https://broswisata.id/ops/analytics/report${suffix}`, { headers: authHeaders }), env });
      assert.equal(response.status, 400);
    }
    for (const days of [7, 28, 90]) assert.equal((await report.onRequest({ request: new Request(`https://broswisata.id/ops/analytics/report?days=${days}`, { headers: authHeaders }), env })).status, 200);
  });
  await test("bounded retention removes expired data only", async () => {
    const retention = new D1(); const today = collector.wibDate();
    const keep = collector.dateBefore(today, 89); const expired = collector.dateBefore(today, 90);
    const stmt = retention.raw.prepare("INSERT INTO stats_events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (let i = 0; i < 1001; i++) stmt.run(randomUUID(), 1, expired, randomUUID(), "page_view", "/id/", "direct", "desktop", null);
    stmt.run(randomUUID(), 1, keep, randomUUID(), "page_view", "/id/", "direct", "desktop", null);
    await collector.prune(retention, today);
    assert.equal(retention.raw.prepare("SELECT count(*) AS n FROM stats_events WHERE day = ?").get(expired).n, 1);
    await collector.prune(retention, today);
    assert.equal(retention.raw.prepare("SELECT count(*) AS n FROM stats_events").get().n, 1);
    assert.equal(retention.raw.prepare("SELECT day FROM stats_events").get().day, keep);
    retention.raw.close();
  });
  await test("atomic SQL daily cap and duplicates cannot inflate its budget", async () => {
    const capped = new D1(); const today = collector.wibDate();
    const value = event(); const insert = capped.raw.prepare("INSERT OR IGNORE INTO stats_events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    const write = (id) => insert.run(id, Date.now(), today, value.session, value.event, value.path, value.source, value.device, null);
    write(value.id); write(value.id);
    assert.equal(capped.raw.prepare("SELECT event_count FROM stats_daily_budget WHERE day = ?").get(today).event_count, 1);
    capped.raw.exec("BEGIN");
    for (let i = 1; i < collector.DAILY_EVENT_CAP + 5; i++) write(randomUUID());
    capped.raw.exec("COMMIT");
    assert.equal(capped.raw.prepare("SELECT count(*) AS n FROM stats_events").get().n, collector.DAILY_EVENT_CAP);
    assert.equal(capped.raw.prepare("SELECT event_count FROM stats_daily_budget WHERE day = ?").get(today).event_count, collector.DAILY_EVENT_CAP);
    capped.raw.close();
  });
  console.log(`Server analytics: ${assertions} test groups passed. No live services called.`);
} finally {
  globalThis.fetch = originalFetch;
  db.raw.close();
}
