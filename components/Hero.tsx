"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "@/lib/data";

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, delay: 0.2 + i * 0.11, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/** Each line of the name rises out of its own clipping box, as in the intro. */
function NameLine({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="line-mask">
      <motion.span
        className="block"
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.25, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/** Facts that a reviewer skims for, given their own cells rather than a sentence. */
const facts = [
  { k: "CGPA", v: "3.86", note: "of 4.00" },
  { k: "Honours", v: "6", note: "Dean's ×4 · Rector's ×2" },
  { k: "Next", v: "2026", note: "AI/ML roles · grad study" },
];

export default function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The name drifts up slower than the page, so leaving the hero feels like the
  // camera pulling back rather than the content sliding away.
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0.2]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] flex flex-col px-6 md:px-10">
      {/* A hairline grid, so the page sits on visible structure rather than in space. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-6 right-6 md:left-10 md:right-10 hidden lg:grid grid-cols-12"
      >
        {Array.from({ length: 13 }, (_, i) => (
          <span
            key={i}
            className="col-span-1 border-l border-line/40 last:border-r"
            style={{ gridColumn: i + 1 }}
          />
        ))}
      </div>

      <motion.div style={{ y: nameY, opacity: fade }} className="relative flex-1 flex flex-col justify-center pt-28">
        <motion.p
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="font-data text-xs uppercase tracking-[0.22em] text-mist mb-8 flex items-center gap-3"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lamp shadow-[0_0_12px_2px_var(--lamp)]" />
          {profile.role}
        </motion.p>

        <div className="grid lg:grid-cols-12 gap-x-10 items-end">
          <h1 className="font-display display-xl lg:col-span-7">
            <NameLine text="Zoha" delay={0.28} />
            <NameLine text="Pasha" delay={0.42} />
          </h1>

          <motion.div
            custom={3}
            variants={rise}
            initial="hidden"
            animate="show"
            className="lg:col-span-4 lg:col-start-9 mt-8 lg:mt-0 lg:pb-4"
          >
            <p className="text-lg md:text-xl leading-relaxed text-mist">{profile.tagline}</p>
            <div className="mt-6 flex items-center gap-4">
              <span className="relative h-px w-12 overflow-hidden bg-line">
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/2 bg-moon"
                  animate={reduced ? undefined : { x: ["-100%", "200%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                />
              </span>
              <span className="font-data text-xs uppercase tracking-[0.22em] text-mist">
                {profile.location}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* A closing band of hard facts — the density the top of the page was missing. */}
      <motion.dl
        custom={5}
        variants={rise}
        initial="hidden"
        animate="show"
        className="relative grid grid-cols-3 border-t border-line"
      >
        {facts.map((f, i) => (
          <div
            key={f.k}
            className={`py-6 md:py-8 ${i > 0 ? "border-l border-line pl-5 md:pl-8" : "pr-5"}`}
          >
            <dt className="font-data text-xs uppercase tracking-[0.22em] text-mist">{f.k}</dt>
            <dd className="font-display text-3xl md:text-5xl font-semibold tracking-tight mt-2">
              {f.v}
            </dd>
            <p className="font-data text-xs text-mist/70 mt-1">{f.note}</p>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
