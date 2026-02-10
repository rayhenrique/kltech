"use client";

import { useState, useTransition } from "react";
import type { Contract } from "@/lib/queries";
import { createContract, updateContract, deleteContract } from "@/lib/actions/contracts";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
    ativo: { label: "Ativo", color: "bg-emerald-100 text-emerald-700" },
    encerrado: { label: "Encerrado", color: "bg-slate-100 text-slate-700" },
    pausado: { label: "Pausado", color: "bg-amber-100 text-amber-700" },
};

function ContractForm({
    contract,
    onClose,
}: {
    contract?: Contract;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            if (contract) {
                await updateContract(contract.id, formData);
            } else {
                await createContract(formData);
            }
            onClose();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input id="cliente" name="cliente" defaultValue={contract?.cliente} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" defaultValue={contract?.descricao} required rows={3} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="valor_mensal">Valor Mensal (R$)</Label>
                    <Input
                        id="valor_mensal"
                        name="valor_mensal"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={contract?.valor_mensal ?? ""}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={contract?.status ?? "ativo"}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="encerrado">Encerrado</SelectItem>
                            <SelectItem value="pausado">Pausado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="data_inicio">Data de Início</Label>
                    <Input id="data_inicio" name="data_inicio" type="date" defaultValue={contract?.data_inicio ?? ""} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="data_fim">Data de Término</Label>
                    <Input id="data_fim" name="data_fim" type="date" defaultValue={contract?.data_fim ?? ""} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea id="notas" name="notas" defaultValue={contract?.notas ?? ""} rows={2} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={isPending} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {contract ? "Atualizar" : "Criar"}
                </Button>
            </div>
        </form>
    );
}

export function ContratosClient({ contracts }: { contracts: Contract[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Contract | undefined>();
    const [isPending, startTransition] = useTransition();

    const totalReceita = contracts
        .filter((c) => c.status === "ativo")
        .reduce((sum, c) => sum + (Number(c.valor_mensal) || 0), 0);

    function handleEdit(c: Contract) {
        setEditing(c);
        setDialogOpen(true);
    }

    function handleNew() {
        setEditing(undefined);
        setDialogOpen(true);
    }

    function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este contrato?")) return;
        startTransition(() => deleteContract(id));
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {contracts.length} contratos — Receita ativa:{" "}
                        <span className="font-semibold text-emerald-600">
                            R$ {totalReceita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        /mês
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleNew} className="bg-blue-accent text-white hover:bg-blue-accent/90">
                            <Plus className="h-4 w-4" /> Novo Contrato
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
                        </DialogHeader>
                        <ContractForm contract={editing} onClose={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border border-border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Valor/Mês</TableHead>
                            <TableHead>Início</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contracts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    Nenhum contrato encontrado
                                </TableCell>
                            </TableRow>
                        )}
                        {contracts.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">{c.cliente}</TableCell>
                                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                                    {c.descricao}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    R$ {Number(c.valor_mensal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {new Date(c.data_inicio + "T00:00:00").toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusConfig[c.status]?.color}`}
                                    >
                                        {statusConfig[c.status]?.label}
                                    </span>
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
