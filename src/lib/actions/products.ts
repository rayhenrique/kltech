"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.from("products").insert({
        titulo: formData.get("titulo") as string,
        descricao: formData.get("descricao") as string,
        tipo: formData.get("tipo") as string,
        preco: (formData.get("preco") as string) || null,
        info_tecnica: (formData.get("info_tecnica") as string) || null,
        whatsapp_link: (formData.get("whatsapp_link") as string) || null,
        image_url: (formData.get("image_url") as string) || null,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/vitrine");
    revalidatePath("/");
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({
            titulo: formData.get("titulo") as string,
            descricao: formData.get("descricao") as string,
            tipo: formData.get("tipo") as string,
            preco: (formData.get("preco") as string) || null,
            info_tecnica: (formData.get("info_tecnica") as string) || null,
            whatsapp_link: (formData.get("whatsapp_link") as string) || null,
            image_url: (formData.get("image_url") as string) || null,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/vitrine");
    revalidatePath("/");
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/vitrine");
    revalidatePath("/");
}
