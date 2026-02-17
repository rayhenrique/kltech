import { Footer } from "@/components/footer";
import { GovSection } from "@/components/gov-section";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { ProductGrid } from "@/components/product-grid";
import { ProjectGrid } from "@/components/project-grid";
import { TechStack } from "@/components/tech-stack";
import { TrustBar } from "@/components/trust-bar";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { getProducts, getProjects } from "@/lib/queries";

// Revalidate data every hour
export const revalidate = 3600;

export default async function Home() {
    // Fetch data in parallel
    const [products, projects] = await Promise.all([
        getProducts(),
        getProjects(),
    ]);

    // Limit items for homepage (e.g. 3 of each)
    const featuredProducts = products.slice(0, 3);
    const featuredProjects = projects.slice(0, 3);

    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            
            {/* 1. Hero */}
            <HeroSection />
            
            {/* 2. Trust Bar (Client Logos) */}
            <TrustBar />
            
            {/* 3. Gov & Health Expertise */}
            <GovSection />
            
            {/* 4. Products Showcase */}
            <ProductGrid products={featuredProducts} />
            
            {/* 5. Portfolio Highlights */}
            <ProjectGrid projects={featuredProjects} />
            
            {/* 6. Tech Stack */}
            <TechStack />
            
            <Footer />
            <WhatsAppFab />
        </main>
    );
}
