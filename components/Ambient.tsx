"use client";

import { useMemo } from "react";

/**
 * The room the film ends in, held under the whole page: a cold moon high on one
 * side, a warm lamp low on the other, and the dust still hanging in it.
 *
 * This is the single biggest thing tying the site to the intro. Without it the
 * page is a flat black rectangle and the hand-off reads as two different
 * products; with it, the site is the same night.
 */

function noise(i: number) {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return Math.round((v - Math.floor(v)) * 1000) / 1000;
}

export default function Ambient() {
  const motes = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: `${Math.round(noise(i) * 1000) / 10}%`,
        top: `${Math.round(noise(i + 300) * 1000) / 10}%`,
        size: 1 + Math.round(noise(i + 600) * 2 * 10) / 10,
        delay: -Math.round(noise(i + 900) * 260) / 10,
        duration: 16 + Math.round(noise(i + 1200) * 180) / 10,
        drift: Math.round((noise(i + 1500) - 0.5) * 700) / 10,
        peak: 0.18 + Math.round(noise(i + 1800) * 260) / 1000,
      })),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Moonlight, high and cold. */}
      <div
        className="absolute -top-[30vh] -right-[18vw] h-[85vh] w-[85vw] rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--moon) 0%, color-mix(in oklab, var(--dusk) 60%, transparent) 45%, transparent 70%)",
        }}
      />
      {/* Lamplight, low and warm — the counterweight. */}
      <div
        className="absolute -bottom-[26vh] -left-[16vw] h-[70vh] w-[70vw] rounded-full opacity-[0.13] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--lamp) 0%, color-mix(in oklab, var(--ink) 55%, transparent) 50%, transparent 72%)",
        }}
      />
      {/* Deepens the floor of the page so type sits on something. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 40%, var(--night-deep) 100%)",
        }}
      />

      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-lamp"
          style={
            {
              left: m.left,
              top: m.top,
              width: `${m.size}px`,
              height: `${m.size}px`,
              opacity: 0,
              animation: `mote-drift ${m.duration}s linear ${m.delay}s infinite`,
              "--mote-x": `${m.drift}px`,
              "--mote-peak": m.peak,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
