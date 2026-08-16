"use client";

import { motion } from "framer-motion";

/**
 * Each section carries its own light. The accents are the intro's: moonlight,
 * lamplight, the red pen on her wall, and the dusk band between them — so the
 * colour changing as you scroll still reads as one palette.
 */
export type Accent = "moon" | "lamp" | "ink" | "dusk";

const dot: Record<Accent, string> = {
  moon: "bg-moon",
  lamp: "bg-lamp",
  ink: "bg-ink",
  dusk: "bg-dusk",
};

const glow: Record<Accent, string> = {
  moon: "shadow-[0_0_14px_2px_var(--moon)]",
  lamp: "shadow-[0_0_14px_2px_var(--lamp)]",
  ink: "shadow-[0_0_14px_2px_var(--ink)]",
  dusk: "shadow-[0_0_14px_2px_var(--dusk)]",
};

export default function SectionLabel({
  children,
  accent = "moon",
  index,
}: {
  children: string;
  accent?: Accent;
  index?: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-12 md:mb-16">
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`h-1.5 w-1.5 rounded-full ${dot[accent]} ${glow[accent]}`}
      />
      {index ? (
        <span className="font-data text-xs tabular-nums text-mist/70">{index}</span>
      ) : null}
      <span className="font-data text-xs uppercase tracking-[0.22em] text-mist">
        {children}
      </span>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        className="h-px flex-1 origin-left bg-gradient-to-r from-line to-transparent"
      />
    </div>
  );
}
