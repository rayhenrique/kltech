"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createContract(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.from("contracts").insert({
        cliente: formData.get("cliente") as string,
        descricao: formData.get("descricao") as string,
        valor_mensal: parseFloat(formData.get("valor_mensal") as string) || 0,
        data_inicio: formData.get("data_inicio") as string,
        data_fim: (formData.get("data_fim") as string) || null,
        status: formData.get("status") as string,
        notas: (formData.get("notas") as string) || null,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/contratos");
}

export async function updateContract(id: string, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("contracts")
        .update({
            cliente: formData.get("cliente") as string,
            descricao: formData.get("descricao") as string,
            valor_mensal: parseFloat(formData.get("valor_mensal") as string) || 0,
            data_inicio: formData.get("data_inicio") as string,
            data_fim: (formData.get("data_fim") as string) || null,
            status: formData.get("status") as string,
            notas: (formData.get("notas") as string) || null,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/contratos");
}

export async function deleteContract(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/contratos");
}
