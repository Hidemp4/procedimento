
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