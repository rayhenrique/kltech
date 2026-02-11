import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProjectById, getProjects } from "@/lib/queries";

const categoriaLabels: Record<string, string> = {
    gov: "Governo & Saúde",
    web: "Web",
    mobile: "Mobile",
};

const categoriaColors: Record<string, string> = {
    gov: "bg-blue-50 text-blue-700 border-blue-200",
    web: "bg-violet-50 text-violet-700 border-violet-200",
    mobile: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const revalidate = 3600;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        return { title: "Projeto não encontrado | KL Tecnologia" };
    }

    return {
        title: `${project.titulo} | KL Tecnologia`,
        description: project.descricao,
    };
}

export default async function ProjetoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <main className="pt-20">
                {/* Back button */}
                <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/projetos">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar aos Projetos
                        </Link>
                    </Button>
                </div>

                {/* Content */}
                <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Image */}
                    {project.image_url ? (
                        <div className="overflow-hidden rounded-xl border border-border">
                            <img
                                src={project.image_url}
                                alt={project.titulo}
                                className="h-auto w-full object-cover sm:max-h-[480px]"
                            />
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border">
                            <span className="text-6xl font-bold text-muted-foreground/20">
                                {project.titulo.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium ${categoriaColors[project.categoria] || ""}`}
                                >
                                    {categoriaLabels[project.categoria] ||
                                        project.categoria}
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                {project.titulo}
                            </h1>
                        </div>

                        {project.link && project.link !== "#" && (
                            <Button
                                asChild
                                className="gap-2 bg-blue-accent text-white hover:bg-blue-accent/90"
                            >
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Visitar Projeto
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                            {project.descricao}
                        </p>
                    </div>

                    {/* Stack */}
                    {project.stack_tecnica.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                Tecnologias Utilizadas
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {project.stack_tecnica.map((tech) => (
                                    <Badge
                                        key={tech}
                                        variant="secondary"
                                        className="text-sm"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </main>
            <Footer />
            <WhatsAppFab />
        </>
    );
}
