"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

/**
 * The WebGL bundle is a few hundred KB and takes a moment on a cold cache.
 * Without a fallback the visitor sees the finished site first, then has the
 * intro slam over the top of it — so the fallback holds the same black ground
 * the first frame opens on, and the sequence reads as one piece.
 */
const Intro = dynamic(() => import("./Intro"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[100] bg-[#06060a]">
      <span className="absolute bottom-14 left-8 md:left-12 font-data text-xs uppercase tracking-[0.22em] text-mist">
        Loading
      </span>
    </div>
  ),
});

const SEEN_KEY = "zp-intro-seen";

/**
 * Cached so the snapshot is referentially stable across renders, which
 * useSyncExternalStore requires.
 */
let decision: boolean | null = null;

function eligibleOnClient() {
  if (decision !== null) return decision;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
  const tooSmall = window.innerWidth < 480;
  decision = !reduced && !seen && !tooSmall;
  return decision;
}

const subscribe = () => () => {};
const neverOnServer = () => false;

/**
 * Decides whether the sequence plays. It runs once per session, never for
 * visitors who ask for reduced motion, and never on a screen too small to read
 * it — everyone else gets the site immediately.
 */
export default function IntroGate() {
  const eligible = useSyncExternalStore(subscribe, eligibleOnClient, neverOnServer);
  const [dismissed, setDismissed] = useState(false);
  const playing = eligible && !dismissed;

  // Body-state only. The seen flag is deliberately NOT written here: on the
  // hydration pass `playing` is still false, so writing it from this effect
  // marked the intro as seen before it had a chance to play, and it never ran
  // again for the rest of the session.
  useEffect(() => {
    if (!playing) return;
    document.body.dataset.intro = "running";
    return () => {
      delete document.body.dataset.intro;
    };
  }, [playing]);

  if (!playing) return null;

  return (
    <Intro
      onDone={() => {
        window.sessionStorage.setItem(SEEN_KEY, "1");
        decision = false;
        setDismissed(true);
      }}
    />
  );
}
