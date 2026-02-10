import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/queries";

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

export function ProjectCard({ project }: { project: Project }) {
    return (
        <Card className="group flex flex-col overflow-hidden border border-border transition-all duration-300 hover:border-blue-accent/30 hover:shadow-lg">
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {project.image_url ? (
                    <img
                        src={project.image_url}
                        alt={project.titulo}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold text-muted-foreground/20">
                            {project.titulo.slice(0, 2).toUpperCase()}
                        </div>
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <Badge
                        variant="outline"
                        className={`text-[10px] font-medium ${categoriaColors[project.categoria] || ""}`}
                    >
                        {categoriaLabels[project.categoria] || project.categoria}
                    </Badge>
                </div>
                {project.link && project.link !== "#" && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        <ExternalLink className="h-3.5 w-3.5 text-foreground" />
                    </a>
                )}
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold leading-snug text-foreground">
                    {project.titulo}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                    {project.descricao}
                </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto">
                <div className="flex flex-wrap gap-1.5">
                    {project.stack_tecnica.map((tech) => (
                        <Badge
                            key={tech}
                            variant="secondary"
                            className="text-[10px] font-normal text-muted-foreground"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
