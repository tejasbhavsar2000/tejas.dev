import { Header } from "@/components/ui/header";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { Writing } from "@/components/sections/writing";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="relative z-10">
        <Container>
          <div id="top" className="scroll-mt-24">
            <Hero />
          </div>
        </Container>

        {/* Band sections bleed past the container, so they manage their own. */}
        <Experience />
        <Work />
        <Writing />
        <Contact />

        <Container>
          <Footer />
        </Container>
      </main>
    </>
  );
}
