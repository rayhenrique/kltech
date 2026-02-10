import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/queries";

export function ProjectGrid({ projects }: { projects: Project[] }) {
    return (
        <section id="portfolio" className="bg-muted/30 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <Badge
                        variant="secondary"
                        className="mb-4 rounded-full border border-blue-accent/20 bg-blue-accent/5 text-blue-accent"
                    >
                        Portfólio
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Projetos em Destaque
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Uma seleção de projetos que demonstram competência técnica em
                        diferentes verticais — governo, web e mobile.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="gap-2 rounded-full border-blue-accent/30 text-blue-accent hover:bg-blue-accent/5 hover:text-blue-accent"
                    >
                        <Link href="/projetos">
                            Ver Todos os Projetos
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
