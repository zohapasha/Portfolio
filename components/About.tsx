"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { useRef } from "react";
import Section from "./Section";
import TextReveal from "./TextReveal";
import { profile, timeline, skills } from "@/lib/data";

const kindAccent: Record<string, string> = {
  Education: "text-moon",
  Experience: "text-lamp",
  Certification: "text-dusk",
};

const kindDot: Record<string, string> = {
  Education: "bg-moon",
  Experience: "bg-lamp",
  Certification: "bg-dusk",
};

export default function About() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 80%", "end 60%"],
  });
  // The spine fills as you read down it, so the record reads as a path rather
  // than a list — the same "moving through" idea as the intro.
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "100%" : "100%"]);

  return (
    <Section id="about" index="03" label="About" accent="dusk">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-9 md:col-start-1 flex flex-col gap-7">
          <TextReveal
            as="p"
            className="font-display display-md text-parchment leading-relaxed measure"
            stagger={0.03}
          >
            {profile.about[0]}
          </TextReveal>
          {profile.about.slice(1).map((para, i) => (
            <motion.p
              key={para}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-mist leading-relaxed measure"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="mt-20 md:mt-28 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <h3 className="font-data text-xs uppercase tracking-[0.22em] text-mist mb-10">
            Education and experience
          </h3>

          <ol ref={trackRef} className="relative flex flex-col pl-8">
            {/* The unlit spine, and the light travelling down it. */}
            <span className="absolute left-[3px] top-2 bottom-2 w-px bg-line" />
            <motion.span
              style={{ height: fill }}
              className="absolute left-[3px] top-2 w-px bg-gradient-to-b from-moon via-lamp to-dusk"
            />

            {timeline.map((t, i) => (
              <motion.li
                key={t.title + t.when}
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative py-7 ${i === 0 ? "" : "border-t border-line"}`}
              >
                <span
                  className={`absolute -left-8 top-9 h-[7px] w-[7px] rounded-full ${
                    kindDot[t.kind] ?? "bg-moon"
                  }`}
                />
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <span className="font-data text-xs text-mist">{t.when}</span>
                  <span
                    className={`font-data text-xs uppercase tracking-[0.18em] ${
                      kindAccent[t.kind] ?? "text-moon"
                    }`}
                  >
                    {t.kind}
                  </span>
                </div>
                <h4 className="text-lg font-medium mt-2">{t.title}</h4>
                <p className="text-mist">{t.org}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {t.detail.map((d) => (
                    <li key={d} className="text-sm text-mist">
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <h3 className="font-data text-xs uppercase tracking-[0.22em] text-mist mb-10">
            Tools
          </h3>
          <div className="flex flex-col gap-8">
            {skills.map((g, gi) => (
              <motion.div
                key={g.group}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, delay: gi * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  className={`font-data text-xs mb-3 ${
                    ["text-moon", "text-lamp", "text-dusk", "text-ink"][gi % 4]
                  }`}
                >
                  {g.group}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm text-mist border border-line px-2.5 py-1 transition-colors duration-300 hover:border-mist hover:text-parchment"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
