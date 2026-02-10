import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/queries";

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

export function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="group flex flex-col overflow-hidden border border-border transition-all duration-300 hover:border-blue-accent/30 hover:shadow-lg">
            {/* Image placeholder */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold text-muted-foreground/20">
                        {product.titulo.slice(0, 2).toUpperCase()}
                    </div>
                </div>
                <div className="absolute top-3 left-3">
                    <Badge
                        variant="outline"
                        className={`text-[10px] font-medium ${tipoColors[product.tipo] || ""}`}
                    >
                        {tipoLabels[product.tipo] || product.tipo}
                    </Badge>
                </div>
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold leading-snug text-foreground">
                    {product.titulo}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                    {product.descricao}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-2">
                {product.info_tecnica && (
                    <div className="flex flex-wrap gap-1.5">
                        {product.info_tecnica.split("·").map((tech, i) => (
                            <Badge
                                key={i}
                                variant="secondary"
                                className="text-[10px] font-normal text-muted-foreground"
                            >
                                {tech.trim()}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
                {product.preco && (
                    <span className="text-lg font-bold text-foreground">{product.preco}</span>
                )}
                <Button
                    asChild
                    size="sm"
                    className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    <a
                        href={product.whatsapp_link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
