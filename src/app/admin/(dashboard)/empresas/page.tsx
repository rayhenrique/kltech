import { createClient } from "@/lib/supabase/server";
import { EmpresasClient } from "./empresas-client";

export default async function EmpresasPage() {
    const supabase = await createClient();
    const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .order("ordem", { ascending: true })
        .order("created_at", { ascending: true });

    return <EmpresasClient companies={companies ?? []} />;
}
