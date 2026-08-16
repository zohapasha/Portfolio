"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The site's single entrance gesture: content rises from just below its resting
 * position as it enters view. One motion, used everywhere, so the page reads as
 * one hand rather than a collection of effects.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
