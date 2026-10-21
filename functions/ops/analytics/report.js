import { accessConfig, authorized, dateBefore, json, prune, wibDate } from "../../api/stats/event.js";

export async function onRequest({ request, env }) {
  if (request.method !== "GET") return json({ error: "method_not_allowed" }, 405);
  if (!accessConfig(env)) return json({ error: "unavailable" }, 503);
  if (!await authorized(request, env)) return json({ error: "forbidden" }, 403);
  const params = new URL(request.url).searchParams;
  const rawDays = params.has("days") ? params.get("days") : "28";
  if (!["7", "28", "90"].includes(rawDays) || [...params.keys()].some((key) => key !== "days") || params.getAll("days").length > 1) return json({ error: "invalid_range" }, 400);
  const days = Number(rawDays);
  const to = wibDate();
  const from = dateBefore(to, days - 1);
  const db = env.STATS_DB;
  const metric = "COUNT(DISTINCT session_id) AS sessions, SUM(event_name = 'page_view') AS pageViews, SUM(event_name = 'whatsapp_click') AS whatsappClicks, SUM(event_name = 'package_select') AS packageSelections";
  const where = " FROM stats_events WHERE day >= ? AND day <= ?";
  try {
    await prune(db, to);
    const results = await db.batch([
      db.prepare(`SELECT ${metric}${where}`).bind(from, to),
      db.prepare(`SELECT day AS date, ${metric}${where} GROUP BY day ORDER BY day`).bind(from, to),
      db.prepare(`SELECT path, SUM(event_name = 'page_view') AS pageViews, SUM(event_name = 'whatsapp_click') AS whatsappClicks${where} GROUP BY path ORDER BY pageViews DESC, whatsappClicks DESC, path LIMIT 100`).bind(from, to),
      db.prepare(`SELECT source, COUNT(DISTINCT session_id) AS sessions, SUM(event_name = 'page_view') AS pageViews, SUM(event_name = 'whatsapp_click') AS whatsappClicks${where} GROUP BY source ORDER BY sessions DESC, source`).bind(from, to),
      db.prepare(`SELECT device, COUNT(DISTINCT session_id) AS sessions, SUM(event_name = 'page_view') AS pageViews${where} GROUP BY device ORDER BY sessions DESC, device`).bind(from, to),
      db.prepare(`SELECT target AS packageId, COUNT(*) AS selections${where} AND event_name = 'package_select' GROUP BY target ORDER BY selections DESC, target`).bind(from, to),
      db.prepare(`SELECT substr(path, 2, 2) AS language, SUM(event_name = 'page_view') AS pageViews, SUM(event_name = 'whatsapp_click') AS whatsappClicks${where} GROUP BY language ORDER BY pageViews DESC, language`).bind(from, to)
    ]);
    if (results.some((result) => !result.success)) return json({ error: "unavailable" }, 503);
    const totals = results[0].results[0] || {};
    for (const key of ["sessions", "pageViews", "whatsappClicks", "packageSelections"]) totals[key] = Number(totals[key]) || 0;
    return json({ range: { days, from, to, timezone: "Asia/Jakarta" }, totals,
      daily: results[1].results, pages: results[2].results, sources: results[3].results,
      devices: results[4].results, packages: results[5].results, languages: results[6].results });
  } catch (_) { return json({ error: "unavailable" }, 503); }
}
