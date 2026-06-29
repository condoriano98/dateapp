"use client";

import RunawayNoButton from "./RunawayNoButton";
import Highlight from "./Highlight";

/**
 * Step 1 — the big question. Yes advances; No can never be caught.
 */
export default function QuestionStep({ config, onYes }) {
  return (
    <div className="animate-floatUp w-full max-w-2xl text-center">
      <p className="eyebrow mb-6 text-xs sm:text-sm">{config.eyebrow}</p>

      <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-[#3d0a16] sm:text-7xl">
        <Highlight text={config.question} />
      </h1>

      {config.subtitle && (
        <p className="mx-auto mt-6 max-w-md text-base text-[#7a3b46] sm:text-lg">
          {config.subtitle}
        </p>
      )}

      <div className="relative mt-12 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onYes}
          className="rounded-full bg-rose-600 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-600/30 transition hover:scale-105 hover:bg-rose-500 active:scale-95"
        >
          {config.yesLabel}
        </button>

        <RunawayNoButton label={config.noLabel} />
      </div>
    </div>
  );
}
