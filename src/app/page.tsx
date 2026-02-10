import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { TrustBar } from "@/components/trust-bar";
import { GovSection } from "@/components/gov-section";
import { ProductGrid } from "@/components/product-grid";
import { ProjectGrid } from "@/components/project-grid";
import { TechStack } from "@/components/tech-stack";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { getProducts, getProjects } from "@/lib/queries";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [products, projects] = await Promise.all([
    getProducts(),
    getProjects(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <GovSection />
        <ProductGrid products={products} />
        <ProjectGrid projects={projects} />
        <TechStack />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
