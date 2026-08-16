"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import Section from "./Section";
import TextReveal from "./TextReveal";
import { profile } from "@/lib/data";
import { ArrowRight, ArrowUpRight } from "./icons";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-b border-line bg-transparent py-3 text-lg outline-none focus:border-moon transition-colors";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Network error — the message didn't go through.");
    }
  };

  return (
    <Section id="contact" index="04" label="Contact" accent="ink">

      <Reveal>
        <TextReveal as="h2" className="font-display display-lg max-w-5xl" stagger={0.035}>
          Working on something in AI, machine learning, or computer vision? I&rsquo;d like to hear about it.
        </TextReveal>
      </Reveal>

      <div className="mt-16 grid md:grid-cols-12 gap-12">
        <Reveal className="md:col-span-6" delay={0.05}>
          {status === "sent" ? (
            <div className="border border-line p-8">
              <p className="font-data text-xs uppercase tracking-[0.18em] text-moon mb-3">
                Message sent
              </p>
              <p className="text-xl">Thanks — that reached my inbox. I&rsquo;ll reply soon.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 font-data text-xs uppercase tracking-[0.14em] border border-line px-5 py-3 hover:border-parchment transition-colors cursor-pointer"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-col gap-8">
              <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-data text-xs uppercase tracking-[0.14em] text-mist">
                  Name
                </span>
                <input name="name" required maxLength={200} className={field} placeholder="Your name" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-data text-xs uppercase tracking-[0.14em] text-mist">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  className={field}
                  placeholder="you@example.com"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-data text-xs uppercase tracking-[0.14em] text-mist">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  maxLength={4000}
                  rows={4}
                  className={`${field} resize-none`}
                  placeholder="What are you working on?"
                />
              </label>

              {status === "error" ? (
                <p role="alert" className="font-data text-xs text-ink">
                  {errorMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "sending"}
                className="self-start flex items-center gap-3 font-data text-xs uppercase tracking-[0.14em] border border-parchment px-6 py-3.5 hover:bg-lamp hover:border-lamp hover:text-night-deep transition-colors disabled:opacity-50 cursor-pointer"
              >
                {status === "sending" ? "Sending…" : "Send message"}
                {status !== "sending" ? <ArrowRight /> : null}
              </button>
            </form>
          )}
        </Reveal>

        <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
          <p className="font-data text-xs uppercase tracking-[0.14em] text-mist mb-6">
            Elsewhere
          </p>
          <div className="flex flex-col">
            {[
              { label: "LinkedIn", href: profile.linkedin },
              { label: "GitHub", href: profile.github },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-line py-4 hover:border-parchment transition-colors"
              >
                <span className="text-lg">{l.label}</span>
                <ArrowUpRight className="text-mist group-hover:text-moon transition-colors" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-mist">{profile.location}</p>
        </Reveal>
      </div>
    </Section>
  );
}
