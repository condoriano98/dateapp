"use client";

import { useCallback, useRef, useState } from "react";

/**
 * A "No" button that refuses to be clicked. On desktop it dodges the cursor
 * (mouseenter / mousemove); on touch devices it teleports on tap-attempt.
 * It never fires an accept action — that's the whole joke.
 */
export default function RunawayNoButton({ label }) {
  const btnRef = useRef(null);
  // null = still in its natural inline spot; otherwise fixed-position coords.
  const [pos, setPos] = useState(null);
  const [scale, setScale] = useState(1);

  const flee = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const { offsetWidth: w, offsetHeight: h } = btn;
    const margin = 12;
    const maxLeft = Math.max(margin, window.innerWidth - w - margin);
    const maxTop = Math.max(margin, window.innerHeight - h - margin);

    // Pick a fresh random spot anywhere on screen.
    const left = margin + Math.random() * (maxLeft - margin);
    const top = margin + Math.random() * (maxTop - margin);

    setPos({ left, top });
    // Shrink a touch each escape, down to a floor — extra comedic + harder to catch.
    setScale((s) => Math.max(0.55, s - 0.06));
  }, []);

  const handleClick = useCallback(
    (e) => {
      // Never accept. If somehow clicked (e.g. fast tap), just flee instead.
      e.preventDefault();
      flee();
    },
    [flee]
  );

  const fixedStyle = pos
    ? {
        position: "fixed",
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        transform: `scale(${scale})`,
        zIndex: 50,
      }
    : undefined;

  return (
    <button
      ref={btnRef}
      type="button"
      onMouseEnter={flee}
      onMouseMove={flee}
      onTouchStart={(e) => {
        e.preventDefault();
        flee();
      }}
      onClick={handleClick}
      style={fixedStyle}
      className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-pink-600 shadow-lg ring-1 ring-pink-200 transition-[left,top,transform] duration-200 ease-out hover:bg-pink-50"
      aria-label="No (good luck clicking this)"
    >
      {label}
    </button>
  );
}
