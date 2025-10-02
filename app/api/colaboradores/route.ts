"use server";

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'API de Colaboradores funcionando!' });
}

export async function POST(request: Request) {
    const { nome, matricula, cargo, funcao } = await request.json();
    
    // Aqui você pode adicionar a lógica para salvar o colaborador no banco de dados
    // Por exemplo, usando Supabase ou qualquer outro serviço de banco de dados

    return NextResponse.json({ message: 'Colaborador criado com sucesso!' });
}