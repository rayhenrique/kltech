"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    FolderKanban,
    ShoppingBag,
    Building2,
    Users,
    FileText,
    LogOut,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Portfólio", href: "/admin/portfolio", icon: FolderKanban },
    { label: "Vitrine", href: "/admin/vitrine", icon: ShoppingBag },
    { label: "Empresas", href: "/admin/empresas", icon: Building2 },
    { label: "Leads", href: "/admin/leads", icon: Users },
    { label: "Contratos", href: "/admin/contratos", icon: FileText },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [collapsed, setCollapsed] = useState(false);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    }

    return (
        <aside
            className={cn(
                "flex h-screen flex-col border-r border-border bg-white transition-all duration-300",
                collapsed ? "w-16" : "w-60"
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-3">
                {!collapsed && (
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                            <span className="text-xs font-bold text-primary-foreground">KL</span>
                        </div>
                        <span className="text-sm font-semibold tracking-tight">Admin</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                >
                    {collapsed ? (
                        <PanelLeft className="h-4 w-4" />
                    ) : (
                        <PanelLeftClose className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-2 py-3">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-accent/10 text-blue-accent"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <Separator />

            {/* Logout */}
            <div className="p-2">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:text-red-500",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Sair</span>}
                </Button>
            </div>
        </aside>
    );
}
