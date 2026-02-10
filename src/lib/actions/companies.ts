"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCompany(formData: FormData) {
    const supabase = await createClient();
    await supabase.from("companies").insert({
        nome: formData.get("nome") as string,
        logo_url: (formData.get("logo_url") as string) || null,
        ordem: Number(formData.get("ordem")) || 0,
    });
    revalidatePath("/admin/empresas");
    revalidatePath("/");
}

export async function updateCompany(id: string, formData: FormData) {
    const supabase = await createClient();
    await supabase
        .from("companies")
        .update({
            nome: formData.get("nome") as string,
            logo_url: (formData.get("logo_url") as string) || null,
            ordem: Number(formData.get("ordem")) || 0,
        })
        .eq("id", id);
    revalidatePath("/admin/empresas");
    revalidatePath("/");
}

export async function deleteCompany(id: string) {
    const supabase = await createClient();
    await supabase.from("companies").delete().eq("id", id);
    revalidatePath("/admin/empresas");
    revalidatePath("/");
}
