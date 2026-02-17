import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/queries";
import { ArrowLeft, Check, MessageCircle, ShieldCheck, Zap } from "lucide-react";
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
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Produto não encontrado | KL Tecnologia",
        };
    }

    return {
        title: `${product.titulo} | KL Tecnologia`,
        description: product.descricao,
        openGraph: {
            title: product.titulo,
            description: product.descricao,
            images: product.image_url ? [product.image_url] : [],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const tipoLabels: Record<string, string> = {
        script: "Script",
        automacao: "Automação",
        ebook: "E-book",
        digisat: "DigiSat",
        plw: "PLW",
    };

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />
            
            <article className="flex-1 pt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb / Back */}
                    <div className="mb-8">
                        <Link
                            href="/#vitrine"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para a vitrine
                        </Link>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Left: Image */}
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.titulo}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-square items-center justify-center bg-muted">
                                    <span className="text-6xl font-bold text-muted-foreground/20">
                                        {product.titulo.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            
                            {/* Floating Badge */}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-foreground backdrop-blur-sm hover:bg-white/100">
                                    {tipoLabels[product.tipo] || product.tipo}
                                </Badge>
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                                {product.titulo}
                            </h1>
                            
                            <div className="mt-6 space-y-6 text-lg text-muted-foreground">
                                <p>{product.descricao}</p>
                            </div>

                            {/* Tech Stack */}
                            {product.info_tecnica && (
                                <div className="mt-8">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                                        Tecnologias & Recursos
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.info_tecnica.split("·").map((tech, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="px-3 py-1 text-sm font-normal"
                                            >
                                                {tech.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trust Indicators */}
                            <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/20 p-4">
                                <div className="flex items-start gap-3">
                                    <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Entrega Imediata</p>
                                        <p className="text-xs text-muted-foreground">Após confirmação</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Código Verificado</p>
                                        <p className="text-xs text-muted-foreground">Livre de malware</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Area */}
                            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-blue-accent/20 bg-blue-accent/5 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Valor do Investimento</p>
                                    <p className="text-3xl font-bold text-foreground">
                                        {product.preco || "Sob Consulta"}
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    size="lg"
                                    className="gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                                >
                                    <a
                                        href={product.whatsapp_link || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Comprar Agora
                                    </a>
                                </Button>
                            </div>
                            
                            <p className="mt-4 text-center text-xs text-muted-foreground">
                                Transação segura realizada diretamente via WhatsApp com nosso time.
                            </p>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
            <WhatsAppFab />
        </main>
    );
}
