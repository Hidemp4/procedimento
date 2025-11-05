import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const colaboradorId = parseInt(params.id);

    if (isNaN(colaboradorId)) {
      return NextResponse.json(
        { message: "ID inválido!" },
        { status: 400 }
      );
    }

    const colaborador = await prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
      include: {
        colaborador_procedimento: {
          include: {
            procedimentos: true
          }
        }
      }
    });

    if (!colaborador) {
      return NextResponse.json(
        { message: "Colaborador não encontrado!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "ok",
        data: colaborador,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ERRO] Erro ao buscar colaborador!", err);

    return NextResponse.json(
      { message: "[ERRO] Erro ao buscar colaborador!", err },
      { status: 500 }
    );
  }
}