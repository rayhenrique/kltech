import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getProductById } from "@/lib/queries";

const tipoLabels: Record<string, string> = {
    script: "Script",
    automacao: "Automação",
    ebook: "E-book",
};

const tipoColors: Record<string, string> = {
    script: "bg-violet-50 text-violet-700 border-violet-200",
    automacao: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ebook: "bg-amber-50 text-amber-700 border-amber-200",
};

export const revalidate = 3600;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return { title: "Produto não encontrado | KL Tecnologia" };
    }

    return {
        title: `${product.titulo} | KL Tecnologia`,
        description: product.descricao,
    };
}

export default async function ProdutoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
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
                        <Link href="/produtos">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar à Vitrine
                        </Link>
                    </Button>
                </div>

                {/* Content */}
                <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Image */}
                    {product.image_url ? (
                        <div className="overflow-hidden rounded-xl border border-border">
                            <img
                                src={product.image_url}
                                alt={product.titulo}
                                className="h-auto w-full object-cover sm:max-h-[480px]"
                            />
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border">
                            <span className="text-6xl font-bold text-muted-foreground/20">
                                {product.titulo.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium ${tipoColors[product.tipo] || ""}`}
                                >
                                    {tipoLabels[product.tipo] || product.tipo}
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                {product.titulo}
                            </h1>
                            {product.preco && (
                                <p className="mt-2 text-2xl font-bold text-foreground">
                                    {product.preco}
                                </p>
                            )}
                        </div>

                        <Button
                            asChild
                            size="lg"
                            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <a
                                href={product.whatsapp_link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-5 w-5" />
                                Tenho Interesse
                            </a>
                        </Button>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                            {product.descricao}
                        </p>
                    </div>

                    {/* Technical Info */}
                    {product.info_tecnica && (
                        <div className="mt-8">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                Detalhes Técnicos
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {product.info_tecnica.split("·").map((tech, i) => (
                                    <Badge
                                        key={i}
                                        variant="secondary"
                                        className="text-sm"
                                    >
                                        {tech.trim()}
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
