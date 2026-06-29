"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const THRESHOLD = 120; // start fleeing when the cursor gets this close (px)
const HOP = 130; // how far it scoots away per reaction — small hops read as "running"

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
// Visible viewport. Use the smaller of innerWidth and clientWidth to stay clear
// of scrollbars, and never let the usable range collapse below zero.
const viewW = () =>
  Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
const viewH = () =>
  Math.min(window.innerHeight, document.documentElement.clientHeight || window.innerHeight);

/**
 * A "No" button that *runs away* from the cursor and can never be clicked.
 * A document-level pointer listener watches how close the cursor is, and
 * whenever it gets near, the button hops a short distance away and glides there
 * (CSS transition). Short hops while you chase it look like running. The final
 * position is hard-clamped to the visible viewport, and a rescue interval pulls
 * it back on-screen if it ever lands outside — so it can never disappear.
 */
export default function RunawayNoButton({ label }) {
  const btnRef = useRef(null);
  const fleeingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState(null); // null = natural inline spot; else fixed coords

  useEffect(() => setMounted(true), []);

  // Place the button (by its top-left), hard-clamped fully on-screen.
  const place = useCallback((centerX, centerY) => {
    const btn = btnRef.current;
    if (!btn) return;
    const { width: w, height: h } = btn.getBoundingClientRect();
    const left = clamp(centerX - w / 2, 12, viewW() - w - 12);
    const top = clamp(centerY - h / 2, 12, viewH() - h - 12);
    fleeingRef.current = true;
    setPos({ left, top });
  }, []);

  const dodge = useCallback(
    (cursorX, cursorY) => {
      const btn = btnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = rect.left + w / 2;
      const cy = rect.top + h / 2;

      const dist = Math.hypot(cx - cursorX, cy - cursorY);
      if (dist > THRESHOLD) return; // cursor not close enough — hold position

      const vw = viewW();
      const vh = viewH();
      const minCx = 12 + w / 2;
      const maxCx = Math.max(minCx, vw - 12 - w / 2);
      const minCy = 12 + h / 2;
      const maxCy = Math.max(minCy, vh - 12 - h / 2);
      const distTo = (x, y) => Math.hypot(x - cursorX, y - cursorY);

      // Try 8 short hops around the current spot; keep the on-screen one that
      // lands farthest from the cursor.
      let best = null;
      let bestD = -1;
      for (let k = 0; k < 8; k++) {
        const ang = (k * Math.PI) / 4;
        const tx = clamp(cx + Math.cos(ang) * HOP, minCx, maxCx);
        const ty = clamp(cy + Math.sin(ang) * HOP, minCy, maxCy);
        const d = distTo(tx, ty);
        if (d > bestD) {
          bestD = d;
          best = [tx, ty];
        }
      }

      // Cornered? Relocate to a random spot that's still fully on-screen.
      if (bestD < THRESHOLD) {
        for (let i = 0; i < 25; i++) {
          const rx = minCx + Math.random() * (maxCx - minCx);
          const ry = minCy + Math.random() * (maxCy - minCy);
          if (distTo(rx, ry) >= THRESHOLD) {
            best = [rx, ry];
            break;
          }
        }
      }

      place(best[0], best[1]);
    },
    [place]
  );

  useEffect(() => {
    const onMouse = (e) => dodge(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) dodge(t.clientX, t.clientY);
    };
    document.addEventListener("mousemove", onMouse);
    document.addEventListener("touchmove", onTouch, { passive: true });

    // Safety net: if the button ever ends up partly off-screen (e.g. after a
    // resize or a fast flick), pull it back into view.
    const rescue = setInterval(() => {
      if (!fleeingRef.current) return;
      const btn = btnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const vw = viewW();
      const vh = viewH();
      if (r.left < 0 || r.top < 0 || r.right > vw || r.bottom > vh) {
        place(clamp(r.left + r.width / 2, 0, vw), clamp(r.top + r.height / 2, 0, vh));
      }
    }, 250);

    return () => {
      document.removeEventListener("mousemove", onMouse);
      document.removeEventListener("touchmove", onTouch);
      clearInterval(rescue);
    };
  }, [dodge, place]);

  const handleAttempt = useCallback(
    (e) => {
      // Never accept. If somehow pressed, just flee from the press point.
      e.preventDefault();
      const x = e.clientX ?? window.innerWidth / 2;
      const y = e.clientY ?? window.innerHeight / 2;
      dodge(x, y);
    },
    [dodge]
  );

  const fixedStyle = pos
    ? { position: "fixed", left: `${pos.left}px`, top: `${pos.top}px`, zIndex: 50 }
    : undefined;

  const button = (
    <button
      ref={btnRef}
      type="button"
      onMouseDown={handleAttempt}
      onClick={handleAttempt}
      onTouchStart={handleAttempt}
      style={fixedStyle}
      className="rounded-lg bg-white px-10 py-3.5 text-lg font-semibold text-slate-700 shadow-md ring-1 ring-slate-300 transition-[left,top] duration-150 ease-out hover:bg-slate-50"
      aria-label="No (good luck clicking this)"
    >
      {label}
    </button>
  );

  // Once it's fleeing, portal the fixed button to <body> so its coordinates are
  // relative to the viewport — not to any transformed ancestor (the entrance
  // animation leaves a transform that would otherwise capture position: fixed).
  if (pos && mounted) {
    return createPortal(button, document.body);
  }
  return button;
}
