// First-party, deliberately coarse analytics. Never store request IPs, headers,
// user agents, arbitrary URLs, form values, or persistent visitor identifiers.
export const MAX_BODY_BYTES = 2048;
export const RETENTION_DAYS = 90;
export const DAILY_EVENT_CAP = 10000;
const ORIGINS = new Set(["https://broswisata.id", "https://www.broswisata.id"]);
export function productionRequest(request) { return ORIGINS.has(new URL(request.url).origin); }
const EVENTS = new Set(["page_view", "whatsapp_click", "package_select"]);
const SOURCES = new Set(["direct", "google", "bing", "facebook", "instagram", "other", "internal"]);
const DEVICES = new Set(["mobile", "desktop", "tablet"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const PACKAGE_IDS = Object.freeze([
  "paket-berastagi_3h2m", "paket-bukit_lawang_4h3m", "paket-combo_sumut_6h5m",
  "paket-halal_3h2m_medan_toba", "paket-halal_4h3m_medan_toba", "paket-halal_5h4m_medan_toba",
  "paket-medan_heritage_3h2m", "paket-tangkahan_3h2m", "paket-western_4d3n_jungle",
  "paket-western_5d4n_volcano", "paket-western_7d6n_ultimate"
]);
const COMMON = ["", "bros-wisata-about", "bros-wisata-car-rental", "bros-wisata-contact",
  "bros-wisata-custom-tour", "bros-wisata-tour-listing", "meet-ahmad", "privacy-policy",
  "responsible-travel", "terms-of-service", ...PACKAGE_IDS];
const LOCAL = {
  id: ["destinasi-bukit-lawang-tangkahan", "private-tour-lake-toba-samosir", "private-tour-sumatra-utara",
    "tour-sumatra-utara-dari-singapore", "wisata-bukit-lawang-orangutan"],
  en: ["destination-bukit-lawang-tangkahan", "lake-toba-samosir-private-tour", "private-north-sumatra-tour",
    "singapore-to-north-sumatra-tour", "bukit-lawang-orangutan-trekking"],
  ms: ["destinasi-bukit-lawang-tangkahan", "pakej-lake-toba-samosir", "pakej-private-tour-sumatera-utara",
    "pakej-sumatera-utara-dari-singapore", "bukit-lawang-orangutan-trekking"]
};
export const ALLOWED_PATHS = new Set(Object.keys(LOCAL).flatMap((lang) =>
  [...COMMON, ...LOCAL[lang]].map((slug) => `/${lang}/${slug}`)));

export function privateHeaders(type = "application/json; charset=utf-8") {
  return {
    "Content-Type": type,
    "Cache-Control": "no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
  };
}

export function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: privateHeaders() });
}

export function accessConfig(env) {
  if (!env || env.STATS_ENABLED !== "true" || !env.STATS_DB || typeof env.STATS_DB.prepare !== "function" || typeof env.STATS_DB.batch !== "function") return null;
  const issuer = env.STATS_ACCESS_TEAM_DOMAIN;
  const audience = env.STATS_ACCESS_AUD;
  if (typeof issuer !== "string" || !/^https:\/\/[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.cloudflareaccess\.com$/.test(issuer)) return null;
  if (typeof audience !== "string" || !/^[a-zA-Z0-9_-]{16,256}$/.test(audience)) return null;
  if (typeof env.STATS_ADMIN_EMAILS !== "string" || env.STATS_ADMIN_EMAILS.length > 2048) return null;
  const emails = env.STATS_ADMIN_EMAILS.split(",").map((v) => v.trim().toLowerCase());
  if (!emails.length || emails.some((v) => !/^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(v))) return null;
  return { issuer, audience, emails: new Set(emails) };
}

export function wibDate(now = Date.now()) {
  return new Date(now + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function dateBefore(day, count) {
  return new Date(Date.parse(`${day}T00:00:00Z`) - count * 86400000).toISOString().slice(0, 10);
}

export async function prune(db, today = wibDate()) {
  const cutoff = dateBefore(today, RETENTION_DAYS - 1);
  // Bound each cleanup operation; do not perform unbounded deletes on a beacon.
  const results = await db.batch([
    db.prepare("DELETE FROM stats_events WHERE event_id IN (SELECT event_id FROM stats_events WHERE day < ? ORDER BY day LIMIT 1000)").bind(cutoff),
    db.prepare("DELETE FROM stats_daily_budget WHERE day IN (SELECT day FROM stats_daily_budget WHERE day < ? ORDER BY day LIMIT 100)").bind(cutoff)
  ]);
  if (results.some((result) => !result.success)) throw new Error("cleanup");
}

async function boundedJson(request) {
  const length = request.headers.get("Content-Length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new Error("size");
  if (!request.body) throw new Error("json");
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("size");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

export function validateEvent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  if (keys.some((key) => !["id", "event", "session", "path", "source", "device", "target"].includes(key))) return false;
  if (typeof value.id !== "string" || !UUID.test(value.id) || typeof value.session !== "string" || !UUID.test(value.session)) return false;
  if (!EVENTS.has(value.event) || !ALLOWED_PATHS.has(value.path) || !SOURCES.has(value.source) || !DEVICES.has(value.device)) return false;
  if (value.event === "package_select") return PACKAGE_IDS.includes(value.target);
  return value.target === undefined;
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!productionRequest(request) || !ORIGINS.has(request.headers.get("Origin"))) return json({ error: "forbidden" }, 403);
  if (!accessConfig(env)) return json({ error: "unavailable" }, 503);
  const type = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json" && type !== "text/plain") return json({ error: "unsupported_media_type" }, 415);
  let value;
  try { value = await boundedJson(request); } catch (error) {
    return json({ error: error.message === "size" ? "too_large" : "invalid_event" }, error.message === "size" ? 413 : 400);
  }
  if (!validateEvent(value)) return json({ error: "invalid_event" }, 400);
  try {
    const now = Date.now();
    const day = wibDate(now);
    await prune(env.STATS_DB, day);
    await env.STATS_DB.prepare(
      "INSERT OR IGNORE INTO stats_events (event_id, occurred_at, day, session_id, event_name, path, source, device, target) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(value.id.toLowerCase(), now, day, value.session.toLowerCase(), value.event, value.path, value.source, value.device, value.target || null).run();
    // A duplicate or quota-limited beacon receives the same acknowledgement.
    return new Response(null, { status: 204, headers: privateHeaders() });
  } catch (_) { return json({ error: "unavailable" }, 503); }
}

const keyCache = new Map();
const KEY_TTL = 5 * 60 * 1000;

function jwtPart(part) {
  if (!part || !/^[A-Za-z0-9_-]+$/.test(part)) throw new Error("jwt");
  const raw = atob(part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "="));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function signingKeys(issuer) {
  const cached = keyCache.get(issuer);
  if (cached && cached.expires > Date.now()) return cached.keys;
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, {
    redirect: "error", signal: AbortSignal.timeout(5000), headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error("keys");
  const text = await response.text();
  if (text.length > 65536) throw new Error("keys");
  const data = JSON.parse(text);
  if (!Array.isArray(data.keys) || !data.keys.length || data.keys.length > 10) throw new Error("keys");
  const keys = data.keys.filter((key) => key && key.kty === "RSA" && typeof key.kid === "string" &&
    (!key.alg || key.alg === "RS256") && (!key.use || key.use === "sig") && typeof key.n === "string" && typeof key.e === "string");
  if (!keys.length) throw new Error("keys");
  // Only configured Cloudflare team domains may reach this bounded cache.
  if (keyCache.size >= 4) keyCache.delete(keyCache.keys().next().value);
  keyCache.set(issuer, { keys, expires: Date.now() + KEY_TTL });
  return keys;
}

export async function authorized(request, env) {
  const config = accessConfig(env);
  if (!config) return false;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.length > 12288) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const header = JSON.parse(decoder.decode(jwtPart(parts[0])));
    const claims = JSON.parse(decoder.decode(jwtPart(parts[1])));
    if (!header || header.alg !== "RS256" || typeof header.kid !== "string" || header.kid.length > 128 || header.crit) return false;
    if (!claims || claims.iss !== config.issuer || typeof claims.email !== "string" || !config.emails.has(claims.email.toLowerCase())) return false;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audiences.includes(config.audience)) return false;
    const now = Math.floor(Date.now() / 1000);
    if (![claims.exp, claims.iat].every(Number.isSafeInteger) || claims.exp <= now || claims.iat > now + 60 || claims.exp <= claims.iat) return false;
    if (claims.nbf !== undefined && (!Number.isSafeInteger(claims.nbf) || claims.nbf > now)) return false;
    const keys = await signingKeys(config.issuer);
    const jwk = keys.find((key) => key.kid === header.kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, jwtPart(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  } catch (_) { return false; }
}
