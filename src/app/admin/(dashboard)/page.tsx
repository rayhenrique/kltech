import { getDashboardStats } from "@/lib/queries";
import {
    FolderKanban,
    ShoppingBag,
    Users,
    FileText,
    TrendingUp,
    DollarSign,
} from "lucide-react";

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    const cards = [
        {
            label: "Projetos",
            value: stats.totalProjects,
            icon: FolderKanban,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            label: "Produtos",
            value: stats.totalProducts,
            icon: ShoppingBag,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            label: "Leads",
            value: stats.totalLeads,
            icon: Users,
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
        {
            label: "Contratos Ativos",
            value: stats.activeContracts,
            icon: FileText,
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            label: "Total Contratos",
            value: stats.totalContracts,
            icon: TrendingUp,
            color: "text-slate-500",
            bg: "bg-slate-50",
        },
        {
            label: "Receita Mensal",
            value: `R$ ${stats.receitaMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Visão geral do seu negócio
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-border bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}
                            >
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {card.label}
                                </p>
                                <p className="text-xl font-bold tracking-tight">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
