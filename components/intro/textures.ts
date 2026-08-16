"use client";

import * as THREE from "three";

/**
 * Procedural surface maps, painted on a canvas at load.
 *
 * Flat solid colour on a clean box is the single clearest tell of untextured 3D:
 * a real wall is never one value, and a surface with no normal detail catches
 * light as an even wash. These generate albedo, roughness and normal maps from
 * seeded value noise, so there are no asset files to download and nothing that
 * can 404 mid-sequence.
 */

export type Surface = {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
};

/**
 * Integer bit-mixing rather than the usual `sin(dot(...)) * large` trick. Each
 * surface evaluates several octaves of noise per pixel, and at that volume the
 * transcendental version costs millions of `Math.sin` calls and blocks the main
 * thread long enough to delay the first frame by seconds.
 */
function hash(x: number, y: number, seed: number) {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263 + (seed | 0) * 1274126177;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967296;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

function fbm(x: number, y: number, seed: number, octaves: number) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;
  for (let i = 0; i < octaves; i++) {
    value += valueNoise(x * frequency, y * frequency, seed + i * 13) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / total;
}

function canvasOf(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function textureOf(canvas: HTMLCanvasElement, repeat: [number, number], srgb: boolean) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Sobel-style height-to-normal conversion. */
function normalFromHeight(height: Float32Array, size: number, strength: number) {
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const image = ctx.createImageData(size, size);

  const at = (x: number, y: number) =>
    height[((y + size) % size) * size + ((x + size) % size)];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * size + x) * 4;
      image.data[i] = ((dx / len) * 0.5 + 0.5) * 255;
      image.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      image.data[i + 2] = (1 / len) * 255;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

type FieldFn = (u: number, v: number) => { height: number; tone: number; rough: number };

/**
 * Surfaces are shared across every mesh that asks for the same one, so the
 * three maps are painted once per kind rather than once per wall — and survive
 * a remount of the sequence.
 */
const cache = new Map<string, Surface>();

function cached(key: string, make: () => Surface) {
  const hit = cache.get(key);
  if (hit) return hit;
  const made = make();
  cache.set(key, made);
  return made;
}

function build(size: number, repeat: [number, number], strength: number, field: FieldFn): Surface {
  const albedo = canvasOf(size);
  const rough = canvasOf(size);
  const aCtx = albedo.getContext("2d");
  const rCtx = rough.getContext("2d");
  const height = new Float32Array(size * size);

  if (!aCtx || !rCtx) {
    throw new Error("2D canvas unavailable");
  }

  const aImg = aCtx.createImageData(size, size);
  const rImg = rCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const s = field(x / size, y / size);
      const i = (y * size + x) * 4;
      height[y * size + x] = s.height;

      const tone = Math.max(0, Math.min(1, s.tone)) * 255;
      aImg.data[i] = tone;
      aImg.data[i + 1] = tone;
      aImg.data[i + 2] = tone;
      aImg.data[i + 3] = 255;

      const r = Math.max(0, Math.min(1, s.rough)) * 255;
      rImg.data[i] = r;
      rImg.data[i + 1] = r;
      rImg.data[i + 2] = r;
      rImg.data[i + 3] = 255;
    }
  }

  aCtx.putImageData(aImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  return {
    map: textureOf(albedo, repeat, true),
    roughnessMap: textureOf(rough, repeat, false),
    normalMap: textureOf(normalFromHeight(height, size, strength), repeat, false),
  };
}

/**
 * Plaster: broad mottling with damp patches low on the wall. The albedo stays
 * near white so the material's `color` still does the tinting.
 */
export function plaster(seed = 1): Surface {
  return cached(`plaster${seed}`, () => plasterMaps(seed));
}

function plasterMaps(seed: number): Surface {
  // Low tiling and a broad-dominant height field: a fine, high-amplitude grain
  // here rendered as popcorn stucco rather than as a painted wall, and grazing
  // lamp light exaggerates whatever survives.
  return build(256, [1, 1], 0.9, (u, v) => {
    const broad = fbm(u * 4, v * 4, seed, 4);
    const grain = fbm(u * 12, v * 12, seed + 5, 2);
    const damp = Math.max(0, fbm(u * 3, v * 3 + 1.5, seed + 9, 3) - 0.45) * 1.6;
    const tone = 0.84 + broad * 0.16 - damp * 0.26 + grain * 0.04;
    return {
      height: broad * 0.82 + grain * 0.18,
      tone,
      rough: 0.74 + grain * 0.16 + damp * 0.1,
    };
  });
}

/** Coarser and more pitted, for exterior stone. */
export function stone(seed = 2): Surface {
  return cached(`stone${seed}`, () => stoneMaps(seed));
}

function stoneMaps(seed: number): Surface {
  return build(256, [4, 2], 3.4, (u, v) => {
    const block = fbm(u * 8, v * 8, seed, 3);
    const pit = fbm(u * 90, v * 90, seed + 3, 2);
    const streak = fbm(u * 2, v * 22, seed + 7, 3);
    const tone = 0.7 + block * 0.24 + pit * 0.1 - streak * 0.12;
    return {
      height: pit * 0.7 + block * 0.3,
      tone,
      rough: 0.8 + pit * 0.18,
    };
  });
}

/**
 * Boards running in one direction, with a seam every eighth of the tile and
 * grain drawn along the length.
 */
export function planks(seed = 3, boards = 8): Surface {
  return cached(`planks${seed}-${boards}`, () => plankMaps(seed, boards));
}

function plankMaps(seed: number, boards: number): Surface {
  return build(256, [3, 3], 2.8, (u, v) => {
    const row = Math.floor(v * boards);
    const withinRow = v * boards - row;
    const seam = Math.min(withinRow, 1 - withinRow);
    const seamDark = seam < 0.035 ? 1 - seam / 0.035 : 0;

    // Offset each board so the grain does not line up across seams.
    const offset = hash(row, 0, seed) * 10;
    const grain = fbm(u * 26 + offset, row * 3.3 + v * 2, seed + 2, 3);
    const boardTone = 0.78 + hash(row, 1, seed) * 0.16;

    const tone = boardTone * (0.86 + grain * 0.2) - seamDark * 0.45;
    return {
      height: grain * 0.55 - seamDark * 1.2,
      tone,
      rough: 0.6 + grain * 0.22 + seamDark * 0.2,
    };
  });
}
