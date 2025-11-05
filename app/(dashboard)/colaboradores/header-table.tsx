import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import {
    Table,
} from "@tanstack/react-table"

interface DataTableProps<TData> {
    table: Table<TData>
}

export function HeaderTable<TData>({
    table
}: DataTableProps<TData>) {

    const [countFilters, setCountFilters] = useState(0);

    // Pega os valores dos inputs (ou filtros)
    const nome = (table.getColumn("nome")?.getFilterValue() as string) ?? "";
    const matricula = (table.getColumn("matricula")?.getFilterValue() as string) ?? "";
    const cargo = (table.getColumn("cargo")?.getFilterValue() as string) ?? "";

    useEffect(() => {
        const ativos = [nome, matricula, cargo].filter((v) => v && v.trim() !== "").length;
        setCountFilters(ativos);
    }, [nome, matricula, cargo]);

    return (
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
                                    <label htmlFor="nome-colaborador">
                                        Nome do Colaborador:
                                    </label>
                                    <div className="grid flex-1 gap-2">
                                        <Input
                                            id="nome-colaborador"
                                            placeholder="Nome do Colaborador"
                                            value={nome}
                                            onChange={(e) => table.getColumn("nome")?.setFilterValue(e.target.value)}
                                            className="max-w-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start gap-2">
                                    <label htmlFor="matricula-colaborador">
                                        Número:
                                    </label>
                                    <div className="grid flex-1 gap-2">
                                        <Input
                                            id="matricula-colaborador"
                                            placeholder="Ex: 21474"
                                            value={matricula}
                                            onChange={(e) => table.getColumn("matricula")?.setFilterValue(e.target.value)}
                                            className="max-w-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col justify-start gap-2">
                                    <label>
                                        Cargo
                                    </label>
                                    <div className="grid flex-1 gap-2">
                                        <Input
                                            placeholder="Ex: Auxiliar de Operações"
                                            value={cargo}
                                            onChange={(e) => table.getColumn("cargo")?.setFilterValue(e.target.value)}
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
              </Sheet>
            </div>
        </div>
    );
}