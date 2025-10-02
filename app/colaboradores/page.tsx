// import getColaboradores from "@/services/colaboradores.service";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import getColaboradores from "@/services/colaboradores.service";

export default async function HomePage() {
  const data = await getColaboradores();

  return (
    <div className="grid grid-cols-[60px]">
      <div className="col-start-2 col-end-12 z-0 p-5">
        <h1 className="text-2xl font-bold mb-4">Colaboradores</h1>
          <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
