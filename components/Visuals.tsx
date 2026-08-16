"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Three authored diagrams, one per research interest. They are the section's
 * content, not ornament: each one draws the actual mechanism it names.
 *
 * All geometry is rounded before it reaches the markup — a full-precision float
 * serializes differently in the SSR output than when React recomputes it on the
 * client, which trips hydration.
 */

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

/** Deterministic pseudo-random so server and client render identically. */
function noise(i: number) {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return round(v - Math.floor(v));
}

const PITCH = 26;
const CELL = 22;
const GRID = 8;
const SPAN = GRID * PITCH - (PITCH - CELL);

/** Convolution: a 3×3 kernel sweeping a feature map. */
export function ConvolutionVisual({ accent = "var(--moon)" }: { accent?: string }) {
  const reduced = useReducedMotion();
  const xs = [0, 2, 4, 5, 3, 1].map((c) => c * PITCH);
  const ys = [0, PITCH * 2, PITCH * 4, PITCH * 1, PITCH * 5, PITCH * 3];

  return (
    <svg
      viewBox={`-6 -6 ${SPAN + 12} ${SPAN + 12}`}
      className="w-full h-auto"
      role="img"
      aria-label="A three by three convolution kernel sweeping across a feature map"
    >
      {Array.from({ length: GRID * GRID }, (_, i) => {
        const col = i % GRID;
        const row = Math.floor(i / GRID);
        const n = noise(i);
        const rest = round(0.16 + n * 0.34);
        const peak = round(0.34 + n * 0.62);
        return (
          <motion.rect
            key={i}
            x={col * PITCH}
            y={row * PITCH}
            width={CELL}
            height={CELL}
            fill="var(--parchment)"
            initial={{ opacity: rest }}
            animate={reduced ? { opacity: rest } : { opacity: [rest, peak, rest] }}
            transition={{ duration: 3.4 + n * 2, repeat: Infinity, ease: "easeInOut", delay: n * 2 }}
          />
        );
      })}
      <motion.rect
        width={PITCH * 3 - (PITCH - CELL)}
        height={PITCH * 3 - (PITCH - CELL)}
        fill={accent}
        fillOpacity={0.2}
        stroke={accent}
        strokeWidth={2.5}
        initial={{ x: 0, y: 0 }}
        animate={reduced ? { x: PITCH * 2, y: PITCH * 2 } : { x: xs, y: ys }}
        transition={
          reduced
            ? undefined
            : {
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }
        }
      />
    </svg>
  );
}

/** Attention: a token stream with weighted arcs back to earlier tokens. */
export function AttentionVisual({ accent = "var(--lamp)" }: { accent?: string }) {
  const reduced = useReducedMotion();
  const tokens = 12;
  const width = 240;
  const gap = width / (tokens - 1);
  const baseY = 150;

  const arcs: { from: number; to: number; weight: number }[] = [];
  for (let to = 2; to < tokens; to++) {
    for (let from = 0; from < to; from++) {
      const w = noise(to * 31 + from);
      if (w > 0.5) arcs.push({ from, to, weight: w });
    }
  }

  return (
    <svg
      viewBox={`-10 -6 ${width + 20} 186`}
      className="w-full h-auto"
      role="img"
      aria-label="Attention weights drawn as arcs from each token back to earlier tokens"
    >
      {arcs.map((a, i) => {
        const x1 = round(a.from * gap);
        const x2 = round(a.to * gap);
        const lift = round(Math.min(128, Math.abs(x2 - x1) * 0.86));
        return (
          <motion.path
            key={i}
            d={`M ${x1} ${baseY} Q ${round((x1 + x2) / 2)} ${round(baseY - lift)} ${x2} ${baseY}`}
            fill="none"
            stroke={accent}
            strokeWidth={round(0.6 + a.weight * 2.4)}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={
              reduced
                ? { opacity: round(a.weight * 0.75) }
                : { opacity: [0, round(0.25 + a.weight * 0.75), 0] }
            }
            transition={
              reduced
                ? undefined
                : { duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: (i % 10) * 0.42 }
            }
          />
        );
      })}
      {Array.from({ length: tokens }, (_, i) => {
        const h = round(12 + noise(i + 400) * 20);
        return (
          <motion.rect
            key={i}
            x={round(i * gap - 4)}
            y={baseY}
            width={8}
            height={h}
            fill="var(--parchment)"
            initial={{ opacity: 0.55 }}
            animate={reduced ? { opacity: 0.75 } : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.28 }}
          />
        );
      })}
    </svg>
  );
}

/** A layered network with activation flowing forward through the edges. */
export function NetworkVisual({ accent = "var(--dusk)" }: { accent?: string }) {
  const reduced = useReducedMotion();
  const layers = [4, 7, 7, 3];
  const width = 240;
  const height = 190;
  const colGap = width / (layers.length - 1);

  const positions = layers.map((count, li) =>
    Array.from({ length: count }, (_, ni) => ({
      x: round(li * colGap),
      y: round((height / (count + 1)) * (ni + 1)),
    }))
  );

  const edges: { x1: number; y1: number; x2: number; y2: number; k: number }[] = [];
  for (let li = 0; li < positions.length - 1; li++) {
    positions[li].forEach((a) => {
      positions[li + 1].forEach((b) => {
        edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, k: li });
      });
    });
  }

  return (
    <svg
      viewBox={`-14 -8 ${width + 28} ${height + 16}`}
      className="w-full h-auto"
      role="img"
      aria-label="A four-layer neural network with activation pulsing forward through its edges"
    >
      {edges.map((e, i) => (
        <motion.line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke="var(--parchment)"
          strokeWidth={0.7}
          initial={{ opacity: 0.16 }}
          animate={reduced ? { opacity: 0.2 } : { opacity: [0.1, 0.52, 0.1] }}
          transition={
            reduced
              ? undefined
              : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: e.k * 0.42 + noise(i) * 0.4,
                }
          }
        />
      ))}
      {positions.flatMap((layer, li) =>
        layer.map((p, ni) => (
          <motion.circle
            key={`${li}-${ni}`}
            cx={p.x}
            cy={p.y}
            r={li === positions.length - 1 ? 6 : 5}
            fill={li === positions.length - 1 ? accent : "var(--parchment)"}
            initial={{ opacity: 0.7 }}
            animate={reduced ? { opacity: 0.85 } : { opacity: [0.45, 1, 0.45] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: li * 0.42 + ni * 0.07,
            }}
          />
        ))
      )}
    </svg>
  );
}
