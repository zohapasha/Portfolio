"use client";

import { motion } from "framer-motion";
import Section from "./Section";
import type { Accent } from "./SectionLabel";
import TextReveal from "./TextReveal";
import { focuses } from "@/lib/data";
import { ConvolutionVisual, AttentionVisual, NetworkVisual } from "./Visuals";

/** One light per research area, drawn from the intro's own three. */
const accents: Record<string, { key: Accent; css: string; text: string }> = {
  vision: { key: "moon", css: "var(--moon)", text: "text-moon" },
  llms: { key: "lamp", css: "var(--lamp)", text: "text-lamp" },
  "deep-learning": { key: "dusk", css: "var(--dusk)", text: "text-dusk" },
};

export default function FocusSection() {
  return (
    <Section id="focus" index="01" label="What I work on" accent="moon">
      <div className="flex flex-col gap-24 md:gap-36">
        {focuses.map((f, i) => {
          const flip = i % 2 === 1;
          const a = accents[f.id];
          return (
            <div key={f.id} className="grid md:grid-cols-12 gap-8 md:gap-14 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`md:row-start-1 md:col-span-5 ${
                  flip ? "md:col-start-8" : "md:col-start-1"
                }`}
              >
                {/*
                  A plain framed plate. The accent survives as a hairline across
                  the top edge; the halo behind it did not earn its keep.
                */}
                <div className="relative border border-line bg-slate/70 backdrop-blur-sm p-8 sm:p-12">
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${a.css}, transparent)`,
                    }}
                  />
                  {f.id === "vision" ? (
                    <ConvolutionVisual accent={a.css} />
                  ) : f.id === "llms" ? (
                    <AttentionVisual accent={a.css} />
                  ) : (
                    <NetworkVisual accent={a.css} />
                  )}
                </div>
              </motion.div>

              <div
                className={`md:row-start-1 md:col-span-6 ${
                  flip ? "md:col-start-1" : "md:col-start-7"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-data text-xs ${a.text}`}>{f.label}</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-px w-10 origin-left"
                    style={{ background: a.css }}
                  />
                </div>

                <TextReveal as="h3" className="font-display display-md mt-4" delay={0.05}>
                  {f.title}
                </TextReveal>

                <TextReveal
                  as="p"
                  className="mt-5 text-lg md:text-xl text-parchment leading-relaxed measure"
                  delay={0.12}
                  stagger={0.02}
                >
                  {f.body}
                </TextReveal>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5 text-mist leading-relaxed measure"
                >
                  {f.detail}
                </motion.p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
