"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * The wall above her desk. These carry the part of the story the narration used
 * to spell out — what she is working toward, and what it is costing — so the
 * captions can stay short.
 *
 * Each poster is a 2D canvas painted once and used as a texture. Deadlines are
 * generic milestones rather than named institutions, because which programs she
 * is applying to is not a fact on record.
 */

const PAPER = "#e9e5d8";
const INK = "#16161a";
const RED = "#c8341a";

function paper(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(150,128,86,0.07)";
  ctx.fillRect(0, 0, w, h);
}

function drawAdmissions(ctx: CanvasRenderingContext2D, w: number, h: number) {
  paper(ctx, w, h);

  ctx.fillStyle = INK;
  ctx.font = "600 46px system-ui, sans-serif";
  ctx.fillText("GRADUATE", 40, 84);
  ctx.fillText("ADMISSIONS", 40, 136);

  ctx.fillStyle = RED;
  ctx.fillRect(40, 162, 210, 9);

  ctx.fillStyle = INK;
  ctx.font = "700 92px system-ui, sans-serif";
  ctx.fillText("FALL 2027", 40, 262);

  const rows: [string, string][] = [
    ["APPLICATION", "DEC 15"],
    ["RECOMMENDERS", "NOV 30"],
    ["STATEMENT", "NOV 08"],
    ["TRANSCRIPTS", "OCT 20"],
  ];
  ctx.font = "30px ui-monospace, Menlo, monospace";
  let y = 340;
  for (const [label, date] of rows) {
    ctx.fillStyle = INK;
    ctx.fillText(label, 40, y);
    ctx.fillStyle = RED;
    const dw = ctx.measureText(date).width;
    ctx.fillText(date, w - 40 - dw, y);
    ctx.strokeStyle = "rgba(0,0,0,0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, y + 18);
    ctx.lineTo(w - 40, y + 18);
    ctx.stroke();
    y += 62;
  }

  // Circled, underlined, gone over twice — the one that actually matters.
  ctx.strokeStyle = RED;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(w / 2, 328, w / 2 - 26, 44, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTodo(ctx: CanvasRenderingContext2D, w: number, h: number) {
  paper(ctx, w, h);

  ctx.fillStyle = INK;
  ctx.font = "700 54px system-ui, sans-serif";
  ctx.fillText("TO DO", 36, 78);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(36, 96);
  ctx.lineTo(w - 36, 96);
  ctx.stroke();

  const items: [string, boolean][] = [
    ["fix the tokenizer", true],
    ["retrain overnight", true],
    ["read the DSen2 paper", true],
    ["statement draft 4", false],
    ["email the professor", false],
    ["sleep", false],
  ];

  ctx.font = "30px ui-monospace, Menlo, monospace";
  let y = 152;
  for (const [text, done] of items) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(38, y - 22, 26, 26);

    if (done) {
      ctx.strokeStyle = RED;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(42, y - 10);
      ctx.lineTo(50, y - 1);
      ctx.lineTo(62, y - 20);
      ctx.stroke();
    }

    ctx.fillStyle = done ? "rgba(22,22,26,0.45)" : INK;
    ctx.fillText(text, 82, y);

    if (done) {
      ctx.strokeStyle = "rgba(22,22,26,0.45)";
      ctx.lineWidth = 3;
      const tw = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.moveTo(82, y - 10);
      ctx.lineTo(82 + tw, y - 10);
      ctx.stroke();
    }
    y += 58;
  }
}

function drawPlot(ctx: CanvasRenderingContext2D, w: number, h: number) {
  paper(ctx, w, h);

  ctx.fillStyle = INK;
  ctx.font = "600 26px ui-monospace, Menlo, monospace";
  ctx.fillText("CALIBRATION", 26, 46);
  ctx.font = "20px ui-monospace, Menlo, monospace";
  ctx.fillStyle = "rgba(22,22,26,0.6)";
  ctx.fillText("stated vs. actual", 26, 76);

  const x0 = 40;
  const y0 = h - 56;
  const x1 = w - 30;
  const y1 = 110;

  ctx.strokeStyle = "rgba(22,22,26,0.5)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, y1);
  ctx.lineTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.stroke();

  // Perfect calibration, then the curve that misses it.
  ctx.setLineDash([7, 7]);
  ctx.strokeStyle = "rgba(22,22,26,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = RED;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.bezierCurveTo(x0 + (x1 - x0) * 0.45, y0 - 14, x0 + (x1 - x0) * 0.6, y1 + 90, x1, y1 + 34);
  ctx.stroke();
}

function drawSticky(text: string, tone: string) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = tone;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, h - 16, w, 16);

    ctx.fillStyle = "#1b1b1f";
    ctx.font = "600 34px ui-monospace, Menlo, monospace";
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > w - 40 && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
    let y = h / 2 - ((lines.length - 1) * 42) / 2 + 12;
    for (const l of lines) {
      ctx.fillText(l, 22, y);
      y += 42;
    }
  };
}

function useTexture(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  w: number,
  h: number
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    draw(ctx, w, h);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
    // Draw functions are module-scope constants; the texture is painted once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Pinned({
  draw,
  px,
  px2,
  position,
  size,
  tilt = 0,
}: {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  px: number;
  px2: number;
  position: [number, number, number];
  size: [number, number];
  tilt?: number;
}) {
  const texture = useTexture(draw, px, px2);
  if (!texture) return null;
  return (
    <group position={position} rotation={[0, 0, tilt]}>
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>
      {/* A pin, so the paper is on the wall rather than floating in front of it. */}
      <mesh position={[0, size[1] / 2 - 0.022, 0.008]}>
        <sphereGeometry args={[0.011, 10, 10]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  );
}

/** Pinned to the wall behind the desk, in the Study group's local space. */
export function Posters() {
  return (
    <group>
      <Pinned
        draw={drawAdmissions}
        px={512}
        px2={640}
        position={[-0.92, 2.16, -6.54]}
        size={[0.62, 0.78]}
        tilt={0.018}
      />
      <Pinned
        draw={drawTodo}
        px={512}
        px2={576}
        position={[0.5, 2.2, -6.54]}
        size={[0.56, 0.63]}
        tilt={-0.03}
      />
      <Pinned
        draw={drawPlot}
        px={420}
        px2={480}
        position={[1.32, 2.42, -6.54]}
        size={[0.38, 0.44]}
        tilt={0.05}
      />
      <Pinned
        draw={drawSticky("it compiles. it lies.", "#f0c86a")}
        px={256}
        px2={256}
        position={[1.3, 1.86, -6.54]}
        size={[0.21, 0.21]}
        tilt={-0.09}
      />
      <Pinned
        draw={drawSticky("day 41: still wrong", "#e88a5c")}
        px={256}
        px2={256}
        position={[-1.62, 1.78, -6.54]}
        size={[0.22, 0.22]}
        tilt={0.07}
      />
    </group>
  );
}
