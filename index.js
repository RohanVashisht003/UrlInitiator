import fetch from "node-fetch";

// ── Config: add your URLs here ─────────────────────────────────────────────
const URLS = [
  { url: "http://feeds.timesnownews.com/feeds/eng/category?seopath=videos/times-now",   method: "GET" },
  { url: "http://feeds.timesnownews.com/feeds/eng/category?seopath=videos/et-now",   method: "GET" },
  { url: "http://feeds.timesnownews.com/feeds/eng/category?seopath=videos/times-drive", method: "GET" },
  { url: "http://feeds.timesnownews.com/feeds/eng/category?seopath=videos/mirror-now",  method: "GET" },
];

const INTERVAL_HOURS = 4;
// ──────────────────────────────────────────────────────────────────────────

const INTERVAL_MS = INTERVAL_HOURS * 60 * 60 * 1000;

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function hitUrl({ url, method = "GET", headers = {}, body }) {
  try {
    const options = { method, headers };
    if (body && ["POST", "PUT", "PATCH"].includes(method)) options.body = body;

    const res = await fetch(url, options);
    const text = await res.text().catch(() => "");
    const preview = text.slice(0, 120) + (text.length > 120 ? "…" : "");

    log(`✅ ${method} ${url} → ${res.status} ${res.statusText}${preview ? `\n   ${preview}` : ""}`);
  } catch (err) {
    log(`❌ ${method} ${url} → ERROR: ${err.message}`);
  }
}

async function hitAll() {
  log(`🔔 Hitting ${URLS.length} URLs...`);
  await Promise.all(URLS.map(hitUrl));
  log(`✔  Done. Next run in ${INTERVAL_HOURS} hour(s).\n`);
}

// Run immediately on start, then every N hours
hitAll();
