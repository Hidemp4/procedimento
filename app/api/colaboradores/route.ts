import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const allColaboradores = await prisma.colaboradores.findMany();

    // Verifica se o array de colaboradores é vazio
    if (allColaboradores.length === 0) {
      return NextResponse.json(
        {
          message: "Nenhum colaborador encontrado!",
          data: [],
        },
        { status: 200 }
      );
    }

    // Retorna todos os colaboradores
    return NextResponse.json(
      {
        message: "ok",
        data: allColaboradores,
        total: allColaboradores.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ERRO] Erro ao buscar os colaboradores!", err);

    return NextResponse.json(
      { message: "[ERRO] Erro ao buscar os colaboradores!" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, matricula, cargo, funcao } = body;

    // Verifica se todos os campos obrigatórios possuem na requisição
    if (!body.nome || !body.matricula) {
      return NextResponse.json(
        { message: "Por favor, preencha todos os campos obrigatórios" },
        { status: 400 }
      );
    }

    // Cria o colaborador
    const createColaborador = await prisma.colaboradores.create({
      data: {
        nome,
        matricula,
        cargo: cargo ?? "",
        funcao: funcao ?? [],
      },
    });

    return Response.json(
      {
        message: "Colaborador Criado",
        createColaborador,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[ERRO] Este colaborador não pode ser criado!");

    return NextResponse.json(
      {
        message: "[ERRO] Este Colaborador não pode ser criado!",
        err,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Verifica se o colaborador existe
    const isColaborador = await prisma.colaboradores.findUnique({
      where: { id: Number(id) },
    });

    if (!isColaborador) {
      return NextResponse.json(
        { message: "Este colaborador não foi encontrado!" },
        { status: 404 }
      );
    }

    // Deleta o colaborador
    const deleteColaborador = await prisma.colaboradores.delete({
      where: {
        id,
      },
    });

    return Response.json(
      {
        message: "Colaborador deletado!",
        deleteColaborador,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ERRO] Erro ao deletar colaborador: ", err);

    if (err instanceof Error) {
      // Erro de colaborador não encontrado
      if (err.message.includes("Record to delete does not exist")) {
        return NextResponse.json(
          { error: "Colaborador não encontrado" },
          { status: 404 }
        );
      }

      // Erro de constraint (relacionamento)
      if (err.message.includes("foreign key constraint")) {
        return Response.json(
          {
            error:
              "Não é possível deletar: colaborador possui dados relacionados",
          },
          { status: 409 }
        );
      }
    }

    // Tratamento de erro genérico
    return NextResponse.json(
      { message: "[ERRO] Erro ao deletar colaborador" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, nome, matricula, cargo, funcao } = await req.json();

    // Verifica se o usuário existe para modificar
    const isColaborador = await prisma.colaboradores.findUnique({
      where: { id: Number(id) },
    });

    if (!isColaborador) {
      return NextResponse.json(
        { message: "Este colaborador não foi encontrado!" },
        { status: 404 }
      );
    }

    // Atualiza as infos do colaborador
    const updateColaborador = await prisma.colaboradores.update({
      where: {
        id,
      },
      data: {
        nome,
        matricula,
        cargo,
        funcao,
      },
    });

    return Response.json(
      { message: "Usuário atualizado com sucesso!", updateColaborador },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "[ERRO] Não foi possível atualizar os dados deste colaborador!"
    );

    return NextResponse.json(
      {
        message: "[ERRO] Não foi possível atualizar os dados deste colaborador!",
        err
      },
      { status: 500 }
    );
  }
}
