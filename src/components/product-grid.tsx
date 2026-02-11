"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/queries";

export function ProductGrid({ products }: { products: Product[] }) {
    return (
        <section id="vitrine" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <Badge
                        variant="secondary"
                        className="mb-4 rounded-full border border-blue-accent/20 bg-blue-accent/5 text-blue-accent"
                    >
                        Vitrine de Soluções
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Produtos Prontos para Uso
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Scripts, sistemas de automação e e-books — soluções testadas e
                        documentadas prontas para acelerar seu negócio.
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="gap-2 rounded-full border-blue-accent/30 text-blue-accent hover:bg-blue-accent/5 hover:text-blue-accent"
                    >
                        <Link href="/produtos">
                            Ver Todos os Produtos
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {products.length === 0 && (
                    <p className="mt-12 text-center text-muted-foreground">
                        Nenhum produto encontrado nesta categoria.
                    </p>
                )}
            </div>
        </section>
    );
}
