import { getRedis, RESPONSES_KEY } from "./kv";

// Picks a storage backend based on env vars:
//   1. Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
//   2. Google Sheets (Apps Script web app) if SHEET_WEBAPP_URL is set.
//   3. Upstash Redis / Vercel KV if its env vars are set.
//   4. null  → not configured (caller falls back to per-browser localStorage).
//
// Each driver exposes: save(entry), list(), clear().

function supabaseDriver(url, key) {
  const base = `${url.replace(/\/$/, "")}/rest/v1/responses`;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  return {
    async save(entry) {
      await fetch(base, {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(entry),
      });
    },
    async list() {
      const res = await fetch(`${base}?select=*&order=at.desc`, {
        headers,
        cache: "no-store",
      });
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    async clear() {
      // PostgREST requires a filter to delete; id>=0 matches every row.
      await fetch(`${base}?id=gte.0`, { method: "DELETE", headers });
    },
  };
}

function sheetsDriver(url) {
  return {
    async save(entry) {
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(entry),
      });
    },
    async list() {
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      // The script returns { responses: [...] } (newest first).
      return Array.isArray(data) ? data : data.responses || [];
    },
    async clear() {
      await fetch(`${url}?action=clear`, { method: "POST" });
    },
  };
}

function redisDriver(redis) {
  return {
    async save(entry) {
      await redis.lpush(RESPONSES_KEY, JSON.stringify(entry));
    },
    async list() {
      const raw = await redis.lrange(RESPONSES_KEY, 0, -1);
      return raw
        .map((r) => {
          if (r && typeof r === "object") return r;
          try {
            return JSON.parse(r);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    },
    async clear() {
      await redis.del(RESPONSES_KEY);
    },
  };
}

export function getStorage() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) return supabaseDriver(supabaseUrl, supabaseKey);

  const sheetUrl = process.env.SHEET_WEBAPP_URL;
  if (sheetUrl) return sheetsDriver(sheetUrl);

  const redis = getRedis();
  if (redis) return redisDriver(redis);

  return null;
}
