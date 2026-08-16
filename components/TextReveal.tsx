"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * The page's one motion idea, stated once: words rise out of the dark into
 * their own clipping box, the way the room resolves as the camera finds it.
 * Everything else on the site is a variation of this, so the scroll reads as
 * one hand rather than a pile of effects.
 */
export default function TextReveal({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.055,
  once = true,
}: {
  children: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const words = children.split(" ");

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="shown"
        viewport={{ once, margin: "-12% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        className="inline"
      >
        {words.map((word, i) => (
          /*
           * Utilities only, no `.line-mask` here: that rule lives outside
           * Tailwind's layer, so its `display: block` beat the per-word
           * `inline-block` and every word landed on its own line.
           */
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                shown: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
