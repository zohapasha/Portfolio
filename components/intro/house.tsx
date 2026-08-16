"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Posters } from "./posters";
import { planks, plaster, stone, type Surface } from "./textures";

/**
 * The wall mass stays dark so the building silhouettes against the sky; the
 * structural pieces (columns, pediment, cornice, steps) are lighter so the
 * architecture reads as architecture rather than a black rectangle.
 */
const EXTERIOR = "#191a23";
const EXTERIOR_LIT = "#3a3e55";
const INTERIOR = "#23232e";
const STONE = "#333750";

function Box({
  position,
  size,
  color = EXTERIOR,
  roughness = 0.95,
  cast = false,
  receive = true,
  surface,
  normalScale = 0.6,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  roughness?: number;
  cast?: boolean;
  receive?: boolean;
  /** Optional procedural surface; without one the box stays flat-shaded. */
  surface?: Surface;
  normalScale?: number;
}) {
  const scale = useMemo(
    () => new THREE.Vector2(normalScale, normalScale),
    [normalScale]
  );

  return (
    <mesh position={position} castShadow={cast} receiveShadow={receive}>
      <boxGeometry args={size} />
      {surface ? (
        <meshStandardMaterial
          color={color}
          map={surface.map}
          roughnessMap={surface.roughnessMap}
          normalMap={surface.normalMap}
          normalScale={scale}
          roughness={1}
          metalness={0}
        />
      ) : (
        <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
      )}
    </mesh>
  );
}

/**
 * Props get chamfered edges. A hard 90° corner catches light as a single flat
 * band and is the clearest tell of untouched box geometry; a small bevel gives
 * every edge a highlight and does most of the work of looking modelled.
 */
function Prop({
  position,
  rotation,
  size,
  color,
  radius = 0.012,
  roughness = 0.7,
  metalness = 0,
  cast = true,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  color: string;
  radius?: number;
  roughness?: number;
  metalness?: number;
  cast?: boolean;
}) {
  const geometry = useMemo(() => {
    const [w, h, d] = size;
    const r = Math.min(radius, w / 2.2, h / 2.2, d / 2.2);
    const shape = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: d - r * 2,
      bevelEnabled: true,
      bevelThickness: r,
      bevelSize: r,
      bevelSegments: 2,
      curveSegments: 3,
    });
    geo.translate(0, 0, -(d - r * 2) / 2);
    geo.computeVertexNormals();
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow={cast} receiveShadow>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

/** A derelict academic hall: portico, pediment, tall windows, one still lit. */
export function House() {
  const wall = useMemo(() => stone(2), []);
  const dressed = useMemo(() => stone(11), []);
  const pediment = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-7.6, 0);
    s.lineTo(7.6, 0);
    s.lineTo(0, 3.1);
    s.closePath();
    return s;
  }, []);

  // The lit window sits at x = -7.6, clear of the columns at -6.4 and -3.9 so
  // nothing bisects it from the approach.
  const darkWindows: [number, number][] = [
    [-4.4, 5.6],
    [4.4, 5.6],
    [7.6, 5.6],
    [-7.6, 2.3],
    [-4.4, 2.3],
    [4.4, 2.3],
    [7.6, 2.3],
  ];

  return (
    <group>
      {/* Facade, composed around the door opening */}
      <Box position={[-5.8, 4.5, 8]} size={[8.4, 9, 0.4]} surface={wall} normalScale={0.35} cast />
      <Box position={[5.8, 4.5, 8]} size={[8.4, 9, 0.4]} surface={wall} normalScale={0.35} cast />
      <Box position={[0, 6.3, 8]} size={[3.2, 5.4, 0.4]} surface={wall} normalScale={0.35} cast />

      {/* Shell */}
      <Box position={[-10, 4.5, 0]} size={[0.4, 9, 16]} surface={wall} normalScale={0.35} />
      <Box position={[10, 4.5, 0]} size={[0.4, 9, 16]} surface={wall} normalScale={0.35} />
      <Box position={[0, 4.5, -8]} size={[20, 9, 0.4]} surface={wall} normalScale={0.35} />
      <Box position={[0, 9.2, 0]} size={[20.4, 0.4, 16.4]} color={STONE} surface={dressed} cast />

      {/* A string course and plinth, so the facade is not one unbroken slab */}
      <Box position={[0, 7.9, 8.28]} size={[20.4, 0.34, 0.24]} color={STONE} surface={dressed} cast />
      <Box position={[0, 0.55, 8.3]} size={[20.4, 1.1, 0.28]} color={STONE} surface={dressed} cast />

      {/* Portico. Columns get a base and capital and a finer mesh — a bare
          cylinder is what makes a colonnade read as pipework. */}
      {[-6.4, -3.9, 3.9, 6.4].map((x) => (
        <group key={x}>
          <mesh position={[x, 4.35, 9.4]} castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.47, 8.1, 28]} />
            <meshStandardMaterial
              color={EXTERIOR_LIT}
              map={dressed.map}
              roughnessMap={dressed.roughnessMap}
              roughness={1}
            />
          </mesh>
          <mesh position={[x, 0.2, 9.4]} castShadow receiveShadow>
            <boxGeometry args={[1.16, 0.4, 1.16]} />
            <meshStandardMaterial color={EXTERIOR_LIT} roughness={0.85} />
          </mesh>
          <mesh position={[x, 8.55, 9.4]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.32, 1.1]} />
            <meshStandardMaterial color={EXTERIOR_LIT} roughness={0.85} />
          </mesh>
        </group>
      ))}
      {/* A fallen column — the building is not being maintained */}
      <mesh position={[-8.9, 0.4, 12.2]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.44, 5.2, 12]} />
        <meshStandardMaterial color={EXTERIOR_LIT} roughness={0.95} />
      </mesh>

      <Box position={[0, 8.85, 9.4]} size={[15.2, 0.7, 2.6]} color={STONE} />
      <mesh position={[0, 9.2, 8.6]}>
        <extrudeGeometry args={[pediment, { depth: 1.6, bevelEnabled: false }]} />
        <meshStandardMaterial color={STONE} roughness={0.95} />
      </mesh>

      {/* Steps */}
      <Box position={[0, 0.12, 11]} size={[17, 0.24, 1.4]} color={STONE} />
      <Box position={[0, 0.36, 11.9]} size={[18, 0.24, 1.4]} color={STONE} />

      {/* Windows: dark, except the one she's working behind. Each gets a
          surround and a mullion cross, so the facade has scale and detail
          instead of flat rectangles punched in a wall. */}
      {[...darkWindows, [-7.6, 5.6] as [number, number]].map(([x, y]) => (
        <group key={`frame-${x}-${y}`} position={[x, y, 8.24]}>
          <Box position={[0, 1.45, -0.02]} size={[1.78, 0.16, 0.14]} color={EXTERIOR_LIT} />
          <Box position={[0, -1.45, -0.02]} size={[1.78, 0.16, 0.14]} color={EXTERIOR_LIT} />
          <Box position={[-0.86, 0, -0.02]} size={[0.14, 3.06, 0.14]} color={EXTERIOR_LIT} />
          <Box position={[0.86, 0, -0.02]} size={[0.14, 3.06, 0.14]} color={EXTERIOR_LIT} />
          <Box position={[0, 0, 0.02]} size={[0.05, 2.7, 0.05]} color={EXTERIOR_LIT} />
          <Box position={[0, 0, 0.02]} size={[1.5, 0.05, 0.05]} color={EXTERIOR_LIT} />
        </group>
      ))}
      {darkWindows.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 8.22]}>
          <planeGeometry args={[1.5, 2.7]} />
          <meshStandardMaterial color="#07070a" roughness={1} />
        </mesh>
      ))}
      <mesh position={[-7.6, 5.6, 8.22]}>
        <planeGeometry args={[1.5, 2.7]} />
        <meshStandardMaterial
          color="#ff8c4a"
          emissive="#ff6a2b"
          emissiveIntensity={1.7}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[-7.6, 5.6, 9.4]} color="#ff6a2b" intensity={9} distance={13} decay={2} />
    </group>
  );
}

/** Hallway and the room beyond it. Only what the camera can see is built. */
export function Interior() {
  const wall = useMemo(() => plaster(1), []);
  const floor = useMemo(() => planks(3, 9), []);
  const ceiling = useMemo(() => plaster(6), []);
  const trim = "#2b2b36";

  return (
    <group>
      {/* Hall */}
      <Box position={[0, -0.1, 4]} size={[5, 0.2, 8]} color="#3a3026" surface={floor} normalScale={0.9} />
      <Box position={[0, 4.1, 4]} size={[5, 0.2, 8]} color={STONE} surface={ceiling} />
      <Box position={[-2.6, 2, 4]} size={[0.2, 4, 8]} color={INTERIOR} surface={wall} normalScale={0.16} />
      <Box position={[2.6, 2, 4]} size={[0.2, 4, 8]} color={INTERIOR} surface={wall} normalScale={0.16} />

      {/* Room shell */}
      <Box position={[0, -0.1, -4]} size={[12, 0.2, 8]} color="#3a3026" surface={floor} normalScale={0.9} />
      <Box position={[0, 4.6, -4]} size={[12, 0.2, 8]} color={STONE} surface={ceiling} />
      <Box position={[-6, 2.25, -4]} size={[0.2, 4.5, 8]} color={INTERIOR} surface={wall} normalScale={0.16} />
      <Box position={[6, 2.25, -4]} size={[0.2, 4.5, 8]} color={INTERIOR} surface={wall} normalScale={0.16} />
      <Box position={[0, 2.25, -8]} size={[12, 4.5, 0.2]} color={INTERIOR} surface={wall} normalScale={0.16} />

      {/* Wall between hall and room, with the doorway gap */}
      <Box position={[-4.25, 2.25, 0]} size={[3.5, 4.5, 0.2]} color={INTERIOR} surface={wall} normalScale={0.16} />
      <Box position={[4.25, 2.25, 0]} size={[3.5, 4.5, 0.2]} color={INTERIOR} surface={wall} normalScale={0.16} />
      <Box position={[0, 4.25, 0]} size={[5, 0.5, 0.2]} color={INTERIOR} surface={wall} normalScale={0.16} />

      {/*
        Skirting and a cased doorway. A wall meeting a floor at a bare 90° edge
        is the other reliable tell of untouched geometry — real rooms have trim,
        and the shadow line under it is what gives the corner depth.
      */}
      <Box position={[-6.02, 0.14, -4]} size={[0.09, 0.28, 8]} color={trim} cast />
      <Box position={[6.02, 0.14, -4]} size={[0.09, 0.28, 8]} color={trim} cast />
      <Box position={[0, 0.14, -7.94]} size={[12, 0.28, 0.09]} color={trim} cast />
      <Box position={[-4.25, 0.14, 0.08]} size={[3.5, 0.28, 0.09]} color={trim} cast />
      <Box position={[4.25, 0.14, 0.08]} size={[3.5, 0.28, 0.09]} color={trim} cast />
      <Box position={[-2.62, 0.14, 4]} size={[0.09, 0.28, 8]} color={trim} cast />
      <Box position={[2.62, 0.14, 4]} size={[0.09, 0.28, 8]} color={trim} cast />

      <Box position={[-2.6, 2.1, 0.06]} size={[0.16, 4.2, 0.14]} color={trim} cast />
      <Box position={[2.6, 2.1, 0.06]} size={[0.16, 4.2, 0.14]} color={trim} cast />
      <Box position={[0, 4.12, 0.06]} size={[5.36, 0.16, 0.14]} color={trim} cast />

      {/* Debris — nobody has kept this wing up in a long time. */}
      <Box position={[-1.9, 0.12, 5.4]} size={[0.9, 0.24, 0.5]} color="#232330" cast />
      <Box position={[2.05, 0.09, 2.6]} size={[0.6, 0.18, 0.7]} color="#232330" cast />
      <Box position={[-4.9, 0.2, -6.2]} size={[1.1, 0.4, 0.6]} color="#262633" cast />
      <Box position={[3.4, 0.07, -5.1]} size={[0.5, 0.14, 0.42]} color="#242431" cast />
      <Box position={[-3.2, 0.05, 2.1]} size={[0.34, 0.1, 0.3]} color="#212129" cast />

      {/*
        The hall has no fixtures of its own. Its light is moonlight falling
        through two holes in the collapsed roof, plus warm spill from the room
        at the far end — which is also what makes the corridor worth walking.
      */}
      {/*
        Pools of moonlight only — an emissive plane in the ceiling read as a
        fluorescent panel, which is exactly wrong for a building with no power.
      */}
      {[2.6, 6.2].map((z) => (
        <pointLight
          key={z}
          position={[0.35, 3.3, z]}
          color="#aebbdd"
          intensity={5}
          distance={7.5}
          decay={1.9}
        />
      ))}
      <pointLight position={[0, 2.7, 7.2]} color="#9fb0d8" intensity={4} distance={10} decay={1.9} />
      <pointLight position={[0, 2.3, -0.3]} color="#ff6a2b" intensity={7} distance={11} decay={1.8} />
    </group>
  );
}

/**
 * The laptop panel shows the actual site: `public/intro/site-screen.png` is a
 * real capture of the hero, so the camera ends inside the page it is about to
 * hand you. Regenerate it with `node capture-screen.mjs` when the hero changes.
 *
 * Basic material and `toneMapped={false}` so the page renders at its own values
 * rather than being relit by the room; bloom then catches only the bright type.
 * Loaded imperatively rather than through `useLoader` so the scene never
 * suspends mid-sequence — the texture simply populates a frame or two late.
 */
/** Desk surface, with grain running along its length. */
function DeskTop() {
  const grain = useMemo(() => planks(21, 4), []);
  const scale = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
  return (
    <mesh position={[0, 0.93, -6.1]} castShadow receiveShadow>
      <boxGeometry args={[3.4, 0.07, 1.5]} />
      <meshStandardMaterial
        color="#5a4634"
        map={grain.map}
        roughnessMap={grain.roughnessMap}
        normalMap={grain.normalMap}
        normalScale={scale}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

/**
 * The room's key light, and its excuse. Once the panel shows a near-black page
 * it stops being a plausible source for a warm room, so the warmth gets a
 * physical origin: a lamp at the back-left of the desk, aimed across so it
 * side-lights her and separates the silhouette from the screen behind it.
 */
function DeskLamp() {
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0.15, 1.0, -5.45);
    return o;
  }, []);

  return (
    <group>
      <mesh position={[-1.52, 1.0, -6.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.13, 0.03, 20]} />
        <meshStandardMaterial color="#3c3c46" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[-1.5, 1.22, -6.46]} rotation={[0.16, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.44, 10]} />
        <meshStandardMaterial color="#3c3c46" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[-1.4, 1.46, -6.36]} rotation={[0.75, 0, 0.35]} castShadow>
        <coneGeometry args={[0.15, 0.2, 20, 1, true]} />
        <meshStandardMaterial color="#4a4a55" roughness={0.35} metalness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Tucked up inside the shade: sitting proud it read as a white disc. */}
      <mesh position={[-1.4, 1.45, -6.35]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial color="#ffcf9a" toneMapped={false} />
      </mesh>

      <primitive object={target} />
      <spotLight
        position={[-1.37, 1.42, -6.32]}
        target={target}
        color="#ffb478"
        intensity={17}
        distance={7}
        angle={1.0}
        penumbra={0.95}
        decay={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0012}
        shadow-normalBias={0.02}
      />
    </group>
  );
}

export const PANEL_WIDTH = 1.04;
const CAPTURE_ASPECT = 1600 / 1000;

function Screen() {
  const { size } = useThree();
  const aspect = size.width / size.height;

  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load("/intro/site-screen.png");
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  /**
   * The panel takes the viewport's aspect so that, at the end of the sequence,
   * it covers the frame exactly on any screen — a fixed 16:10 panel either
   * leaves bezel showing or has to be over-scaled, and over-scaling cropped
   * straight through the "Zoha" in the headline.
   *
   * The capture is then fitted as `cover` through the map's repeat/offset
   * rather than by stretching the plane, so the page keeps its proportions and
   * gives up only the non-binding edge.
   */
  const fit = useMemo(() => {
    if (aspect > CAPTURE_ASPECT) {
      const r = CAPTURE_ASPECT / aspect;
      return { repeat: [1, r] as const, offset: [0, (1 - r) / 2] as const };
    }
    const r = aspect / CAPTURE_ASPECT;
    return { repeat: [r, 1] as const, offset: [(1 - r) / 2, 0] as const };
  }, [aspect]);

  return (
    <mesh position={[0, 0.36, 0.02]}>
      <planeGeometry args={[PANEL_WIDTH, PANEL_WIDTH / aspect]} />
      <meshBasicMaterial
        map={texture}
        map-repeat={fit.repeat}
        map-offset={fit.offset}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * Desk, chair, a seated figure, and the laptop the camera ends inside.
 *
 * The group is rotated a quarter turn and set against the room's left wall, so
 * the screen faces across the room rather than out through the front door. From
 * the approach the room reads as empty and dark; she is only found once the
 * camera is inside and turns. Local +z is the group's forward, which the
 * rotation maps to world +x.
 */
export function Study() {
  return (
    <group position={[0.8, 0, -3.2]} rotation={[0, Math.PI / 2, 0]}>
      {/* Desk: a chamfered top on a slim frame, with a modesty rail behind */}
      <DeskTop />
      {[
        [-1.55, -6.7],
        [1.55, -6.7],
        [-1.55, -5.5],
        [1.55, -5.5],
      ].map(([x, z]) => (
        <Prop
          key={`${x}-${z}`}
          position={[x, 0.45, z]}
          size={[0.07, 0.9, 0.07]}
          color="#212128"
          radius={0.01}
          roughness={0.5}
          metalness={0.35}
        />
      ))}
      <Prop position={[0, 0.72, -6.72]} size={[3.2, 0.22, 0.04]} color="#232329" radius={0.008} />

      {/* Stacked books and a mug — the desk of someone mid-application */}
      <Prop position={[-1.2, 1.015, -6.2]} rotation={[0, 0.06, 0]} size={[0.5, 0.09, 0.34]} color="#3a3138" radius={0.008} />
      <Prop position={[-1.2, 1.105, -6.2]} rotation={[0, -0.04, 0]} size={[0.46, 0.085, 0.32]} color="#2e3240" radius={0.008} />
      <Prop position={[-1.19, 1.19, -6.19]} rotation={[0, 0.09, 0]} size={[0.48, 0.08, 0.33]} color="#42383a" radius={0.008} />
      <mesh position={[1.15, 1.03, -6.0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.075, 0.13, 24]} />
        <meshStandardMaterial color="#3a3a44" roughness={0.35} />
      </mesh>
      <mesh position={[1.24, 1.04, -6.0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.045, 0.011, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#3a3a44" roughness={0.35} />
      </mesh>
      {/* Pens, and a phone face-down beside the keyboard */}
      <mesh position={[0.72, 0.985, -5.62]} rotation={[Math.PI / 2, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.011, 0.011, 0.3, 8]} />
        <meshStandardMaterial color="#4a4048" roughness={0.4} />
      </mesh>
      <Prop position={[-0.95, 0.975, -5.72]} rotation={[0, 0.22, 0]} size={[0.16, 0.02, 0.32]} color="#1b1b21" radius={0.008} roughness={0.25} />

      {/* Chair — kept low so it frames her rather than hiding her */}
      <Prop position={[0, 0.5, -4.85]} size={[0.86, 0.07, 0.78]} color="#22222a" radius={0.02} roughness={0.6} />
      <Prop position={[0, 0.84, -4.5]} rotation={[-0.06, 0, 0]} size={[0.78, 0.62, 0.06]} color="#22222a" radius={0.02} roughness={0.6} />
      <mesh position={[0, 0.24, -4.85]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.46, 12]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.03, -4.85]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.34, 0.05, 20]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Seated figure, read as a silhouette against the screen */}
      <mesh position={[0, 0.8, -5.1]} scale={[1.25, 1, 1]}>
        <capsuleGeometry args={[0.26, 0.52, 4, 12]} />
        <meshStandardMaterial color="#101014" roughness={1} />
      </mesh>
      <mesh position={[0, 1.2, -5.13]}>
        <cylinderGeometry args={[0.07, 0.08, 0.16, 10]} />
        <meshStandardMaterial color="#101014" roughness={1} />
      </mesh>
      <mesh position={[0, 1.42, -5.14]}>
        <sphereGeometry args={[0.155, 20, 20]} />
        <meshStandardMaterial color="#101014" roughness={1} />
      </mesh>
      {/*
        Hair, covering the back of the head the camera actually sees and falling
        past the shoulders — without it the silhouette reads as a bare sphere.
      */}
      <mesh position={[0, 1.43, -5.06]} scale={[1.22, 1.28, 1.18]}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color="#0b0b0e" roughness={1} />
      </mesh>
      <mesh position={[0, 1.16, -5.0]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.33, 0.46, 0.15]} />
        <meshStandardMaterial color="#0b0b0e" roughness={1} />
      </mesh>
      <mesh position={[0, 0.95, -4.99]}>
        <boxGeometry args={[0.25, 0.18, 0.12]} />
        <meshStandardMaterial color="#0b0b0e" roughness={1} />
      </mesh>
      {/* Arms reaching to the keyboard */}
      <mesh position={[-0.3, 1.0, -5.55]} rotation={[0.95, 0, 0.25]}>
        <capsuleGeometry args={[0.075, 0.52, 4, 8]} />
        <meshStandardMaterial color="#0e0e12" roughness={1} />
      </mesh>
      <mesh position={[0.3, 1.0, -5.55]} rotation={[0.95, 0, -0.25]}>
        <capsuleGeometry args={[0.075, 0.52, 4, 8]} />
        <meshStandardMaterial color="#0e0e12" roughness={1} />
      </mesh>

      {/* Laptop: brushed aluminium body, keyboard well, glowing panel */}
      <Prop
        position={[0, 0.985, -5.95]}
        size={[1.16, 0.028, 0.78]}
        color="#4a4a55"
        radius={0.012}
        roughness={0.34}
        metalness={0.7}
      />
      <Prop
        position={[0, 1.0, -6.03]}
        size={[0.96, 0.006, 0.42]}
        color="#191920"
        radius={0.004}
        roughness={0.6}
        cast={false}
      />
      <Prop
        position={[0, 1.0, -5.68]}
        size={[0.34, 0.006, 0.2]}
        color="#22222a"
        radius={0.004}
        roughness={0.5}
        cast={false}
      />
      <group position={[0, 1.0, -6.32]} rotation={[-0.22, 0, 0]}>
        <Prop
          position={[0, 0.36, 0]}
          size={[1.16, 0.72, 0.026]}
          color="#4a4a55"
          radius={0.012}
          roughness={0.34}
          metalness={0.7}
        />
        <Screen />
      </group>

      <Posters />

      <DeskLamp />

      {/*
        Cool spill from the panel itself. The site is near-black, so it throws
        almost nothing — just enough to catch the edge of her and the desk in
        front of the screen, which is what a real monitor does in a dark room.
      */}
      <pointLight position={[0, 1.28, -6.1]} color="#93a9d6" intensity={1.5} distance={2.6} decay={2} />

      <pointLight position={[0, 2.6, -3]} color="#ff6a2b" intensity={5} distance={12} decay={1.8} />
      {/* Lifts the pinned wall enough to be legible during the reveal. */}
      <pointLight position={[0, 2.1, -5.9]} color="#ffb184" intensity={3.4} distance={4.2} decay={1.8} />
    </group>
  );
}

/** Bare trees around the grounds, kept clear of the approach down the axis. */
export function Trees() {
  const spots: [number, number, number][] = [
    [-19, 0, 15],
    [18, 0, 12],
    [-23, 0, 3],
    [22, 0, -1],
    [-16, 0, 24],
    [15, 0, 26],
    [-25, 0, 19],
    [26, 0, 21],
  ];
  const branches = [
    { y: 2.9, tilt: 0.75, spin: 0.2, len: 2.6 },
    { y: 3.5, tilt: 0.6, spin: 2.3, len: 2.9 },
    { y: 3.9, tilt: 0.85, spin: 4.1, len: 2.2 },
    { y: 4.4, tilt: 0.5, spin: 5.4, len: 2.4 },
    { y: 4.9, tilt: 0.7, spin: 3.2, len: 1.8 },
  ];

  return (
    <group>
      {spots.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, i * 0.85, 0]} scale={0.9 + (i % 3) * 0.18}>
          <mesh position={[0, 2.4, 0]}>
            <cylinderGeometry args={[0.14, 0.34, 4.8, 7]} />
            <meshStandardMaterial color="#0f1017" roughness={1} />
          </mesh>
          {branches.map((b, j) => (
            <mesh
              key={j}
              position={[0, b.y, 0]}
              rotation={[b.tilt, b.spin + i, 0]}
            >
              <cylinderGeometry args={[0.035, 0.11, b.len, 5]} />
              <meshStandardMaterial color="#0f1017" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
