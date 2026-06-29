"use client";

import { useState } from "react";
import QuestionStep from "../components/QuestionStep";
import TimeStep from "../components/TimeStep";
import DoneStep from "../components/DoneStep";
import { logResponse } from "../lib/responseLog";

/**
 * ──────────────────────────────────────────────────────────────
 *  EDIT ME — all the copy lives here. Change names & text freely,
 *  then redeploy. {theirName} is substituted automatically.
 * ──────────────────────────────────────────────────────────────
 */
export const CONFIG = {
  theirName: "Farrah",

  // ── Step 1: the question ──────────────────────────────────
  step1: {
    eyebrow: "A very important question",
    // Wrap one word/phrase in *asterisks* to render it in the accent color.
    question: "Will you spend the BOD meeting with me as ur *assistant*?",
    subtitle: "Take your time. Choose carefully. There is definitely a right answer.",
    yesLabel: "Yes",
    noLabel: "No",
  },

  // ── Step 2: pick a time ───────────────────────────────────
  step2: {
    eyebrow: "Step 2 of 2",
    heading: "Pick a *time*.",
    subtitle:
      "You said yes. Now let's lock in a time that works for both of us.",
    daysToShow: 14,
    times: [
      { time: "5:00 PM", quip: "are we eating at a retirement home?" },
      { time: "7:00 PM", quip: "respectable. suspiciously respectable." },
      { time: "8:00 PM", quip: "fair warning, I might be hangry" },
      { time: "9:00 PM", quip: "this is past my bedtime, jk sleep is for the weak" },
    ],
    activities: [
      { emoji: "🍜", label: "Mie" },
      { emoji: "🍦", label: "Ice cream" },
      { emoji: "🥊", label: "Tinju" },
      { emoji: "🏦", label: "Rampok Bank" },
      { emoji: "🚨", label: "buat keributan" },
      { emoji: "✨", label: "(Isi sendiri)", custom: true },
    ],
  },

  // ── Step 3: confirmation ──────────────────────────────────
  step3: {
    heading: "It's a *BOD meeting*. 🚨",
    line: "Looking forward to it, {theirName}.",
  },
};

export default function Page() {
  const [step, setStep] = useState("question"); // question | time | done
  const [plan, setPlan] = useState(null); // { day, time, activity }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12 sm:py-16">
      {step === "question" && (
        <QuestionStep config={CONFIG.step1} onYes={() => setStep("time")} />
      )}

      {step === "time" && (
        <TimeStep
          config={CONFIG.step2}
          onConfirm={(selection) => {
            const entry = { answer: "yes", ...selection };
            logResponse(entry); // console + localStorage fallback
            // Persist to the shared backend so it shows across all devices.
            fetch("/api/responses", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(entry),
            }).catch(() => {});
            setPlan(selection);
            setStep("done");
          }}
        />
      )}

      {step === "done" && <DoneStep config={CONFIG.step3} plan={plan} theirName={CONFIG.theirName} />}
    </main>
  );
}
