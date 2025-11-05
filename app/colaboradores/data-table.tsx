"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import MultiSelect from "@/components/ui/multiselect"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface Procedimento {
  id: number
  nome: string | null
  numero: string | null
  data_validade: Date | null
  assinado: boolean
  data_assinatura: Date | null
  created_at: Date
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Controle de estados
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [countFilters, setCountFilters] = useState(0);

  // Estados para procedimentos
  const [selectedColaboradorId, setSelectedColaboradorId] = useState<number | null>(null);
  const [selectedColaboradorNome, setSelectedColaboradorNome] = useState<string>("");
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loadingProcedimentos, setLoadingProcedimentos] = useState(false);
  const [updatingProcedimento, setUpdatingProcedimento] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Config da tabela
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    }
  })

  const functionsOptions = [
    { value: 'nenhum', label: 'N/A' },
    { value: 'AV', label: 'AV' },
    { value: 'BOIX', label: 'BOIX' },
    { value: 'Conferência Manual', label: 'Conferência - Manual' },
    { value: 'Conferência Móvel', label: 'Conferência - Móvel' },
    { value: 'Conferência Sistema', label: 'Conferência - Sistema' },
    { value: 'Grandes Volumes', label: 'Grandes Volumes' },
    { value: 'Plasmetal', label: 'Plasmetal' },
    { value: 'Faturamento', label: 'Faturamento' },
    { value: 'One Time', label: 'One Time' },
    { value: 'Ressuprimento', label: 'Ressuprimento' },
    { value: 'RFID', label: 'RFID' },
    { value: 'Separação', label: 'Separação' },
  ];

  // ---- GET Colaboradores ----
  const getColaboradores = async () => {
    try {
      const allColaboradores = await fetch("/api/colaboradores");
      const response = await allColaboradores.json();
      console.log(response);
  } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  }

  useEffect(() => {
    getColaboradores();
  }, []);

  // ---- INSERT Colaboradores ----
  const [nomeColaborador, setNomeColaborador] = useState("");
  const [matriculaColaborador, setMatriculaColaborador] = useState("");
  const [cargoColaborador, setCargoColaborador] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleInsertColaborador = async () => {
    const payload = {
      nome: nomeColaborador,
      matricula: matriculaColaborador,
      cargo: cargoColaborador,
      funcao: selectedValues,
    };

    try {
      const res = await fetch("/api/colaboradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao inserir colaborador");

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  // Buscar procedimentos quando um colaborador for selecionado
  const handleColaboradorClick = async (colaboradorId: number, colaboradorNome: string) => {
    setSelectedColaboradorId(colaboradorId);
    setSelectedColaboradorNome(colaboradorNome);
    setLoadingProcedimentos(true);
    setIsDrawerOpen(true);

    try {
      const res = await fetch(`/api/colaboradores/${colaboradorId}/procedimentos`);
      if (!res.ok) throw new Error("Erro ao buscar procedimentos");

      const response = await res.json();
      setProcedimentos(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar procedimentos:", error);
      setProcedimentos([]);
    } finally {
      setLoadingProcedimentos(false);
    }
  };

  // Atualizar status de assinatura
  const handleToggleAssinatura = async (procedimentoId: number, assinado: boolean) => {
    if (!selectedColaboradorId) return;

    setUpdatingProcedimento(procedimentoId);

    try {
      const res = await fetch(
        `/api/colaboradores/${selectedColaboradorId}/procedimentos/${procedimentoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assinado: !assinado })
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar procedimento");

      // Atualiza a lista local
      setProcedimentos(prev =>
        prev.map(proc =>
          proc.id === procedimentoId
            ? { ...proc, assinado: !assinado, data_assinatura: !assinado ? new Date() : null }
            : proc
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar procedimento:", error);
    } finally {
      setUpdatingProcedimento(null);
    }
  };

  // Formatar data
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Pega os valores dos inputs (ou filtros)
  const nome = (table.getColumn("nome")?.getFilterValue() as string) ?? "";
  const matricula = (table.getColumn("matricula")?.getFilterValue() as string) ?? "";
  const cargo = (table.getColumn("cargo")?.getFilterValue() as string) ?? "";

  useEffect(() => {
    const ativos = [nome, matricula, cargo].filter((v) => v && v.trim() !== "").length;
    setCountFilters(ativos);
  }, [nome, matricula, cargo]);

  // Estatísticas dos procedimentos
  const totalProcedimentos = procedimentos.length;
  const procedimentosAssinados = procedimentos.filter(p => p.assinado).length;
  const procedimentosPendentes = totalProcedimentos - procedimentosAssinados;

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <div className="p-4">
            <div className="flex gap-5 items-center">
              {/* Botão para Filtros */}
              <Sheet>
                <SheetTrigger>
                  {countFilters !== 0 ? (
                    <div className="relative p-1">
                      <Button variant="outline">
                        <span className="text-white bg-red-800 size-4 rounded-full absolute right-0 top-0 flex justify-center items-center">{countFilters}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                        </svg>
                        <span>Filtrar</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="relative p-1">
                      <Button variant="outline">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                        </svg>
                        <span>Filtrar</span>
                      </Button>
                    </div>
                  )}
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtrar por:</SheetTitle>
                    <SheetDescription className="space-y-5">
                      <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="nome-colaborador">Nome:</label>
                        <Input
                          id="nome-colaborador"
                          placeholder="Nome do colaborador"
                          value={nome}
                          onChange={(e) => table.getColumn("nome")?.setFilterValue(e.target.value)}
                          className="max-w-sm"
                        />
                      </div>
                      <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="matricula-colaborador">Matrícula:</label>
                        <Input
                          id="matricula-colaborador"
                          placeholder="Ex: 21474"
                          value={matricula}
                          onChange={(e) => table.getColumn("matricula")?.setFilterValue(e.target.value)}
                          className="max-w-sm"
                        />
                      </div>
                      <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="cargo-colaborador">Cargo:</label>
                        <Input
                          placeholder="Ex: Auxiliar de Operações"
                          value={cargo}
                          onChange={(e) => table.getColumn("cargo")?.setFilterValue(e.target.value)}
                          className="max-w-sm"
                        />
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              <div className="h-[30px] w-px border-r border-control"></div>

              {/* Botão para Inserir */}
              <Sheet>
                <SheetTrigger>
                  <Button variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>Inserir</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Inserir Colaborador:</SheetTitle>
                  </SheetHeader>
                  <SheetDescription className="space-y-5">
                    <div className="flex flex-col justify-start gap-2">
                      <label htmlFor="nome-colaborador">Nome Completo:</label>
                      <Input
                        id="nome-colaborador"
                        placeholder="Nome do colaborador"
                        className="max-w-sm"
                        value={nomeColaborador}
                        onChange={(e) => setNomeColaborador(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                      <label htmlFor="matricula-colaborador">Matrícula:</label>
                      <Input
                        id="matricula-colaborador"
                        placeholder="Ex: 21474"
                        className="max-w-sm"
                        value={matriculaColaborador}
                        onChange={(e) => setMatriculaColaborador(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                      <label htmlFor="cargo-colaborador">Cargo:</label>
                      <Select onValueChange={(value) => setCargoColaborador(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nenhum">N/A</SelectItem>
                          <SelectItem value="Auxiliar de Operações">Auxiliar de Operações</SelectItem>
                          <SelectItem value="Conferente">Conferente</SelectItem>
                          <SelectItem value="Assistente de Operações">Assistente de Operações</SelectItem>
                          <SelectItem value="Técnico de Operações">Técnico de Operações</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mb-4">
                      <label>Funções:</label>
                      <div className="w-full max-w-sm">
                        <MultiSelect
                          options={functionsOptions}
                          value={selectedValues}
                          onChange={setSelectedValues}
                          placeholder="Selecione as funções..."
                        />
                      </div>
                    </div>
                  </SheetDescription>
                  <div className="flex flex-col mt-3 space-y-4">
                    <Button onClick={handleInsertColaborador}>Inserir Colaborador</Button>
                    <Button variant="secondary">Cancelar</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>


          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Sem resultados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}