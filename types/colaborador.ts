import { Funcao } from "@prisma/client";

export type FuncaoType = 'AV' | 'BOIX' | 'CONFERENCIA_MANUAL' | 'CONFERENCIA_MOVEL' |'CONFERENCIA_SISTEMA' | 'GRANDES_VOLUMES' |'PLASMETAL' | 'FATURAMENTO' |'ONE_TIME' | 'RESSUPRIMENTO' | 'RFID' |'SEPARACAO'; 

export interface ColaboradorDTO {
    nome: string;
    matricula: string;
    cargo: string;
    funcao: FuncaoType[];
}

export interface ColaboradorType extends ColaboradorDTO {
    id: number;
}