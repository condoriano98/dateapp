"use client";

import { useState } from "react";
import RunawayNoButton from "../components/RunawayNoButton";
import Celebration from "../components/Celebration";

/**
 * ──────────────────────────────────────────────────────────────
 *  EDIT ME — all the copy lives here. Change names & text freely,
 *  then redeploy. Leave a value empty ("") to hide it.
 * ──────────────────────────────────────────────────────────────
 */
const CONFIG = {
  yourName: "{YOUR_NAME}", // your name (used in the footer attribution)
  theirName: "{THEIR_NAME}", // the lucky recipient
  subheading: "A very important question",
  question: "Will you go on a date with me?",
  yesLabel: "Yes 💕",
  noLabel: "No 😢",
  // {theirName} is replaced automatically below.
  successMessage: "Yay! Can't wait, {theirName}! 💕",
  footer:
    "yes I made this website · yes I used AI · no I won't marry you immediately, let's go on a date first",
};

export default function Page() {
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <Celebration
        message={CONFIG.successMessage.replace("{theirName}", CONFIG.theirName)}
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="animate-floatUp w-full max-w-xl rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur-sm sm:p-12">
        {CONFIG.subheading && (
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-pink-500">
            {CONFIG.subheading}
          </p>
        )}

        <h1 className="text-3xl font-extrabold leading-tight text-pink-700 sm:text-4xl">
          {CONFIG.question}
        </h1>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setAccepted(true)}
            className="rounded-full bg-pink-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-pink-500 active:scale-95"
          >
            {CONFIG.yesLabel}
          </button>

          <RunawayNoButton label={CONFIG.noLabel} />
        </div>
      </div>

      {CONFIG.footer && (
        <p className="mt-8 max-w-md px-4 text-center text-xs leading-relaxed text-pink-700/70">
          {CONFIG.footer}
        </p>
      )}
    </main>
  );
}
