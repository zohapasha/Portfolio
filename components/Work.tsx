"use client";

import { motion } from "framer-motion";
import Section from "./Section";
import TextReveal from "./TextReveal";
import { projects } from "@/lib/data";

export default function Work() {
  return (
    <Section id="work" index="02" label="Selected work" accent="lamp">
      <div>
        {projects.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative grid md:grid-cols-12 gap-4 md:gap-12 py-10 md:py-14 ${
              i === 0 ? "" : "border-t border-line"
            }`}
          >
            {/* A light passes along the row's edge on hover. */}
            <span className="pointer-events-none absolute inset-x-0 -top-px h-px scale-x-0 origin-left bg-gradient-to-r from-lamp via-moon to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />

            <div className="md:col-span-3">
              {/*
                The section rail already carries a large numeral; a second one
                per project competed with it, so the item index sits inline with
                the year instead.
              */}
              <div className="md:sticky md:top-28">
                <p className="font-data text-xs uppercase tracking-[0.18em] flex items-baseline gap-2">
                  <span className="text-mist/50 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lamp/80">{p.year}</span>
                </p>
                <p className="font-data text-xs uppercase tracking-[0.18em] text-mist mt-1">
                  {p.kind}
                </p>
                <span className="mt-4 block h-px w-8 bg-line" />
              </div>
            </div>

            <div className="md:col-span-9">
              <TextReveal
                as="h3"
                className={`font-display transition-colors duration-500 group-hover:text-lamp ${
                  p.featured ? "display-md" : "text-2xl md:text-3xl font-medium tracking-tight"
                }`}
              >
                {p.name}
              </TextReveal>

              <p className="mt-4 text-lg text-parchment leading-relaxed measure">{p.summary}</p>

              <ul className="mt-5 flex flex-col gap-2 measure">
                {p.points.map((pt, j) => (
                  <motion.li
                    key={pt}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.6, delay: 0.1 + j * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-3 text-mist leading-relaxed"
                  >
                    <span className="shrink-0 mt-2.5 h-px w-3 bg-moon" />
                    <span>{pt}</span>
                  </motion.li>
                ))}
              </ul>

              {p.metrics ? (
                <dl className="mt-8 flex flex-wrap gap-x-14 gap-y-5">
                  {p.metrics.map((m, j) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.15 + j * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <dd
                        className={`font-display text-3xl md:text-4xl font-semibold tracking-tight ${
                          j === 0 ? "text-ink" : "text-moon"
                        }`}
                      >
                        {m.value}
                      </dd>
                      <dt className="font-data text-xs uppercase tracking-[0.18em] text-mist mt-1">
                        {m.label}
                      </dt>
                    </motion.div>
                  ))}
                </dl>
              ) : null}

              <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="font-data text-xs text-mist border border-line px-2.5 py-1 transition-colors duration-300 hover:border-moon hover:text-moon"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
