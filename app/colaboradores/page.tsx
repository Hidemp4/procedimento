import getColaboradores from "@/services/colaboradores.service";

export default async function HomePage() {
  const colaboradores = await getColaboradores();

  return (
    <div className="grid grid-cols-[60px]">
      <div className="col-start-2 col-end-12 z-0 p-5">
        <h1 className="text-2xl font-bold mb-4">Colaboradores</h1>
        <ul className="space-y-2">
          {colaboradores.map(colaborador => (
            <li key={colaborador.id} className="p-2 border rounded">
              <div>Nome: {colaborador.nome}</div>
              <div>Matrícula: {colaborador.matricula}</div>
              <div>Cargo: {colaborador.cargo}</div>
              <div>Funções: {colaborador.funcao.join(", ")}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
