import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, Server, Database, MessageCircle, FolderKanban } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
            {/* Subtle grid background */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left — Content */}
                    <div className="max-w-xl">
                        <Badge
                            variant="secondary"
                            className="mb-6 gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Disponível para novos projetos
                        </Badge>

                        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Engenharia{" "}
                            <span className="text-blue-accent">Full Stack</span>
                            <br />
                            & Soluções Digitais
                        </h1>

                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            Desenvolvimento de software sob medida para empresas, governo e
                            saúde. Sistemas robustos, automação inteligente e produtos digitais
                            prontos para uso.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="bg-blue-accent text-white hover:bg-blue-accent/90"
                            >
                                <a
                                    href="https://wa.me/5582996304742?text=Olá! Gostaria de solicitar um orçamento."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Solicitar Orçamento
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a href="#portfolio">
                                    <FolderKanban className="h-4 w-4" />
                                    Ver Portfólio
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Right — Tech illustration */}
                    <div className="hidden lg:block">
                        <div className="relative mx-auto w-full max-w-md">
                            {/* Floating cards */}
                            <div className="absolute -top-4 -left-4 z-10 animate-pulse rounded-xl border border-border bg-white p-4 shadow-lg">
                                <Code2 className="h-6 w-6 text-blue-accent" />
                                <p className="mt-1 text-xs font-medium text-foreground">Frontend</p>
                                <p className="text-[10px] text-muted-foreground">Next.js · React · TypeScript</p>
                            </div>

                            <div className="absolute -right-4 top-12 z-10 animate-pulse rounded-xl border border-border bg-white p-4 shadow-lg" style={{ animationDelay: "1s" }}>
                                <Server className="h-6 w-6 text-emerald-500" />
                                <p className="mt-1 text-xs font-medium text-foreground">Backend</p>
                                <p className="text-[10px] text-muted-foreground">Node.js · PHP · Python</p>
                            </div>

                            <div className="absolute -bottom-4 left-8 z-10 animate-pulse rounded-xl border border-border bg-white p-4 shadow-lg" style={{ animationDelay: "2s" }}>
                                <Database className="h-6 w-6 text-amber-500" />
                                <p className="mt-1 text-xs font-medium text-foreground">Database</p>
                                <p className="text-[10px] text-muted-foreground">PostgreSQL · Supabase · MySQL</p>
                            </div>

                            {/* Main code block */}
                            <div className="rounded-2xl border border-border bg-[#0F172A] p-6 shadow-2xl">
                                <div className="mb-4 flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                <pre className="font-mono text-xs leading-6 text-slate-300">
                                    <code>{`const app = createApp({
  framework: "Next.js",
  database: "Supabase",
  deploy: "Production",
  status: "✅ Online"
});

await app.launch();
// → KL Tecnologia`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
