"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createLead(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.from("leads").insert({
        nome: formData.get("nome") as string,
        email: (formData.get("email") as string) || null,
        telefone: (formData.get("telefone") as string) || null,
        origem: formData.get("origem") as string,
        status: formData.get("status") as string,
        notas: (formData.get("notas") as string) || null,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/leads");
}

export async function updateLead(id: string, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("leads")
        .update({
            nome: formData.get("nome") as string,
            email: (formData.get("email") as string) || null,
            telefone: (formData.get("telefone") as string) || null,
            origem: formData.get("origem") as string,
            status: formData.get("status") as string,
            notas: (formData.get("notas") as string) || null,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/leads");
}
