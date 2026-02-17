import { createClient } from "@/lib/supabase/server";
import type { Product, Project, Company } from "@/lib/types";

export type { Product, Project, Company };

export type Lead = {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    origem: "site" | "indicacao" | "whatsapp" | "outro";
    status: "novo" | "contactado" | "negociando" | "fechado" | "cancelado";
    notas: string | null;
    created_at: string;
    updated_at: string;
};

export type Contract = {
    id: string;
    cliente: string;
    descricao: string;
    valor_mensal: number;
    data_inicio: string;
    data_fim: string | null;
    status: "ativo" | "encerrado" | "pausado";
    notas: string | null;
    created_at: string;
};

export async function getProjects(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
    return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }
    return data;
}

export async function getProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }
    return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return null;
    }
    return data;
}

export async function getCompanies(): Promise<Company[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("ordem", { ascending: true });

    if (error) {
        console.error("Error fetching companies:", error);
        return [];
    }
    return data ?? [];
}

export async function getLeads(): Promise<Lead[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching leads:", error);
        return [];
    }
    return data ?? [];
}

export async function getContracts(): Promise<Contract[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching contracts:", error);
        return [];
    }
    return data ?? [];
}

export async function getDashboardStats() {
    const supabase = await createClient();

    const [projects, products, leads, contracts] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("contracts").select("valor_mensal, status"),
    ]);

    const activeContracts =
        contracts.data?.filter((c) => c.status === "ativo") ?? [];
    const receitaMensal = activeContracts.reduce(
        (sum, c) => sum + (Number(c.valor_mensal) || 0),
        0
    );

    return {
        totalProjects: projects.count ?? 0,
        totalProducts: products.count ?? 0,
        totalLeads: leads.count ?? 0,
        totalContracts: contracts.data?.length ?? 0,
        activeContracts: activeContracts.length,
        receitaMensal,
    };
}
