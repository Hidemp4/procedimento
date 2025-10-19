"use client"

import { Button } from "@/components/ui/button"
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type Procedimento = Prisma.procedimentosGetPayload<object>;

export const columns: ColumnDef<Procedimento>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "numero",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Número
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "data_validade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data Validade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]