"use client";

import { useState, useTransition, useRef } from "react";
import type { Product } from "@/lib/queries";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

const WHATSAPP_NUMBER = "5582996304742";

/** Extract the message text from a full wa.me link, or return as-is */
function extractWhatsAppMessage(link: string | null): string {
    if (!link) return "";
    try {
        const url = new URL(link);
        return url.searchParams.get("text") ?? "";
    } catch {
        return link;
    }
}

function ProductForm({
    product,
    onClose,
}: {
    product?: Product;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
    const [previewUrl, setPreviewUrl] = useState(product?.image_url ?? "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);

        try {
            const supabase = createClient();
            const ext = file.name.split(".").pop();
            const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error } = await supabase.storage
                .from("images")
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from("images")
                .getPublicUrl(fileName);

            setImageUrl(urlData.publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Erro ao fazer upload da imagem.");
            setPreviewUrl("");
            setImageUrl("");
        } finally {
            setUploading(false);
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Build WhatsApp link from message text
        const msgText = (formData.get("whatsapp_msg") as string) || "";
        const whatsappLink = msgText
            ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msgText)}`
            : `https://wa.me/${WHATSAPP_NUMBER}`;
        formData.set("whatsapp_link", whatsappLink);
        formData.delete("whatsapp_msg");

        // Set uploaded image URL
        formData.set("image_url", imageUrl);

        startTransition(async () => {
            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await createProduct(formData);
            }
            onClose();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" defaultValue={product?.titulo} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" defaultValue={product?.descricao} required rows={3} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Input
                    id="tipo"
                    name="tipo"
                    defaultValue={product?.tipo ?? ""}
                    placeholder="Ex: Script, Automação, E-book, Template, Curso..."
                    required
                />
                <p className="text-[11px] text-muted-foreground">Digite o tipo desejado. Pode ser qualquer valor.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="preco">Preço</Label>
                    <Input id="preco" name="preco" placeholder="R$ 297" defaultValue={product?.preco ?? ""} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="info_tecnica">Info Técnica</Label>
                    <Input id="info_tecnica" name="info_tecnica" placeholder="PHP 8.2 · MySQL · API REST" defaultValue={product?.info_tecnica ?? ""} />
                </div>
            </div>

            {/* WhatsApp message */}
            <div className="space-y-2">
                <Label htmlFor="whatsapp_msg">Mensagem do WhatsApp</Label>
                <Textarea
                    id="whatsapp_msg"
                    name="whatsapp_msg"
                    defaultValue={extractWhatsAppMessage(product?.whatsapp_link ?? null)}
                    placeholder="Olá! Tenho interesse no produto X."
                    rows={2}
                />
                <p className="text-[11px] text-muted-foreground">
                    Mensagem pré-preenchida ao clicar em WhatsApp. O número (+55 82 99630-4742) é fixo.
                </p>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
                <Label>Imagem do Produto</Label>
                <div className="flex flex-col gap-3">
                    {previewUrl ? (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-32 w-full rounded-lg border border-border object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewUrl("");
                                    setImageUrl("");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-1 right-1 rounded-full bg-white/90 p-1 shadow-sm hover:bg-white"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <label
                            htmlFor="product_image_file"
                            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-blue-accent/50 hover:bg-muted/50"
                        >
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                                Clique para fazer upload
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                                PNG, JPG ou WebP
                            </span>
                        </label>
                    )}
                    <input
                        ref={fileInputRef}
                        id="product_image_file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <input type="hidden" name="image_url" value={imageUrl} />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={isPending || uploading} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {product ? "Atualizar" : "Criar"}
                </Button>
            </div>
        </form>
    );
}

export function VitrineClient({ products }: { products: Product[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Product | undefined>();
    const [isPending, startTransition] = useTransition();

    function handleEdit(p: Product) {
        setEditing(p);
        setDialogOpen(true);
    }

    function handleNew() {
        setEditing(undefined);
        setDialogOpen(true);
    }

    function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;
        startTransition(() => deleteProduct(id));
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Vitrine</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Gerencie seus produtos digitais</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleNew} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                            <Plus className="h-4 w-4" /> Novo Produto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                        </DialogHeader>
                        <ProductForm product={editing} onClose={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border border-border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Imagem</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    Nenhum produto encontrado
                                </TableCell>
                            </TableRow>
                        )}
                        {products.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.titulo} className="h-10 w-14 rounded border border-border object-cover" />
                                    ) : (
                                        <div className="flex h-10 w-14 items-center justify-center rounded border border-border bg-muted">
                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{p.titulo}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{p.tipo}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{p.preco || "—"}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} disabled={isPending} className="text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
