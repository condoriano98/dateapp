import { getRedis, RESPONSES_KEY } from "../../../lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Save a confirmation (called when someone hits "Confirm"). Open to anyone so
// any visitor on any device can submit.
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    // ignore malformed body
  }

  const entry = {
    answer: body.answer || "yes",
    day: body.day || null,
    time: body.time || null,
    activity: body.activity || null,
    at: new Date().toISOString(),
  };

  const redis = getRedis();
  if (!redis) {
    // Backend not configured yet — acknowledge without persisting.
    return Response.json({ ok: true, stored: false, entry });
  }

  await redis.lpush(RESPONSES_KEY, JSON.stringify(entry));
  return Response.json({ ok: true, stored: true, entry });
}

// List every confirmation across all devices (for the /admin page).
export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return Response.json({ configured: false, responses: [] });
  }

  const raw = await redis.lrange(RESPONSES_KEY, 0, -1);
  const responses = raw
    .map((r) => {
      if (r && typeof r === "object") return r; // SDK may auto-parse JSON
      try {
        return JSON.parse(r);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return Response.json({ configured: true, responses });
}

// Clear every stored confirmation (used by the admin "Clear" button).
export async function DELETE() {
  const redis = getRedis();
  if (!redis) {
    return Response.json({ ok: true, cleared: false });
  }
  await redis.del(RESPONSES_KEY);
  return Response.json({ ok: true, cleared: true });
}
