"use client";

import { useState, useTransition, useRef } from "react";
import { createCompany, updateCompany, deleteCompany } from "@/lib/actions/companies";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Loader2, Upload, X, Building2 } from "lucide-react";

type Company = {
    id: string;
    nome: string;
    logo_url: string | null;
    ordem: number;
    created_at: string;
};

function CompanyForm({
    company,
    onClose,
}: {
    company?: Company;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const [logoUrl, setLogoUrl] = useState(company?.logo_url ?? "");
    const [previewUrl, setPreviewUrl] = useState(company?.logo_url ?? "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);

        try {
            const supabase = createClient();
            const ext = file.name.split(".").pop();
            const fileName = `companies/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error } = await supabase.storage
                .from("images")
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from("images")
                .getPublicUrl(fileName);

            setLogoUrl(urlData.publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Erro ao fazer upload da imagem.");
            setPreviewUrl("");
            setLogoUrl("");
        } finally {
            setUploading(false);
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("logo_url", logoUrl);
        startTransition(async () => {
            if (company) {
                await updateCompany(company.id, formData);
            } else {
                await createCompany(formData);
            }
            onClose();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa / Órgão</Label>
                <Input id="nome" name="nome" defaultValue={company?.nome} placeholder="Ex: Prefeitura de Maceió" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="ordem">Ordem de exibição</Label>
                <Input id="ordem" name="ordem" type="number" min="0" defaultValue={company?.ordem ?? 0} />
                <p className="text-[11px] text-muted-foreground">Menor número aparece primeiro. Empresas com mesma ordem são exibidas pela data de criação.</p>
            </div>

            {/* Logo upload */}
            <div className="space-y-2">
                <Label>Logo (opcional)</Label>
                <div className="flex flex-col gap-3">
                    {previewUrl ? (
                        <div className="relative inline-block">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-20 w-auto rounded-lg border border-border object-contain bg-white p-2"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewUrl("");
                                    setLogoUrl("");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute -top-1.5 -right-1.5 rounded-full bg-white p-1 shadow-sm hover:bg-muted"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <label
                            htmlFor="company_logo_file"
                            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-blue-accent/50 hover:bg-muted/50"
                        >
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Fazer upload do logo</span>
                            <span className="text-[11px] text-muted-foreground">PNG, SVG ou WebP</span>
                        </label>
                    )}
                    <input
                        ref={fileInputRef}
                        id="company_logo_file"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                    />
                    <input type="hidden" name="logo_url" value={logoUrl} />
                    <p className="text-[11px] text-muted-foreground">
                        Se não enviar logo, será exibida a abreviação do nome.
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={isPending || uploading} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {company ? "Atualizar" : "Cadastrar"}
                </Button>
            </div>
        </form>
    );
}

export function EmpresasClient({ companies }: { companies: Company[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Company | undefined>();
    const [isPending, startTransition] = useTransition();

    function handleEdit(c: Company) {
        setEditing(c);
        setDialogOpen(true);
    }

    function handleNew() {
        setEditing(undefined);
        setDialogOpen(true);
    }

    function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir esta empresa?")) return;
        startTransition(() => deleteCompany(id));
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie as empresas e órgãos exibidos na seção de confiança
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleNew} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                            <Plus className="h-4 w-4" /> Nova Empresa
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
                        </DialogHeader>
                        <CompanyForm company={editing} onClose={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border border-border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Logo</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead className="w-20">Ordem</TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                    Nenhuma empresa cadastrada
                                </TableCell>
                            </TableRow>
                        )}
                        {companies.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>
                                    {c.logo_url ? (
                                        <img src={c.logo_url} alt={c.nome} className="h-8 w-auto max-w-[48px] object-contain" />
                                    ) : (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                                            <span className="text-[10px] font-bold text-muted-foreground">
                                                {c.nome.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{c.nome}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{c.ordem}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} disabled={isPending} className="text-red-500 hover:text-red-600">
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
