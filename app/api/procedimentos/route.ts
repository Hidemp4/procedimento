import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allProcedimentos = await prisma.procedimentos.findMany();

        if (allProcedimentos.length === 0) {
            return NextResponse.json(
                {
                    message: "Nenhum procedimento encontrado!",
                    data: [],
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                message: "ok",
                data: allProcedimentos,
                total: allProcedimentos.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao buscar procedimentos: ", error);

        return NextResponse.json(
            { message: "[ERRO] Erro ao buscar os procedimentos!" },
            { status: 500 }
        );
    }
}