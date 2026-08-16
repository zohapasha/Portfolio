import type { Metadata } from "next";
import { Bricolage_Grotesque, Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Zoha Pasha",
  description:
    "Computer science student working across computer vision, language models, and deep learning. Open to AI and machine learning roles, and considering graduate study.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          THESIS: The portfolio opens as a film, not a page — a derelict academic
          hall at night with one lit window, entered until the camera is inside
          her laptop. It refuses both the gradient-hero developer template and the
          resume-as-webpage, and it refuses decorating the site itself: once the
          journey ends, the interface gets out of the work's way.
          OWN-WORLD: Near-black ground, warm cream type, one ember-orange accent
          carried out of the window light in the intro. Bricolage Grotesque set
          tight and large, generous vertical air, hairline rules, no cards.
          STORY: A visitor understands within one sequence that she works on
          seeing inside systems, then reads honest, specific evidence of it and
          leaves able to contact her.
          FIRST VIEWPORT: Full-bleed WebGL night exterior — house silhouette
          slightly right of center, one ember window, stars above, fog at the
          base; skip control bottom-right, no chrome otherwise.
          FORM: Cinematic architectural entry, candidate 4, seed key a087e449,
          raised by Bloom's exterior-to-interior discipline and khasiyev.com's
          restraint in the resting interface.
          FINISH: unreviewed and undocumented is unfinished; this build ends with
          the finish review, the verdict, and DESIGN.md.
        */}
        {children}
      </body>
    </html>
  );
}
