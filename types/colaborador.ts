import { Funcao } from "@prisma/client";

export interface ColaboradorDTO {
    nome: string;
    matricula: string;
    cargo: string;
    funcao: Funcao[];
}

export interface ColaboradorType extends ColaboradorDTO {
    id: number;
}