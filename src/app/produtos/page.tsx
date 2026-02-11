import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/queries";

export const revalidate = 3600;

export const metadata = {
    title: "Vitrine de Produtos | KL Tecnologia",
    description:
        "Scripts, sistemas de automação e e-books — soluções prontas para acelerar seu negócio.",
};

export default async function ProdutosPage() {
    const products = await getProducts();

    return (
        <>
            <Navbar />
            <main className="pt-20">
                {/* Hero */}
                <section className="bg-gradient-to-b from-muted/50 to-background py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
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
                                Vitrine
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Produtos Prontos
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Soluções desenvolvidas e testadas pela nossa equipe para
                                resolver problemas reais de forma rápida e eficiente.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {products.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                Nenhum produto disponível no momento.
                            </p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
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
