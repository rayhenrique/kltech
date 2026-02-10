"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase, FolderKanban, ShoppingBag, User, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navLinks: { label: string; href: string; icon: LucideIcon }[] = [
    { label: "Serviços", href: "#servicos", icon: Briefcase },
    { label: "Portfólio", href: "#portfolio", icon: FolderKanban },
    { label: "Vitrine", href: "#vitrine", icon: ShoppingBag },
    { label: "Sobre", href: "#sobre", icon: User },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">KL</span>
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-foreground">
                        KL Tecnologia
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* CTA */}
                <div className="hidden md:flex">
                    <Button
                        asChild
                        className="bg-blue-accent text-white hover:bg-blue-accent/90"
                    >
                        <a
                            href="https://wa.me/5582996304742?text=Olá! Gostaria de solicitar um orçamento."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Solicitar Orçamento
                        </a>
                    </Button>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-border/50 bg-white md:hidden">
                    <nav className="flex flex-col gap-1 px-4 py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </a>
                        ))}
                        <Button
                            asChild
                            className="mt-2 w-full bg-blue-accent text-white hover:bg-blue-accent/90"
                        >
                            <a
                                href="https://wa.me/5582996304742?text=Olá! Gostaria de solicitar um orçamento."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Solicitar Orçamento
                            </a>
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
