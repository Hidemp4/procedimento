"use client"

import { Funcao } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

type ColaboradorType = {
  id: number
  nome: string | null
  matricula: string | null
  cargo: string | null
  funcao: Funcao[]
}

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