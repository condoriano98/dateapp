"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import Highlight from "./Highlight";

/**
 * Step 3 — confirmation. Fires confetti and shows a summary of the plan.
 */
export default function DoneStep({ config, plan, theirName }) {
  useEffect(() => {
    const fire = (opts) =>
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 45,
        colors: ["#e11d48", "#f472b6", "#fb7185", "#ffffff", "#fda4af"],
        ...opts,
      });

    fire({ origin: { x: 0.5, y: 0.6 } });
    const t1 = setTimeout(() => fire({ origin: { x: 0.2, y: 0.7 }, angle: 60 }), 250);
    const t2 = setTimeout(() => fire({ origin: { x: 0.8, y: 0.7 }, angle: 120 }), 450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const line = config.line.replace("{theirName}", theirName);

  return (
    <div className="animate-pop w-full max-w-xl rounded-3xl bg-white/70 p-9 text-center shadow-xl backdrop-blur-sm sm:p-12">
      <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-[#3d0a16] sm:text-6xl">
        <Highlight text={config.heading} />
      </h1>

      <p className="mt-4 text-lg text-[#7a3b46]">{line}</p>

      {plan && (
        <dl className="mx-auto mt-8 max-w-sm space-y-3 text-left">
          <Row label="When" value={plan.day} />
          <Row label="Time" value={plan.time} />
          {plan.activity && <Row label="Plan" value={plan.activity} />}
        </dl>
      )}

      <p className="mt-8 text-sm text-[#7a3b46]/80">
        I'll text you the details. 💌
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/60 px-5 py-3 ring-1 ring-white/70">
      <dt className="text-xs font-semibold uppercase tracking-widest text-[#8a4452]">
        {label}
      </dt>
      <dd className="font-medium text-[#3d0a16]">{value}</dd>
    </div>
  );
}
