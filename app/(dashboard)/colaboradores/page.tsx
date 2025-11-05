
import { getColaboradores } from "@/services/colaboradores.service";
import type { colaboradores } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function HomePage() {
  const data: colaboradores[] = await getColaboradores();

  return (
    <div className="w-full h-full">
      <h1 className="text-3xl font-medium mb-4">Colaboradores</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
