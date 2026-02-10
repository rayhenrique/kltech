"use client";

import { useState, useTransition, useRef } from "react";
import type { Project } from "@/lib/queries";
import { createProject, updateProject, deleteProject } from "@/lib/actions/projects";
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

function ProjectForm({
    project,
    onClose,
}: {
    project?: Project;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(project?.image_url ?? "");
    const [previewUrl, setPreviewUrl] = useState(project?.image_url ?? "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);

        try {
            const supabase = createClient();
            const ext = file.name.split(".").pop();
            const fileName = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

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
        // Override image_url with the uploaded URL
        formData.set("image_url", imageUrl);
        startTransition(async () => {
            if (project) {
                await updateProject(project.id, formData);
            } else {
                await createProject(formData);
            }
            onClose();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" defaultValue={project?.titulo} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" defaultValue={project?.descricao} required rows={3} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                    id="categoria"
                    name="categoria"
                    defaultValue={project?.categoria ?? ""}
                    placeholder="Ex: Web, Mobile, Governo, Saúde, Automação..."
                    required
                />
                <p className="text-[11px] text-muted-foreground">Digite a categoria desejada. Pode ser qualquer valor.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="stack_tecnica">Stack Técnica (separado por vírgula)</Label>
                <Input id="stack_tecnica" name="stack_tecnica" defaultValue={project?.stack_tecnica?.join(", ")} required />
            </div>

            {/* Image upload */}
            <div className="space-y-2">
                <Label>Imagem do Projeto</Label>
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
                            htmlFor="image_file"
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
                        id="image_file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <input type="hidden" name="image_url" value={imageUrl} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input id="link" name="link" defaultValue={project?.link ?? ""} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={isPending || uploading} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {project ? "Atualizar" : "Criar"}
                </Button>
            </div>
        </form>
    );
}

export function PortfolioClient({ projects }: { projects: Project[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Project | undefined>();
    const [isPending, startTransition] = useTransition();

    function handleEdit(p: Project) {
        setEditing(p);
        setDialogOpen(true);
    }

    function handleNew() {
        setEditing(undefined);
        setDialogOpen(true);
    }

    function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
        startTransition(() => deleteProject(id));
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Portfólio</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Gerencie seus projetos</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleNew} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                            <Plus className="h-4 w-4" /> Novo Projeto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
                        </DialogHeader>
                        <ProjectForm project={editing} onClose={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border border-border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Imagem</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Stack</TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    Nenhum projeto encontrado
                                </TableCell>
                            </TableRow>
                        )}
                        {projects.map((p) => (
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
                                    <Badge variant="secondary">{p.categoria}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {p.stack_tecnica.slice(0, 3).map((t) => (
                                            <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                                        ))}
                                        {p.stack_tecnica.length > 3 && (
                                            <Badge variant="outline" className="text-[10px]">+{p.stack_tecnica.length - 3}</Badge>
                                        )}
                                    </div>
                                </TableCell>
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
