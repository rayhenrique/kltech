import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/lib/queries";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Metadata } from "next";

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Projeto não encontrado | KL Tecnologia",
        };
    }

    return {
        title: `${project.titulo} | KL Tecnologia`,
        description: project.descricao,
        openGraph: {
            title: project.titulo,
            description: project.descricao,
            images: project.image_url ? [project.image_url] : [],
        },
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const categoriaLabels: Record<string, string> = {
        gov: "Governo & Saúde",
        web: "Web",
        mobile: "Mobile",
        saude: "Saúde",
        privado: "Privado",
    };

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />
            
            <article className="flex-1 pt-24 pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb / Back */}
                    <div className="mb-8">
                        <Link
                            href="/#portfolio"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para o portfólio
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <Badge variant="secondary" className="mb-4">
                            {categoriaLabels[project.categoria] || project.categoria}
                        </Badge>
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            {project.titulo}
                        </h1>
                        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {new Date(project.created_at).getFullYear()}
                            </span>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-lg">
                        {project.image_url ? (
                            <img
                                src={project.image_url}
                                alt={project.titulo}
                                className="w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center bg-muted">
                                <span className="text-6xl font-bold text-muted-foreground/20">
                                    {project.titulo.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate mx-auto max-w-none dark:prose-invert">
                        <div className="grid gap-12 md:grid-cols-[1fr_300px]">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Sobre o Projeto</h3>
                                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                                    {project.descricao}
                                </p>
                                {/* Note: In a real scenario, we might have a rich text 'content' field in DB */}
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                        Stack Tecnológica
                                    </h3>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {project.stack_tecnica && project.stack_tecnica.map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="outline"
                                                className="px-3 py-1 font-normal"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {project.link && project.link !== "#" && (
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                            Link do Projeto
                                        </h3>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="mt-3 w-full justify-between"
                                        >
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Acessar Projeto
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
            <WhatsAppFab />
        </main>
    );
}
