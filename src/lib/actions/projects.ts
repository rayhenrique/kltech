"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.from("projects").insert({
        titulo: formData.get("titulo") as string,
        descricao: formData.get("descricao") as string,
        categoria: formData.get("categoria") as string,
        stack_tecnica: (formData.get("stack_tecnica") as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        image_url: (formData.get("image_url") as string) || null,
        link: (formData.get("link") as string) || null,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("projects")
        .update({
            titulo: formData.get("titulo") as string,
            descricao: formData.get("descricao") as string,
            categoria: formData.get("categoria") as string,
            stack_tecnica: (formData.get("stack_tecnica") as string)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            image_url: (formData.get("image_url") as string) || null,
            link: (formData.get("link") as string) || null,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
}

export async function deleteProject(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
}
