"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Accent } from "./SectionLabel";

const dot: Record<Accent, string> = {
  moon: "bg-moon",
  lamp: "bg-lamp",
  ink: "bg-ink",
  dusk: "bg-dusk",
};

const text: Record<Accent, string> = {
  moon: "text-moon",
  lamp: "text-lamp",
  ink: "text-ink",
  dusk: "text-dusk",
};

/**
 * The page's structural device: a narrow rail that stays put while its content
 * scrolls past it. It gives every section a fixed point of reference and lets
 * the reading column sit off-centre, which is what stops the page reading as a
 * single stack of centred blocks.
 */
export default function Section({
  id,
  index,
  label,
  title,
  accent = "moon",
  children,
  aside,
}: {
  id: string;
  index: string;
  label: string;
  title?: string;
  accent?: Accent;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section id={id} className="relative border-t border-line px-6 md:px-10">
      <div className="grid md:grid-cols-12 gap-y-10 md:gap-x-10">
        <div className="md:col-span-3 lg:col-span-2 py-10 md:py-20">
          <div className="md:sticky md:top-24">
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`h-1.5 w-1.5 rounded-full ${dot[accent]}`}
              />
              <span className={`font-data text-xs tabular-nums ${text[accent]}`}>{index}</span>
            </div>

            <p className="font-data text-xs uppercase tracking-[0.22em] text-mist mt-4">
              {label}
            </p>

            {/* An oversized ghost numeral, the way a printed section opener carries one. */}
            <span
              aria-hidden
              className="hidden lg:block font-display display-ghost mt-10 select-none"
            >
              {index}
            </span>

            {aside ? <div className="mt-8 hidden md:block">{aside}</div> : null}
          </div>
        </div>

        <div className="md:col-span-9 lg:col-span-10 py-10 md:py-20">
          {title ? (
            <h2 className="sr-only">{title}</h2>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
