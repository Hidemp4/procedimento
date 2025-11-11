import { NextResponse } from "next/server";
import { createColaborador, getColaboradores } from "@/services/colaboradores.service";

export async function GET() {
    try {
        const allColaboradores = await getColaboradores();
        return NextResponse.json(allColaboradores, { status: 200 });
    } catch {
        console.error("Não foi possível buscar os colaboradores.");
        return NextResponse.json(
            { message: "Falha ao buscar colaboradores" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newColaborador = await createColaborador({
            nome: data.nome,
            matricula: data.matricula,
            cargo: data.cargo,
            funcao: data.funcao
        })

        return NextResponse.json(newColaborador, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar colaborador: ", error);
        return NextResponse.json(
            { message: "Falha ao criar colaborador" },
            { status: 500 }
        );
    }
}