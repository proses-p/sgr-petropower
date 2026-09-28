import AboutPreview from "@/components/AboutPreview";
import CTA from "@/components/CTA";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import Navbar from "@/components/Navbar";
import ProjectsPreview from "@/components/ProjectsPreview";
import Services from "@/components/Services";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <Hero />
        <Services />
        <AboutPreview />
        {/* <ProjectsPreview /> */}
        <CTA />
      </main>
      <ClientLogoStrip />
      <Footer showClientLogos={false} />
    </>
  )
}