
import { getProcedimentos } from "@/services/procedimentos.service";
import type { procedimentos } from "@prisma/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function HomePage() {
  const data: procedimentos[] = await getProcedimentos();

  return (
    <div className="grid grid-cols-[60px]">
      <div className="col-start-2 col-end-12 z-0 p-5">
        <h1 className="text-3xl font-medium mb-4">Procedimentos</h1>
          <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
