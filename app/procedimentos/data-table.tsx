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
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar28 } from "@/components/ui/calendar28"
import MultiSelect from "@/components/ui/multiselect"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Controle de estados
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [countFilters, setCountFilters] = useState(0);

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

  // Opções de funções disponíveis
  const functionsOptions = [
  { label: "AV", value: "AV" },
  { label: "BOIX", value: "BOIX" },
  { label: "Conferência Manual", value: "CONFERENCIA_MANUAL" },
  { label: "Conferência Móvel", value: "CONFERENCIA_MOVEL" },
  { label: "Conferência Sistema", value: "CONFERENCIA_SISTEMA" },
  { label: "Grandes Volumes", value: "GRANDES_VOLUMES" },
  { label: "Plasmetal", value: "PLASMETAL" },
  { label: "Faturamento", value: "FATURAMENTO" },
  { label: "One Time", value: "ONE_TIME" },
  { label: "Ressuprimento", value: "RESSUPRIMENTO" },
  { label: "RFID", value: "RFID" },
  { label: "Separação", value: "SEPARACAO" },
];

  // Pega os valores dos inputs (ou filtros)
  const nome = (table.getColumn("nome")?.getFilterValue() as string) ?? "";
  const numero = (table.getColumn("numero")?.getFilterValue() as string) ?? "";
  const dataValidade = (table.getColumn("data_validade")?.getFilterValue() as string) ?? "";

  useEffect(() => {
    const ativos = [nome, numero, dataValidade].filter((v) => v && v.trim() !== "").length;
    setCountFilters(ativos);
  }, [nome, numero, dataValidade]);

  // Estados para inserção de procedimento
  const [nomeProcedimento, setNomeProcedimento] = useState("");
  const [numeroProcedimento, setNumeroProcedimento] = useState("");
  const [dataProcedimento, setDataProcedimento] = useState("");
  const [selectedFuncoes, setSelectedFuncoes] = useState<string[]>([]);

  const handleInsertProcedimento = async () => {
    try {
      const payload = {
        nome: nomeProcedimento,
        numero: numeroProcedimento,
        data_validade: dataProcedimento,
        funcoesVinculadas: selectedFuncoes
      }

      console.log("payload", payload);

      const res = await fetch("/api/procedimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao inserir procedimento");

      // Limpa os campos
      setNomeProcedimento("");
      setNumeroProcedimento("");
      setDataProcedimento("");
      setSelectedFuncoes([]);

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <div className="p-4">
            {/* Botões para ativação dos Sheets no Header da tabela */}
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
                        <label htmlFor="nome-procedimento">
                          Nome do Procedimento:
                        </label>
                        <div className="grid flex-1 gap-2">
                          <Input
                            id="nome-procedimento"
                            placeholder="Nome do Procedimento"
                            value={nome}
                            onChange={(e) => table.getColumn("nome")?.setFilterValue(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="numero-procedimento">
                          Número:
                        </label>
                        <div className="grid flex-1 gap-2">
                          <Input
                            id="numero-procedimento"
                            placeholder="Ex: DI.POP.013"
                            value={numero}
                            onChange={(e) => table.getColumn("numero")?.setFilterValue(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-start gap-2">
                        <label>
                          Data Validade:
                        </label>
                        <div className="grid flex-1 gap-2">
                          <Input
                            placeholder="Ex: 18/04/2027"
                            value={dataValidade}
                            onChange={(e) => table.getColumn("data_validade")?.setFilterValue(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              {/* Separador de botões */}
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
                    <SheetTitle>Inserir Procedimento:</SheetTitle>
                  </SheetHeader>
                  <SheetDescription className="space-y-5">
                    <div className="flex flex-col justify-start gap-2">
                      <label htmlFor="nome-procedimento">
                        Nome do Procedimento:
                      </label>
                      <Input
                        id="nome-procedimento"
                        placeholder="Ex: Separação"
                        className="max-w-sm"
                        value={nomeProcedimento}
                        onChange={(e) => setNomeProcedimento(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                      <label htmlFor="numero-procedimento">
                        Número:
                      </label>
                      <Input
                        id="numero-procedimento"
                        placeholder="Ex: DI.POP.013"
                        className="max-w-sm"
                        value={numeroProcedimento}
                        onChange={(e) => setNumeroProcedimento(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                      <label>
                        Data Validade:
                      </label>
                      <Calendar28
                        value={dataProcedimento}
                        onChange={(date: Date) => setDataProcedimento(date.toISOString().split("T")[0])}
                      />
                    </div>

                    <div className="flex flex-col justify-start gap-2">
                      <label>
                        Link (Funções vinculadas):
                      </label>
                      <MultiSelect
                        options={functionsOptions}
                        value={selectedFuncoes}
                        onChange={setSelectedFuncoes}
                        placeholder="Selecione as funções..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Este procedimento será automaticamente exibido para colaboradores com as funções selecionadas.
                      </p>
                    </div>

                    <div className="flex flex-col mt-3 space-y-4">
                      <Button onClick={handleInsertProcedimento}>Inserir Procedimento</Button>
                      <Button variant="secondary">Cancelar</Button>
                    </div>
                  </SheetDescription>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Colunas da tabela */}
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
    </div >
  )
}