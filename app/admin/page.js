"use client";

import { useEffect, useState } from "react";
import { readResponses, clearResponses } from "../../lib/responseLog";

export default function AdminPage() {
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState("local"); // "all" (backend) | "local"

  const load = async () => {
    setLoaded(false);
    try {
      const res = await fetch("/api/responses", { cache: "no-store" });
      const data = await res.json();
      if (data.configured) {
        setSource("all");
        setRows(data.responses || []); // newest first (lpush prepends)
        setLoaded(true);
        return;
      }
    } catch {
      // network/backend unavailable — fall through to localStorage
    }
    setSource("local");
    setRows(readResponses().slice().reverse());
    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, []);

  const handleClear = async () => {
    if (!confirm("Clear all logged responses?")) return;
    if (source === "all") {
      await fetch("/api/responses", { method: "DELETE" }).catch(() => {});
    } else {
      clearResponses();
    }
    load();
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-xs">Admin</p>
          <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Responses{" "}
            <span className="text-pink-600">
              {loaded ? `(${rows.length})` : ""}
            </span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-300 transition hover:bg-slate-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-50"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {source === "all" ? (
          <>
            Showing confirmations from <strong>all devices</strong> (shared backend).
          </>
        ) : (
          <>
            Backend not configured — showing confirmations from <strong>this browser</strong>{" "}
            only (localStorage). Add the storage env vars to collect responses from every
            device.
          </>
        )}
      </p>

      {loaded && rows.length === 0 && (
        <div className="mt-8 rounded-xl bg-white/70 p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          No responses yet. Complete the flow on the{" "}
          <a href="/" className="font-semibold text-pink-600 underline">
            home page
          </a>{" "}
          and they'll appear here.
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {rows.map((r, i) => (
          <li
            key={i}
            className="rounded-xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-600">
                {r.answer || "yes"}
              </span>
              <span className="text-xs text-slate-400">
                {r.at ? new Date(r.at).toLocaleString() : ""}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Field label="When" value={r.day} />
              <Field label="Time" value={r.time} />
              <Field label="Plan" value={r.activity} />
            </dl>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-slate-900">{value || "—"}</dd>
    </div>
  );
}
