import { prisma } from "@/lib/prisma";

export async function getProcedimentos() {
    try {
        const procedimentos = await prisma.procedimentos.findMany();
        return procedimentos;
    } catch (error) {
        console.error("Erro ao buscar procedimentos: ", error)
        return [];
    }
}