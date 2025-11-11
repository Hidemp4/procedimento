
import { JSX } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ColaboradorType } from "@/types/colaborador";

export default async function HomePage(): Promise<JSX.Element> {
  const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";

  const res = await fetch(`${baseUrl}/api/colaboradores`)
  const data: ColaboradorType[] = await res.json();

  console.log("Colaboradores fetched:", data);

  return (
    <div className="w-full h-full">
      <h1 className="text-3xl font-medium mb-4">Colaboradores</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
