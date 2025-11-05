import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; procedimentoId: string } }
) {
  try {
    const colaboradorId = parseInt(params.id);
    const procedimentoId = parseInt(params.procedimentoId);
    const { assinado } = await request.json();

    if (isNaN(colaboradorId) || isNaN(procedimentoId)) {
      return NextResponse.json(
        { message: "IDs inválidos!" },
        { status: 400 }
      );
    }

    if (typeof assinado !== 'boolean') {
      return NextResponse.json(
        { message: "O campo 'assinado' deve ser um boolean!" },
        { status: 400 }
      );
    }

    // Busca o colaborador com suas funções
    const colaborador = await prisma.colaboradores.findUnique({
      where: { id: colaboradorId }
    });

    if (!colaborador) {
      return NextResponse.json(
        { message: "Colaborador não encontrado!" },
        { status: 404 }
      );
    }

    // Busca o procedimento com funções vinculadas
    const procedimento = await prisma.procedimentos.findUnique({
      where: { id: procedimentoId }
    });

    if (!procedimento) {
      return NextResponse.json(
        { message: "Procedimento não encontrado!" },
        { status: 404 }
      );
    }

    // Identifica quais funções do colaborador dão acesso a este procedimento
    const funcoesColaborador = (colaborador.funcao as string[]) || [];
    const funcoesVinculadas = (procedimento.funcoes_vinculadas as string[]) || [];
    const funcoesEmComum = funcoesColaborador.filter(funcao => 
      funcoesVinculadas.includes(funcao)
    );

    // Verifica se já existe o registro na tabela pivot
    const existente = await prisma.colaborador_procedimento.findFirst({
      where: {
        colaborador_id: colaboradorId,
        procedimento_id: procedimentoId
      }
    });

    let resultado;

    if (existente) {
      // Atualiza o registro existente
      resultado = await prisma.colaborador_procedimento.update({
        where: { id: existente.id },
        data: {
          assinado,
          data_assinatura: assinado ? new Date() : null,
          funcoes_vinculadas: funcoesEmComum // Armazena quais funções vinculam este colaborador a este procedimento
        },
        include: {
          procedimentos: true
        }
      });
    } else {
      // Cria novo registro
      resultado = await prisma.colaborador_procedimento.create({
        data: {
          colaborador_id: colaboradorId,
          procedimento_id: procedimentoId,
          assinado,
          data_assinatura: assinado ? new Date() : null,
          funcoes_vinculadas: funcoesEmComum // Armazena quais funções vinculam este colaborador a este procedimento
        },
        include: {
          procedimentos: true
        }
      });
    }

    return NextResponse.json(
      {
        message: "Assinatura atualizada com sucesso!",
        data: resultado
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ERRO] Erro ao atualizar assinatura do procedimento!", err);

    return NextResponse.json(
      { 
        message: "[ERRO] Erro ao atualizar assinatura do procedimento!", 
        err 
      },
      { status: 500 }
    );
  }
}