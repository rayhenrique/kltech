"use client";

import { useState, useTransition } from "react";
import type { Lead } from "@/lib/queries";
import { createLead, updateLead, deleteLead } from "@/lib/actions/leads";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Loader2, Phone, Mail } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
    novo: { label: "Novo", color: "bg-blue-100 text-blue-700" },
    contactado: { label: "Contactado", color: "bg-cyan-100 text-cyan-700" },
    negociando: { label: "Negociando", color: "bg-amber-100 text-amber-700" },
    fechado: { label: "Fechado", color: "bg-emerald-100 text-emerald-700" },
    cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const origemLabels: Record<string, string> = {
    site: "Site",
    indicacao: "Indicação",
    whatsapp: "WhatsApp",
    outro: "Outro",
};

function LeadForm({
    lead,
    onClose,
}: {
    lead?: Lead;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            if (lead) {
                await updateLead(lead.id, formData);
            } else {
                await createLead(formData);
            }
            onClose();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" defaultValue={lead?.nome} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={lead?.email ?? ""} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" name="telefone" defaultValue={lead?.telefone ?? ""} />
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="origem">Origem</Label>
                    <Select name="origem" defaultValue={lead?.origem ?? "site"}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="site">Site</SelectItem>
                            <SelectItem value="indicacao">Indicação</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={lead?.status ?? "novo"}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="novo">Novo</SelectItem>
                            <SelectItem value="contactado">Contactado</SelectItem>
                            <SelectItem value="negociando">Negociando</SelectItem>
                            <SelectItem value="fechado">Fechado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea id="notas" name="notas" defaultValue={lead?.notas ?? ""} rows={3} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={isPending} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {lead ? "Atualizar" : "Criar"}
                </Button>
            </div>
        </form>
    );
}

export function LeadsClient({ leads }: { leads: Lead[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Lead | undefined>();
    const [isPending, startTransition] = useTransition();
    const [filter, setFilter] = useState("all");

    const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

    function handleEdit(l: Lead) {
        setEditing(l);
        setDialogOpen(true);
    }

    function handleNew() {
        setEditing(undefined);
        setDialogOpen(true);
    }

    function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este lead?")) return;
        startTransition(() => deleteLead(id));
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Mini CRM — {leads.length} leads no total
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleNew} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                            <Plus className="h-4 w-4" /> Novo Lead
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Editar Lead" : "Novo Lead"}</DialogTitle>
                        </DialogHeader>
                        <LeadForm lead={editing} onClose={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Status filter */}
            <div className="mb-4">
                <Tabs value={filter} onValueChange={setFilter}>
                    <TabsList className="bg-muted">
                        <TabsTrigger value="all">Todos ({leads.length})</TabsTrigger>
                        <TabsTrigger value="novo">
                            Novos ({leads.filter((l) => l.status === "novo").length})
                        </TabsTrigger>
                        <TabsTrigger value="contactado">
                            Contactados ({leads.filter((l) => l.status === "contactado").length})
                        </TabsTrigger>
                        <TabsTrigger value="negociando">
                            Negociando ({leads.filter((l) => l.status === "negociando").length})
                        </TabsTrigger>
                        <TabsTrigger value="fechado">
                            Fechados ({leads.filter((l) => l.status === "fechado").length})
                        </TabsTrigger>
                        <TabsTrigger value="cancelado">
                            Cancelados ({leads.filter((l) => l.status === "cancelado").length})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="rounded-xl border border-border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Origem</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    Nenhum lead encontrado
                                </TableCell>
                            </TableRow>
                        )}
                        {filtered.map((l) => (
                            <TableRow key={l.id}>
                                <TableCell className="font-medium">{l.nome}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                        {l.email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {l.email}
                                            </span>
                                        )}
                                        {l.telefone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {l.telefone}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[10px]">
                                        {origemLabels[l.origem]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusConfig[l.status]?.color}`}
                                    >
                                        {statusConfig[l.status]?.label}
                                    </span>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {new Date(l.created_at).toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(l)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)} disabled={isPending} className="text-red-500 hover:text-red-600">
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
