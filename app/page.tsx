import { EditorCanvas } from "@/components/canvas/editor-canvas";
import { Header } from "@/components/ui/header";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Writing } from "@/components/sections/writing";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Container>
          <div id="top" className="scroll-mt-24 pt-6 sm:pt-10">
            <EditorCanvas />
          </div>
          <Work />
          <Experience />
          <Stack />
          <Writing />
          <Contact />
          <Footer />
        </Container>
      </main>
    </>
  );
}
