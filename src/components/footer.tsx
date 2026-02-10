import Link from "next/link";
import { Github, Linkedin, Mail, Instagram, Facebook, Youtube, Twitter, Briefcase, FolderKanban, ShoppingBag, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const quickLinks: { label: string; href: string; icon: LucideIcon }[] = [
    { label: "Serviços", href: "#servicos", icon: Briefcase },
    { label: "Portfólio", href: "#portfolio", icon: FolderKanban },
    { label: "Vitrine", href: "#vitrine", icon: ShoppingBag },
    { label: "Tech Stack", href: "#sobre", icon: Cpu },
];

const socialLinks = [
    { icon: Github, href: "https://github.com/rayhenrique", label: "GitHub" },
    { icon: Linkedin, href: "https://br.linkedin.com/in/ray-henrique-38389b53", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/rayhenrique", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/rayhenrique", label: "Facebook" },
    { icon: Youtube, href: "https://www.youtube.com/rayhenrique", label: "YouTube" },
    { icon: Twitter, href: "https://x.com/rayhenrique", label: "X (Twitter)" },
    { icon: Mail, href: "mailto:rayhenrique@gmail.com", label: "Email" },
];

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <span className="text-sm font-bold text-primary-foreground">KL</span>
                            </div>
                            <span className="text-lg font-semibold tracking-tight">
                                KL Tecnologia
                            </span>
                        </Link>
                        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                            Engenharia de software full stack, sistemas para saúde e governo, e
                            vitrine de soluções digitais.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Teotônio Vilela, Alagoas — Brasil
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Links Rápidos
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <link.icon className="h-3.5 w-3.5" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Redes Sociais
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-blue-accent/50 hover:text-blue-accent"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            <a
                                href="mailto:rayhenrique@gmail.com"
                                className="transition-colors hover:text-foreground"
                            >
                                rayhenrique@gmail.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 border-t border-border pt-6">
                    <p className="text-center text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} KL Tecnologia. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
