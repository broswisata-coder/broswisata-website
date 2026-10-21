import { accessConfig, json, productionRequest } from "./event.js";

export function onRequest({ request, env }) {
  if (request.method !== "GET") return json({ error: "method_not_allowed" }, 405);
  return json({ enabled: productionRequest(request) && Boolean(accessConfig(env)) });
}
