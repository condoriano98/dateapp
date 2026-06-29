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

      <h1 className="font-display text-4xl font-bold leading-[1.08] text-slate-900 sm:text-6xl">
        <Highlight text={config.question} />
      </h1>

      {config.subtitle && (
        <p className="mx-auto mt-6 max-w-md text-base text-slate-600 sm:text-lg">
          {config.subtitle}
        </p>
      )}

      <div className="relative mt-12 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onYes}
          className="rounded-lg bg-blue-700 px-10 py-3.5 text-lg font-semibold text-white shadow-md shadow-blue-700/20 transition hover:scale-[1.03] hover:bg-blue-600 active:scale-95"
        >
          {config.yesLabel}
        </button>

        <RunawayNoButton label={config.noLabel} />
      </div>
    </div>
  );
}
