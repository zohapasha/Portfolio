"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const clientSnapshot = () => window.matchMedia(QUERY).matches;
const serverSnapshot = () => false;

/**
 * Framer Motion's own `useReducedMotion` reads the media query during the first
 * client render, so a component that changes its markup on the result renders a
 * different tree than the server sent and React throws a hydration mismatch.
 * `useSyncExternalStore` is the sanctioned way out: React hydrates against the
 * server snapshot, then re-renders with the real value straight afterwards, so
 * the branch is safe to take in render.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
