// /app/api/colaboradores/[id]/procedimentos/route.ts
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

    // Extrai as funções do colaborador
    const funcoesColaborador = (colaborador.funcao as string[]) || [];

    // Busca todos os procedimentos
    const todosProcedimentos = await prisma.procedimentos.findMany({
      orderBy: { nome: 'asc' }
    });

    // Filtra procedimentos que têm pelo menos uma função em comum com o colaborador
    const procedimentosFiltrados = todosProcedimentos.filter(proc => {
      const funcoesVinculadas = (proc.funcoes_vinculadas as string[]) || [];
      
      // Se o procedimento não tem funções vinculadas, não mostrar
      if (funcoesVinculadas.length === 0) {
        return false;
      }
      
      // Verifica se há interseção entre as funções do colaborador e as funções vinculadas ao procedimento
      return funcoesVinculadas.some(funcao => 
        funcoesColaborador.includes(funcao)
      );
    });

    // Busca os procedimentos assinados por este colaborador
    const procedimentosAssinados = await prisma.colaborador_procedimento.findMany({
      where: { colaborador_id: colaboradorId },
      include: { procedimentos: true }
    });

    // Cria um Map para acesso rápido
    const assinaturasMap = new Map(
      procedimentosAssinados.map(item => [item.procedimento_id, item])
    );

    // Mapeia os procedimentos com status de assinatura
    const procedimentosComStatus = procedimentosFiltrados.map(proc => {
      const assinatura = assinaturasMap.get(proc.id);
      const funcoesVinculadas = (proc.funcoes_vinculadas as string[]) || [];
      
      // Identifica quais funções do colaborador dão acesso a este procedimento
      const funcoesEmComum = funcoesColaborador.filter(funcao => 
        funcoesVinculadas.includes(funcao)
      );

      return {
        id: proc.id,
        nome: proc.nome,
        numero: proc.numero,
        data_validade: proc.data_validade,
        funcoes_vinculadas: funcoesVinculadas,
        funcoes_colaborador: funcoesEmComum, // Funções do colaborador que dão acesso
        assinado: assinatura?.assinado || false,
        data_assinatura: assinatura?.data_assinatura || null,
        created_at: proc.created_at
      };
    });

    return NextResponse.json(
      {
        message: "ok",
        data: procedimentosComStatus,
        total: procedimentosComStatus.length,
        colaborador_funcoes: funcoesColaborador // Info extra para debug
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ERRO] Erro ao buscar procedimentos do colaborador!", err);

    return NextResponse.json(
      { 
        message: "[ERRO] Erro ao buscar procedimentos do colaborador!", 
        err 
      },
      { status: 500 }
    );
  }
}