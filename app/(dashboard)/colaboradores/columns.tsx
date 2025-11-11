"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ColaboradorType } from "@/types/colaborador"

export const columns: ColumnDef<ColaboradorType>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "matricula",
    header: "Matricula",
  },
  {
    accessorKey: "cargo",
    header: "Cargo",
  },
  {
    accessorKey: "funcao",
    header: "Funções",
  },
]