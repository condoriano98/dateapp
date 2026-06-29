"use client";

import { useMemo, useState } from "react";
import Highlight from "./Highlight";

function buildDays(count) {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      label: d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    });
  }
  return out;
}

/**
 * Step 2 — choose a day, a time, and what we're doing. The CTA stays disabled
 * until a time is picked, then confirms the plan.
 */
export default function TimeStep({ config, onConfirm }) {
  const days = useMemo(() => buildDays(config.daysToShow), [config.daysToShow]);

  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState(null);
  const [activityIndex, setActivityIndex] = useState(null);
  const [customText, setCustomText] = useState("");

  const activity = activityIndex != null ? config.activities[activityIndex] : null;
  const isCustom = activity?.custom;
  const ready = Boolean(time) && (!isCustom || customText.trim().length > 0);

  const handleConfirm = () => {
    if (!ready) return;
    let activityLabel = null;
    if (activity) {
      activityLabel = isCustom
        ? `${activity.emoji} ${customText.trim()}`
        : `${activity.emoji} ${activity.label}`;
    }
    onConfirm({ day: days[dayIndex].label, time, activity: activityLabel });
  };

  const cardBase =
    "shadow-sm ring-1 transition focus:outline-none";
  const cardOff =
    "bg-white/70 text-slate-900 ring-slate-200 hover:bg-white";
  const cardOn = "bg-blue-700 text-white ring-blue-700 shadow-blue-700/20";

  return (
    <div className="animate-floatUp w-full max-w-3xl">
      <div className="text-center">
        <p className="eyebrow mb-4 text-xs sm:text-sm">{config.eyebrow}</p>
        <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          <Highlight text={config.heading} />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          {config.subtitle}
        </p>
      </div>

      {/* DAY */}
      <section className="mt-10">
        <p className="eyebrow mb-3 text-xs">Day</p>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {days.map((d, i) => {
            const selected = i === dayIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setDayIndex(i)}
                className={`flex min-w-[84px] shrink-0 flex-col items-center rounded-xl px-4 py-3 text-center ${cardBase} ${
                  selected ? cardOn : cardOff
                }`}
              >
                <span className="text-xs font-semibold tracking-wider opacity-80">
                  {d.weekday}
                </span>
                <span className="font-display text-2xl font-bold leading-none mt-1">
                  {d.day}
                </span>
                <span className="mt-1 text-xs opacity-80">{d.month}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* TIME */}
      <section className="mt-8">
        <p className="eyebrow mb-3 text-xs">Time</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {config.times.map((t) => {
            const selected = time === t.time;
            return (
              <button
                key={t.time}
                type="button"
                onClick={() => setTime(t.time)}
                className={`rounded-xl px-5 py-4 text-left ${cardBase} ${
                  selected ? cardOn : cardOff
                }`}
              >
                <div className="font-display text-2xl font-bold">{t.time}</div>
                <div className={`mt-1 text-sm ${selected ? "text-white/85" : "text-slate-500"}`}>
                  {t.quip}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ACTIVITY */}
      <section className="mt-8">
        <p className="eyebrow mb-3 text-xs">What are we doing?</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {config.activities.map((a, i) => {
            const selected = i === activityIndex;
            return (
              <button
                key={a.label}
                type="button"
                onClick={() => setActivityIndex(i)}
                className={`flex items-center gap-3 rounded-xl px-5 py-4 text-left ${cardBase} ${
                  selected ? cardOn : cardOff
                }`}
              >
                <span className="text-xl">{a.emoji}</span>
                <span className="font-medium">{a.label}</span>
              </button>
            );
          })}
        </div>

        {isCustom && (
          <input
            type="text"
            autoFocus
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Tulis sendiri… (apa pun yang kamu mau)"
            className="mt-3 w-full rounded-xl bg-white/80 px-5 py-4 text-slate-900 shadow-sm ring-1 ring-slate-200 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          />
        )}
      </section>

      {/* CTA */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!ready}
        className={`mt-9 w-full rounded-lg px-6 py-4 text-lg font-semibold text-white shadow-md transition ${
          ready
            ? "cursor-pointer bg-blue-700 shadow-blue-700/20 hover:scale-[1.01] hover:bg-blue-600 active:scale-[0.99]"
            : "cursor-not-allowed bg-slate-300"
        }`}
      >
        {ready ? "Confirm" : "Pick a time to continue"}
      </button>
    </div>
  );
}
