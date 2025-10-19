
import { prisma } from "@/lib/prisma";

export async function getColaboradores() {
  try {
    const colaboradores = await prisma.colaboradores.findMany();
    return colaboradores;
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return []; // Retorna array vazio em caso de erro
  }
}

export async function createColaborador(data: {
  nome: string;
  matricula: string;
  cargo: string;
  funcao: string[];
}) {
  try {
    const novoColaborador = await prisma.colaboradores.create({
      data: {
        nome: data.nome,
        matricula: data.matricula,
        cargo: data.cargo,
        funcao: data.funcao
      },
    });

    return novoColaborador;
  } catch (error) {
    console.error("Erro ao inserir colaborador: ", error);
    throw new Error("Falha ao inserir colaborador");
  }
} 