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

export async function POST(req: Request) {
  try {
    const { nome, numero, data_validade, funcoes_vinculadas } = await req.json();

    // Cria o procedimento com as funções vinculadas
    const newProcedimento = await prisma.procedimentos.create({
      data: {
        nome,
        numero,
        data_validade: data_validade ? new Date(data_validade) : null,
        funcoes_vinculadas,
      }
    });

    return NextResponse.json(
      { message: "Procedimento criado com sucesso!", data: newProcedimento },
      { status: 201 }
    );
  } catch (err) {
    console.error("[ERRO] Erro ao criar procedimento!", err);

    return NextResponse.json(
      { message: "[ERRO] Erro ao criar procedimento!", err },
      { status: 500 }
    );
  }
}