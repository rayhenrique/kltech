import { createClient } from "@/lib/supabase/server";

type Company = {
    id: string;
    nome: string;
    logo_url: string | null;
    ordem: number;
};

export async function TrustBar() {
    const supabase = await createClient();
    const { data: companies } = await supabase
        .from("companies")
        .select("id, nome, logo_url, ordem")
        .order("ordem", { ascending: true })
        .order("created_at", { ascending: true });

    const items: Company[] = companies ?? [];

    if (items.length === 0) return null;

    // Duplicate for infinite scroll effect
    const doubled = [...items, ...items];

    return (
        <section className="border-y border-border/50 bg-secondary/50 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Empresas, órgãos, parceiros e clientes que confiam em nosso trabalho
                </p>
                <div className="relative overflow-hidden">
                    <div className="flex animate-scroll-left gap-12 whitespace-nowrap">
                        {doubled.map((company, i) => (
                            <div
                                key={`${company.id}-${i}`}
                                className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground/60"
                            >
                                {company.logo_url ? (
                                    <img
                                        src={company.logo_url}
                                        alt={company.nome}
                                        className="h-8 w-8 rounded-md object-contain"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                                        <span className="text-[10px] font-bold text-muted-foreground">
                                            {company.nome.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                {company.nome}
                            </div>
                        ))}
                    </div>

                    {/* Fade edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary/50" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary/50" />
                </div>
            </div>
        </section>
    );
}
