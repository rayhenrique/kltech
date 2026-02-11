"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/queries";

const filters = [
    { value: "all", label: "Todos" },
    { value: "script", label: "Scripts" },
    { value: "automacao", label: "Automação" },
    { value: "ebook", label: "E-books" },
];

export function ProductGrid({ products }: { products: Product[] }) {
    const [activeFilter, setActiveFilter] = useState("all");

    const filtered =
        activeFilter === "all"
            ? products
            : products.filter((p) => p.tipo === activeFilter);

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

                {/* Tabs filter */}
                <div className="mt-10 flex justify-center">
                    <Tabs
                        value={activeFilter}
                        onValueChange={setActiveFilter}
                        className="w-auto"
                    >
                        <TabsList className="bg-muted">
                            {filters.map((f) => (
                                <TabsTrigger key={f.value} value={f.value} className="text-sm">
                                    {f.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Grid */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((product) => (
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

                {filtered.length === 0 && (
                    <p className="mt-12 text-center text-muted-foreground">
                        Nenhum produto encontrado nesta categoria.
                    </p>
                )}
            </div>
        </section>
    );
}
