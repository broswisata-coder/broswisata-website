import { accessConfig, authorized, json, privateHeaders } from "../api/stats/event.js";

export async function onRequest({ request, env }) {
  if (request.method !== "GET" && request.method !== "HEAD") return json({ error: "method_not_allowed" }, 405);
  if (!accessConfig(env) || !env.ASSETS || typeof env.ASSETS.fetch !== "function") return json({ error: "unavailable" }, 503);
  if (!await authorized(request, env)) return json({ error: "forbidden" }, 403);
  try {
    // ASSETS applies Pages' pretty-URL redirects; request the extensionless URL.
    const response = await env.ASSETS.fetch(new Request(new URL("/assets/bros-stats-dashboard", request.url), { method: "GET" }));
    if (!response.ok) return json({ error: "unavailable" }, 503);
    return new Response(request.method === "HEAD" ? null : response.body, {
      status: 200, headers: privateHeaders("text/html; charset=utf-8")
    });
  } catch (_) { return json({ error: "unavailable" }, 503); }
}
