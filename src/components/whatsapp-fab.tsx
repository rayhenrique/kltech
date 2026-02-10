import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
    return (
        <a
            href="https://wa.me/5582996304742?text=Olá! Vim pelo site da KL Tecnologia e gostaria de saber mais."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-emerald-600 hover:shadow-xl"
            aria-label="Contato via WhatsApp"
        >
            <MessageCircle className="h-6 w-6" />
        </a>
    );
}
