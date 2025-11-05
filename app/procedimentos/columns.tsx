"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/components/ui/calendar28";
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
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? formatDate(new Date(value as string)) : "N/A";
    },
  },
  {
    accessorKey: "funcoes",
    header: "Link (Funções)",
    cell: ({ getValue }) => {
      const funcoes = getValue() as string[] | null;
      
      if (!funcoes || funcoes.length === 0) {
        return (
          <Badge variant="secondary" className="text-xs">
            Sem vínculo
          </Badge>
        );
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-md">
          {funcoes.map((funcao, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300"
            >
              {funcao}
            </Badge>
          ))}
        </div>
      );
    },
  },
]