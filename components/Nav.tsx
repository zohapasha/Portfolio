"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

const links = [
  { id: "focus", label: "Focus" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [lifted, setLifted] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
        lifted ? "bg-night/85 backdrop-blur-md border-b border-line" : "border-b border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-10 py-4">
        <a href="#top" className="font-display text-base font-semibold tracking-tight">
          Zoha Pasha
        </a>
        <ul className="flex items-center gap-5 md:gap-8">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="text-sm text-mist hover:text-parchment transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* How far through the night you are. */}
      <motion.span
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-moon via-dusk to-lamp"
      />
    </header>
  );
}
