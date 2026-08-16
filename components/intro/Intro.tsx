"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Bloom, EffectComposer, N8AO, Noise, Vignette } from "@react-three/postprocessing";
import { House, Interior, Study, Trees } from "./house";
import { createTypeAudio, type TypeAudio } from "./audio";

/**
 * One continuous camera move, not a sequence of cuts.
 *
 * The path is a Catmull-Rom spline through eleven control points, so the camera
 * never changes direction abruptly — it banks through the doorway and around
 * into the room the way a real operator would walk it. Timing is separate from
 * geometry: a set of time→position anchors advances the camera slowly while a
 * line is being read and quickly across the stretches between framings, which
 * is what keeps a continuous take from dragging the way the first one did.
 */
type Vec3 = [number, number, number];

/**
 * Control points spaced roughly evenly along the move, so travelling at a
 * steady rate through them also looks steady on screen. The camera drifts in
 * from off-axis, squares up on the doorway, runs the hall, and swings left into
 * the room without ever reversing or stopping.
 */
const PATH: { p: Vec3; l: Vec3 }[] = [
  // The building is 20 units wide and 12 tall, so it still reads as a wide
  // establishing framing from here. Starting further out looked no wider but
  // put two thirds of the path outdoors, which left the hall and the room
  // fighting over the remaining seconds.
  { p: [7.8, 3.5, 32.0], l: [0, 4.9, 3] }, // -4 · wide on the building
  { p: [7.3, 3.4, 29.0], l: [0, 4.75, 3] }, // -3
  { p: [6.1, 3.15, 23.2], l: [0, 4.5, 2.5] }, // -2
  { p: [5.3, 3.0, 20.3], l: [0, 4.35, 1.8] }, // -1
  { p: [4.6, 2.85, 17.5], l: [0, 4.2, 1] }, //  0
  { p: [3.7, 2.7, 14.8], l: [0, 3.9, 0] }, //  1 · the line lands here
  { p: [2.8, 2.55, 12.0], l: [0, 3.5, -1] }, //  2
  { p: [1.9, 2.4, 9.4], l: [0, 3.0, -1.8] }, //  3 · about to pass the facade
  { p: [1.0, 2.25, 6.8], l: [-0.3, 2.4, -2.4] }, //  4 · inside, down the hall
  { p: [0.45, 2.15, 4.0], l: [-0.9, 2.2, -2.9] }, //  5
  { p: [0.4, 2.1, 1.2], l: [-1.8, 1.95, -3.2] }, //  6
  { p: [0.8, 2.14, -1.4], l: [-3.2, 1.7, -3.4] }, //  7 · through into the room
  { p: [0.5, 2.12, -2.4], l: [-4.0, 1.62, -3.35] }, //  8 · the line lands here
  { p: [-0.6, 2.06, -2.95], l: [-4.8, 1.58, -3.25] }, //  9 · swinging onto the desk
  { p: [-1.9, 1.99, -3.12], l: [-5.25, 1.5, -3.2] }, // 10 · the desk, line lands here
  { p: [-2.9, 1.92, -3.17], l: [-5.38, 1.44, -3.2] }, // 11
  { p: [-3.9, 1.8, -3.2], l: [-5.5, 1.38, -3.2] }, // 12 · over her shoulder
  { p: [-4.75, 1.54, -3.2], l: [-5.58, 1.356, -3.2] }, // 13 · replaced by the exact fill
];

const TOTAL = 12400;

/**
 * A single velocity profile for the whole move: eased up from rest over the
 * first tenth, then decaying steadily to a stop at the screen.
 *
 * The previous version keyed time to a list of anchors and eased between them,
 * which drove velocity to zero at every anchor — the camera stopped eight
 * times, and that stop-start is what read as tacky rather than as one shot.
 * Here speed only ever changes gradually and never reaches zero mid-move, so
 * the take is continuous; the decay is what gives the close framings more time
 * than the open ground without anyone having to hold on them.
 */
const ARRIVAL = (() => {
  const steps = 512;
  const table = new Float32Array(steps + 1);
  let sum = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ramp = t < 0.1 ? smoothstep(t / 0.1) : 1;
    // The exponent trades the approach against the interior, and it is fussy:
    // solved so that the quarter-points of the move land on the phase changes
    // (outside ≈ 48% of the path, the hall another 24%). Steeper and the
    // exterior is eaten in the first second, so the opening line lands at the
    // portico instead of on the building; shallower and the camera is still
    // crossing the room when it runs out of time.
    // The floor matters as much as the exponent: decaying to a true zero made
    // the last second of the push into the screen crawl to a near-stall and
    // then end, which read as sticking. Keeping ~14% of peak speed all the way
    // through means the camera is still gliding when it arrives.
    sum += ramp * (Math.pow(1 - t, 4) * 0.88 + 0.12);
    table[i] = sum;
  }
  for (let i = 0; i <= steps; i++) table[i] /= sum;
  return table;
})();

function smoothstep(x: number) {
  return x * x * (3 - 2 * x);
}

/** Fraction of the path covered at a given moment. */
function distanceAt(elapsed: number) {
  const t = Math.min(1, Math.max(0, elapsed / TOTAL));
  const scaled = t * (ARRIVAL.length - 1);
  const i = Math.min(ARRIVAL.length - 2, Math.floor(scaled));
  const f = scaled - i;
  return ARRIVAL[i] + (ARRIVAL[i + 1] - ARRIVAL[i]) * f;
}

const LINES = [
  "Hi, I'm Zoha. I'm glad you found me.",
  "Welcome to my house. And my room.",
  "This is where you'll usually find me, with a hundred tabs open, figuring something out.",
  "It's usually a little chaotic in here.",
];

const LEAD_IN = 500;
const MS_PER_CHAR = 48;
/** A breath between sentences — long enough to read a full stop, short enough
 *  that the keys never actually stop. */
const BREATH = 450;
/** The opening fade up from black. */
const OPEN_MS = 620;

/**
 * One unbroken typing pass, rather than four windows with gaps between them.
 *
 * Each line starts the instant the previous one has finished and taken its
 * breath, so there is always a caret moving and the narration reads as someone
 * typing to you in real time. The rate is derived from the copy rather than
 * fixed, so the whole pass lands just before the camera reaches the screen; the
 * lines then fall naturally onto the framings they describe — the greeting on
 * the wide house, the welcome as the door is reached, the desk line across the
 * room, and the last one closing on the laptop.
 */
const SCHEDULE = (() => {
  let at = LEAD_IN;
  return LINES.map((text, i) => {
    const from = at;
    at = from + text.length * MS_PER_CHAR + (i === LINES.length - 1 ? 0 : BREATH);
    return { text, from, until: at };
  });
})();

/** Which line is showing, and how much of it has been typed. */
function lineAt(ms: number) {
  if (ms < LEAD_IN) return { index: -1, text: "", typed: 0 };
  const index = Math.max(
    0,
    SCHEDULE.findIndex((l, i) => ms < l.until || i === SCHEDULE.length - 1)
  );
  const line = SCHEDULE[index];
  const typed = Math.max(
    0,
    Math.min(line.text.length, Math.floor((ms - line.from) / MS_PER_CHAR))
  );
  return { index, text: line.text, typed };
}

/** The laptop panel in world space, for parking the camera on the match cut. */
const PANEL = {
  center: new THREE.Vector3(-5.579, 1.3557, -3.2),
  normal: new THREE.Vector3(0.9759, 0.2182, 0),
  width: 1.04,
};

function rand(i: number) {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

const look = new THREE.Vector3();

/** Builds the two curves plus the path fraction at which each control point sits. */
export function buildRoute(aspect: number) {
  // The final control point is wherever the panel exactly covers this frame,
  // so the take ends on the hero rather than near it.
  const half = Math.tan(THREE.MathUtils.degToRad(42) / 2);
  const distance = (PANEL.width / aspect / 2 / half) * 0.995;
  const end = PANEL.normal.clone().multiplyScalar(distance).add(PANEL.center);

  const positions = PATH.map((k, i) =>
    i === PATH.length - 1 ? end : new THREE.Vector3(...k.p)
  );
  const position = new THREE.CatmullRomCurve3(positions, false, "centripetal");
  const target = new THREE.CatmullRomCurve3(
    PATH.map((k) => new THREE.Vector3(...k.l)),
    false,
    "centripetal"
  );

  /**
   * Normalised arc length at each sampled curve parameter. Built by hand rather
   * than via the curve's own helper so the mapping is explicit in both
   * directions — the camera needs parameter-from-distance every frame, and the
   * captions need distance-from-parameter once.
   */
  const samples = 2400;
  const lengths = new Float32Array(samples + 1);
  let travelled = 0;
  let previous = position.getPoint(0);
  const scratch = new THREE.Vector3();
  for (let i = 1; i <= samples; i++) {
    position.getPoint(i / samples, scratch);
    travelled += scratch.distanceTo(previous);
    lengths[i] = travelled;
    previous = scratch.clone();
  }
  for (let i = 0; i <= samples; i++) lengths[i] /= travelled || 1;

  const distanceToParam = (s: number) => {
    let lo = 0;
    let hi = samples;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (lengths[mid] < s) lo = mid;
      else hi = mid;
    }
    const span = lengths[hi] - lengths[lo];
    const f = span > 0 ? (s - lengths[lo]) / span : 0;
    return (lo + f) / samples;
  };

  const paramToDistance = (t: number) => {
    const scaled = Math.min(1, Math.max(0, t)) * samples;
    const i = Math.min(samples - 1, Math.floor(scaled));
    const f = scaled - i;
    return lengths[i] + (lengths[i + 1] - lengths[i]) * f;
  };

  // Where each control point falls along the distance travelled — the numbers
  // the caption windows were set against.
  const anchors = PATH.map((_, i) => paramToDistance(i / (PATH.length - 1)));

  return { position, target, anchors, distanceToParam };
}

function Rig({
  elapsed,
  onReady,
}: {
  elapsed: React.RefObject<number>;
  onReady: () => void;
}) {
  const { size } = useThree();
  const route = useMemo(
    () => buildRoute(size.width / Math.max(1, size.height)),
    [size.width, size.height]
  );

  // The take must not start until there is something on screen to see. R3F
  // mounts its canvas only once the container has been measured, which on a
  // cold load is seconds after this component mounts — long enough that the
  // camera was already down the hall by the first visible frame.
  const announced = useRef(false);
  useFrame(({ camera, clock }) => {
    if (!announced.current) {
      announced.current = true;
      onReady();
    }
    const covered = distanceAt(elapsed.current ?? 0);
    // Sampling both curves at the same curve parameter keeps the aim locked to
    // the position; sampling each by its own arc length would drift them apart.
    const t = route.distanceToParam(covered);

    route.position.getPoint(t, camera.position);
    route.target.getPoint(t, look);

    // A slow handheld wander, easing off as the camera settles onto the screen
    // so the final frame lines up cleanly with the page underneath.
    const settle = 1 - Math.min(1, Math.max(0, (covered - 0.9) / 0.1));
    const e = clock.elapsedTime;
    const sway = 0.017 * settle;
    camera.position.x += Math.sin(e * 0.62) * sway;
    camera.position.y += Math.sin(e * 0.87 + 1.3) * sway * 0.7;
    look.x += Math.sin(e * 0.41 + 2.1) * sway * 0.5;
    look.y += Math.cos(e * 0.53) * sway * 0.4;

    camera.lookAt(look);
  });

  return null;
}

/**
 * A night gradient standing behind everything. Without it the house is the same
 * value as the sky and the silhouette disappears.
 */
function SkyDome() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#070b16");
    g.addColorStop(0.5, "#111b35");
    g.addColorStop(0.82, "#26345f");
    g.addColorStop(1, "#41537f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[170, 32, 24]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} depthWrite={false} />
    </mesh>
  );
}

function Stars() {
  const geometry = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < 700; i++) {
      const theta = rand(i) * Math.PI * 2;
      const phi = rand(i + 5000) * Math.PI * 0.42;
      const r = 120;
      points.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) + 8,
        r * Math.sin(phi) * Math.sin(theta)
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#cfd6e6" size={0.42} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

/** Dust hanging in the lamp light — the room has been sat in for a long time. */
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < 70; i++) {
      points.push(
        -3.2 - rand(i) * 2.6,
        rand(i + 900) * 1.7 + 0.7,
        -3.2 + (rand(i + 1800) - 0.5) * 3.2
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.035;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#ffb184" size={0.028} sizeAttenuation transparent opacity={0.32} />
    </points>
  );
}

function Scene({
  elapsed,
  onReady,
}: {
  elapsed: React.RefObject<number>;
  onReady: () => void;
}) {
  return (
    <>
      <color attach="background" args={["#06060a"]} />
      <fogExp2 attach="fog" args={["#0a0e1b", 0.0075]} />

      {/* Moonlight only — the building has no power of its own. */}
      <ambientLight intensity={0.32} color="#7f8db3" />
      <directionalLight position={[-22, 24, 30]} intensity={0.7} color="#aebbdd" />
      {/* Rim from behind, so the roofline separates from the sky. */}
      <directionalLight position={[14, 18, -34]} intensity={0.5} color="#8fa2ce" />

      <SkyDome />
      {/* Clear of the roofline — behind the pediment it read as a half disc. */}
      <mesh position={[-88, 74, -70]}>
        <sphereGeometry args={[4.4, 24, 24]} />
        <meshBasicMaterial color="#e8eeff" fog={false} toneMapped={false} />
      </mesh>
      <Stars />
      <Trees />
      <House />
      <Interior />
      <Study />
      <Dust />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#0d1019" roughness={1} />
      </mesh>

      <Rig elapsed={elapsed} onReady={onReady} />

      {/*
        Bloom is what sells the emissive surfaces as light sources rather than as
        bright paint; ambient occlusion darkens the creases lighting alone leaves
        flat, and vignette and grain do the rest of the work of making this read
        as photographed.
      */}
      <EffectComposer>
        <N8AO aoRadius={0.55} intensity={2.6} distanceFalloff={0.9} quality="medium" />
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.62}
          luminanceSmoothing={0.32}
          mipmapBlur
          radius={0.7}
        />
        <Vignette offset={0.3} darkness={0.7} />
        <Noise opacity={0.03} premultiply />
      </EffectComposer>
    </>
  );
}

/** `?introT=0.45` freezes the take at one point, for verifying framing. */
function readSeek() {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("introT");
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : null;
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const seek = useMemo(() => readSeek(), []);
  const seekMs = seek === null ? null : seek * TOTAL;

  const elapsed = useRef(seekMs ?? 0);
  const [caption, setCaption] = useState(() => lineAt(seekMs ?? 0));
  const [veil, setVeil] = useState(() => (seekMs === null ? 1 : 0));
  const [leaving, setLeaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  const finished = useRef(false);
  const audio = useRef<TypeAudio | null>(null);
  const lastTyped = useRef({ index: -1, typed: 0 });

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    audio.current?.stop();
    audio.current = null;
    setLeaving(true);
    window.setTimeout(onDone, 900);
  }, [onDone]);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      if (on) {
        audio.current?.stop();
        audio.current = null;
        return false;
      }
      // Created inside the click, which is the gesture autoplay policy needs.
      audio.current = createTypeAudio();
      audio.current.resume();
      return true;
    });
  }, []);

  useEffect(() => () => audio.current?.stop(), []);

  useEffect(() => {
    if (seekMs !== null) {
      elapsed.current = seekMs;
      return;
    }
    if (!ready) return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const ms = now - start;
      elapsed.current = ms;

      const next = lineAt(ms);
      setCaption((prev) =>
        prev.index === next.index && prev.typed === next.typed ? prev : next
      );

      // One click per newly revealed character; a lower thunk when a line lands.
      const last = lastTyped.current;
      if (next.index !== last.index) {
        lastTyped.current = { index: next.index, typed: 0 };
      } else if (next.typed > last.typed) {
        if (last.typed < next.text.length && next.typed >= next.text.length) {
          audio.current?.ret();
        } else {
          audio.current?.key();
        }
        lastTyped.current = { index: next.index, typed: next.typed };
      }

      setVeil(ms < OPEN_MS ? 1 - ms / OPEN_MS : 0);

      // Clear the slate before the hand-off, so the last frame is only the page.
      setClosing(ms > TOTAL - 560);

      if (ms >= TOTAL) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish, seekMs, ready]);

  const typedText = caption.text.slice(0, caption.typed);
  const typing = caption.index !== -1 && caption.typed < caption.text.length;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#06060a] transition-opacity duration-[900ms] ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <Canvas
        shadows="soft"
        camera={{ fov: 42, near: 0.08, far: 260, position: [7.8, 3.5, 32] }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          // ACES crushes this scene's shadow end; a small lift, not a flood.
          toneMappingExposure: 1.12,
        }}
      >
        <Scene elapsed={elapsed} onReady={handleReady} />
      </Canvas>

      {/*
        Narration typed out as a film slate rather than a centered title card.
        Sentence case: the lines are conversational, and setting "an unreasonable
        number of tabs" in tracked caps flattens the joke. The rule aligns to the
        cap line so it holds when the long line wraps.
      */}
      <div
        className={`pointer-events-none absolute bottom-14 left-8 md:left-12 right-8 flex items-start gap-5 transition-opacity duration-500 ${
          caption.index !== -1 && !closing ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="mt-4 h-px w-10 shrink-0 bg-moon" />
        <p className="font-data max-w-3xl text-lg md:text-2xl leading-snug tracking-[0.01em] text-parchment">
          {typedText}
          <span
            className={`ml-1 inline-block h-[0.95em] w-[0.5em] translate-y-[0.08em] bg-moon ${
              typing ? "" : "caret"
            }`}
          />
        </p>
      </div>

      <div
        className={`absolute bottom-8 right-8 flex items-center gap-6 transition-opacity duration-500 ${
          closing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <button
          onClick={toggleSound}
          aria-pressed={soundOn}
          className="font-data text-xs uppercase tracking-[0.18em] text-mist hover:text-parchment transition-colors cursor-pointer"
        >
          Sound {soundOn ? "on" : "off"}
        </button>
        <button
          onClick={finish}
          className="font-data text-xs uppercase tracking-[0.18em] text-mist hover:text-parchment transition-colors cursor-pointer"
        >
          Skip intro
        </button>
      </div>

      {/* Fade up from black at the open. There are no cuts to cover. */}
      <div
        data-veil
        className="pointer-events-none absolute inset-0 bg-[#06060a]"
        style={{ opacity: veil }}
      />
    </div>
  );
}
