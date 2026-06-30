import { getStorage } from "../../../lib/storage";

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

  const store = getStorage();
  if (!store) {
    // Backend not configured yet — acknowledge without persisting.
    return Response.json({ ok: true, stored: false, entry });
  }

  try {
    await store.save(entry);
    return Response.json({ ok: true, stored: true, entry });
  } catch (err) {
    return Response.json({ ok: false, stored: false, error: String(err) }, { status: 502 });
  }
}

// List every confirmation across all devices (for the /admin page).
export async function GET() {
  const store = getStorage();
  if (!store) {
    return Response.json({ configured: false, responses: [] });
  }

  try {
    const responses = await store.list();
    return Response.json({ configured: true, responses });
  } catch (err) {
    return Response.json({ configured: true, responses: [], error: String(err) }, { status: 502 });
  }
}

// Clear every stored confirmation (used by the admin "Clear" button).
export async function DELETE() {
  const store = getStorage();
  if (!store) {
    return Response.json({ ok: true, cleared: false });
  }
  try {
    await store.clear();
    return Response.json({ ok: true, cleared: true });
  } catch (err) {
    return Response.json({ ok: false, cleared: false, error: String(err) }, { status: 502 });
  }
}
