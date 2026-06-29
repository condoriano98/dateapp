// Simple, backend-free response log. On confirm we log to the browser console
// and append to localStorage; the /admin page reads these back.
// NOTE: localStorage is per-browser/device — the admin page shows responses
// recorded on the same browser, not submissions from other people's devices.

const KEY = "dateapp_responses";

export function logResponse(plan) {
  const entry = { ...plan, at: new Date().toISOString() };

  // Visible in the browser DevTools console.
  if (typeof console !== "undefined") {
    console.log("[dateapp] response:", entry);
  }

  if (typeof window === "undefined") return entry;
  try {
    const list = readResponses();
    list.push(entry);
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
  return entry;
}

export function readResponses() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearResponses() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
