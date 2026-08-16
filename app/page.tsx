import IntroGate from "@/components/intro/IntroGate";
import Ambient from "@/components/Ambient";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FocusSection from "@/components/FocusSection";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <IntroGate />
      <Ambient />
      <div className="flex-1">
        <Nav />
        <main>
          <Hero />
          <FocusSection />
          <Work />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
