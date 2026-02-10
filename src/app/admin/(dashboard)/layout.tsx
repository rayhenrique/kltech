import { AdminSidebar } from "@/components/admin/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-muted/30">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
