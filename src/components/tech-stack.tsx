import { Badge } from "@/components/ui/badge";

const categories = [
    {
        name: "Frontend",
        skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML/CSS", "Vue.js"],
    },
    {
        name: "Backend",
        skills: ["Node.js", "PHP", "Laravel", "Python", "REST API", "GraphQL"],
    },
    {
        name: "Database",
        skills: ["PostgreSQL", "Supabase", "MySQL", "MongoDB", "Redis", "Prisma"],
    },
    {
        name: "DevOps & Automação",
        skills: ["Docker", "Git", "CI/CD", "n8n", "Linux", "AWS"],
    },
];

export function TechStack() {
    return (
        <section id="sobre" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <Badge
                        variant="secondary"
                        className="mb-4 rounded-full border border-blue-accent/20 bg-blue-accent/5 text-blue-accent"
                    >
                        Tech Stack
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Tecnologias & Skills
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Stack moderna e consolidada para entregar software de alta qualidade
                        em qualquer vertical.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <div key={category.name} className="text-center">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {category.skills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        variant="outline"
                                        className="rounded-full border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-blue-accent/50 hover:bg-blue-accent/5"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
