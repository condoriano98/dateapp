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

  return (
    <div className="animate-floatUp w-full max-w-3xl">
      <div className="text-center">
        <p className="eyebrow mb-4 text-xs sm:text-sm">{config.eyebrow}</p>
        <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-[#3d0a16] sm:text-6xl">
          <Highlight text={config.heading} />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#7a3b46] sm:text-lg">
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
                className={`flex min-w-[84px] shrink-0 flex-col items-center rounded-2xl px-4 py-3 text-center shadow-sm ring-1 transition ${
                  selected
                    ? "bg-rose-600 text-white ring-rose-600 shadow-rose-600/30"
                    : "bg-white/55 text-[#3d0a16] ring-white/70 hover:bg-white/80"
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
        <p className="eyebrow mb-3 text-xs">Time · Weeknight menu 🍝</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {config.times.map((t) => {
            const selected = time === t.time;
            return (
              <button
                key={t.time}
                type="button"
                onClick={() => setTime(t.time)}
                className={`rounded-2xl px-5 py-4 text-left shadow-sm ring-1 transition ${
                  selected
                    ? "bg-rose-600 text-white ring-rose-600 shadow-rose-600/30"
                    : "bg-white/55 text-[#3d0a16] ring-white/70 hover:bg-white/80"
                }`}
              >
                <div className="font-display text-2xl font-bold">{t.time}</div>
                <div className={`mt-1 text-sm ${selected ? "text-white/85" : "text-[#7a3b46]"}`}>
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
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-left shadow-sm ring-1 transition ${
                  selected
                    ? "bg-rose-600 text-white ring-rose-600 shadow-rose-600/30"
                    : "bg-white/55 text-[#3d0a16] ring-white/70 hover:bg-white/80"
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
            className="mt-3 w-full rounded-2xl bg-white/70 px-5 py-4 text-[#3d0a16] shadow-sm ring-1 ring-white/70 outline-none placeholder:text-[#b08490] focus:ring-2 focus:ring-rose-400"
          />
        )}
      </section>

      {/* CTA */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!ready}
        className={`mt-9 w-full rounded-full px-6 py-4 text-lg font-semibold text-white shadow-lg transition ${
          ready
            ? "cursor-pointer bg-rose-600 shadow-rose-600/30 hover:scale-[1.01] hover:bg-rose-500 active:scale-[0.99]"
            : "cursor-not-allowed bg-rose-300/70"
        }`}
      >
        {ready ? "Lock it in 💕" : "Pick a time to continue"}
      </button>
    </div>
  );
}
