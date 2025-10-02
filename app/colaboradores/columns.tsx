"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Colaborador = {
  id: string
  nome: string
  matricula: string
  cargo: string
  funcao: Array<string>
}

export const columns: ColumnDef<Colaborador>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "matricula",
    header: "Matrícula",
  },
  {
    accessorKey: "cargo",
    header: "Cargo",
  },
  {
    accessorKey: "funcao",
    header: "Função",
    cell: ({ row }) => {
      const funcoes = row.getValue("funcao") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {funcoes.map((funcao, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
            >
              {funcao}
            </span>
          ))}
        </div>
      )
    },
  }
]