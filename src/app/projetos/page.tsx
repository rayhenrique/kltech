import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getProjects } from "@/lib/queries";

export const revalidate = 3600;

export const metadata = {
    title: "Projetos | KL Tecnologia",
    description:
        "Conheça os projetos desenvolvidos pela KL Tecnologia — soluções para governo, saúde pública, web e mobile.",
};

export default async function ProjetosPage() {
    const projects = await getProjects();

    return (
        <>
            <Navbar />
            <main className="pt-20">
                {/* Hero */}
                <section className="bg-gradient-to-b from-muted/50 to-background py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar ao Início
                                </Link>
                            </Button>
                            <Badge
                                variant="secondary"
                                className="mb-4 rounded-full border border-blue-accent/20 bg-blue-accent/5 text-blue-accent block w-fit mx-auto"
                            >
                                Portfólio
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Todos os Projetos
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Conheça os projetos que desenvolvemos para diferentes
                                verticais — governo, saúde, web e mobile.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {projects.length === 0 ? (
                            <p className="text-center text-muted-foreground animate-in fade-in duration-700">
                                Nenhum projeto disponível no momento.
                            </p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
            <WhatsAppFab />
        </>
    );
}
