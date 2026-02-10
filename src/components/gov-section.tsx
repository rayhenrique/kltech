import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Building2, FileCheck } from "lucide-react";

const features = [
    {
        icon: Heart,
        title: "Sistemas de Saúde",
        description:
            "Plataformas integradas ao e-SUS APS para gestão de UBS, agendamentos e acompanhamento de indicadores de saúde.",
    },
    {
        icon: Building2,
        title: "Soluções para Governo",
        description:
            "Sistemas robustos e seguros para órgãos públicos municipais, com foco em conformidade e escalabilidade.",
    },
    {
        icon: Shield,
        title: "Segurança & Conformidade",
        description:
            "Desenvolvimento seguindo as melhores práticas de segurança, RLS, criptografia e LGPD.",
    },
    {
        icon: FileCheck,
        title: "Integração com e-SUS",
        description:
            "Experiência comprovada na integração com APIs do Ministério da Saúde e sistemas de registro eletrônico.",
    },
];

export function GovSection() {
    return (
        <section id="servicos" className="bg-muted/30 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <Badge
                        variant="secondary"
                        className="mb-4 rounded-full border border-blue-accent/20 bg-blue-accent/5 text-blue-accent"
                    >
                        Engenharia & Governo
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Expertise em Sistemas Críticos
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Anos de experiência construindo soluções para o setor público e área
                        da saúde com tecnologias modernas e confiáveis.
                    </p>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:border-blue-accent/30 hover:shadow-lg"
                        >
                            <div className="mb-4 inline-flex rounded-lg bg-blue-accent/10 p-2.5">
                                <feature.icon className="h-5 w-5 text-blue-accent" />
                            </div>
                            <h3 className="mb-2 text-base font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
