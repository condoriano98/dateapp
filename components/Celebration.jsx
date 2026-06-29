"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

/**
 * Success screen shown after the "Yes" button is clicked. Fires a confetti
 * burst on mount and a couple of follow-up volleys for good measure.
 */
export default function Celebration({ message }) {
  useEffect(() => {
    const fire = (opts) =>
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 45,
        colors: ["#ec4899", "#f472b6", "#fb7185", "#ffffff", "#fda4af"],
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="animate-pop w-full max-w-xl rounded-3xl bg-white/75 p-10 text-center shadow-xl backdrop-blur-sm sm:p-14">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="text-3xl font-extrabold leading-tight text-pink-700 sm:text-4xl">
          {message}
        </h1>
        <p className="mt-4 text-pink-600/80">
          It's a date. I'll text you the details. 💌
        </p>
      </div>
    </main>
  );
}
