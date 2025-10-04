
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getColaboradores } from "@/services/colaboradores.service";
import type { colaboradores } from "@prisma/client";

export default async function HomePage() {
  const data: colaboradores[] = await getColaboradores();

  return (
    <div className="grid grid-cols-[60px]">
      <div className="col-start-2 col-end-12 z-0 p-5">
        <h1 className="text-3xl font-medium mb-4">Colaboradores</h1>
          <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
