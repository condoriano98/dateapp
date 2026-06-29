"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD = 130; // start fleeing when the cursor gets this close (px)
const BUFFER = 70; // how far past the threshold to jump

/**
 * A "No" button that *continuously* avoids the cursor. A document-level
 * pointer listener checks how close the cursor is to the button and, whenever
 * it gets near, glides the button away to a spot far from the cursor. It stays
 * fully on-screen and visible — it never just disappears.
 */
export default function RunawayNoButton({ label }) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null); // null = natural inline spot; else fixed coords

  const dodge = useCallback((cursorX, cursorY) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cx = rect.left + w / 2;
    const cy = rect.top + h / 2;

    const dx = cx - cursorX;
    const dy = cy - cursorY;
    const dist = Math.hypot(dx, dy);
    if (dist > THRESHOLD) return; // cursor not close enough — stay put

    // Unit vector pointing away from the cursor (random if exactly on center).
    let ux = dx / (dist || 1);
    let uy = dy / (dist || 1);
    if (!dist) {
      const a = Math.random() * Math.PI * 2;
      ux = Math.cos(a);
      uy = Math.sin(a);
    }

    const margin = 12;
    const minX = margin + w / 2;
    const maxX = window.innerWidth - margin - w / 2;
    const minY = margin + h / 2;
    const maxY = window.innerHeight - margin - h / 2;

    // Target center: push away from the cursor past the threshold.
    let tx = cursorX + ux * (THRESHOLD + BUFFER);
    let ty = cursorY + uy * (THRESHOLD + BUFFER);

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    tx = clamp(tx, minX, maxX);
    ty = clamp(ty, minY, maxY);

    // If clamping left it still within reach, bounce to a random far corner.
    if (Math.hypot(tx - cursorX, ty - cursorY) < THRESHOLD) {
      for (let i = 0; i < 12; i++) {
        const rx = minX + Math.random() * (maxX - minX);
        const ry = minY + Math.random() * (maxY - minY);
        if (Math.hypot(rx - cursorX, ry - cursorY) >= THRESHOLD) {
          tx = rx;
          ty = ry;
          break;
        }
      }
    }

    setPos({ left: tx - w / 2, top: ty - h / 2 });
  }, []);

  useEffect(() => {
    const onMouse = (e) => dodge(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) dodge(t.clientX, t.clientY);
    };
    document.addEventListener("mousemove", onMouse);
    document.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMouse);
      document.removeEventListener("touchmove", onTouch);
    };
  }, [dodge]);

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

  return (
    <button
      ref={btnRef}
      type="button"
      onMouseDown={handleAttempt}
      onClick={handleAttempt}
      onTouchStart={handleAttempt}
      style={fixedStyle}
      className="rounded-full bg-white/85 px-10 py-4 text-lg font-semibold text-rose-600 shadow-lg ring-1 ring-rose-200 backdrop-blur-sm transition-[left,top] duration-150 ease-out hover:bg-white"
      aria-label="No (good luck clicking this)"
    >
      {label}
    </button>
  );
}
