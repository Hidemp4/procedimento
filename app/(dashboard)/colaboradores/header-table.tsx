import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Funcao } from '@prisma/client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, X, Check } from 'lucide-react';
import {
    Table,
} from "@tanstack/react-table"
import { ColaboradorDTO } from "@/types/colaborador";

interface DataTableProps<T> {
    table: Table<T>
}

export function HeaderTable<T>({
    table
}: DataTableProps<T>) {

    // ============ Lógica dos filtros ============

    // Pega os valores dos inputs para filtros
    const nome = (table.getColumn("nome")?.getFilterValue() as string) ?? "";
    const matricula = (table.getColumn("matricula")?.getFilterValue() as string) ?? "";
    const cargo = (table.getColumn("cargo")?.getFilterValue() as string) ?? "";

    // Contador de filtros ativos
    const [countFilters, setCountFilters] = useState(0);
    useEffect(() => {
        const ativos = [nome, matricula, cargo].filter((v) => v && v.trim() !== "").length;
        setCountFilters(ativos);
    }, [nome, matricula, cargo]);

    // ============ Fim lógica de filtros ============

    // ============ Lógica de inserção de colaborador ============

    // Estados para o formulário de inserção
    const [nomeColaborador, setNomeColaborador] = useState("");
    const [matriculaColaborador, setMatriculaColaborador] = useState("");
    const [cargoColaborador, setCargoColaborador] = useState("");
    const [funcoesSelecionadas, setFuncoesSelecionadas] = useState<Funcao[]>([]);

    // Estado para controle do dropdown de funções
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fecha o dropdown "funções" ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Adiciona uma função da lista de funções selecionadas
    const toggleFuncao = (funcao: Funcao) => {
        if (funcoesSelecionadas.includes(funcao)) {
            setFuncoesSelecionadas(funcoesSelecionadas.filter((f) => f !== funcao));
        } else {
            setFuncoesSelecionadas([...funcoesSelecionadas, funcao]);
        }
    };

    // Remove uma função da lista de funções selecionadas
    const removeFuncao = (funcao: Funcao) => {
        setFuncoesSelecionadas(funcoesSelecionadas.filter((f) => f !== funcao));
    };

    // Trata o submit do formulário de inserção
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: ColaboradorDTO = {
            nome: nomeColaborador,
            matricula: matriculaColaborador,
            cargo: cargoColaborador,
            funcao: funcoesSelecionadas
        }

        await handleCreateColaborador(data);
    }

    // Função que faz a requisição para criar um novo colaborador
    const handleCreateColaborador = async (data: ColaboradorDTO) => {
        // Lógica para criar um novo colaborador
        const res = await fetch('api/colaboradores/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (!res.ok) throw new Error("Falha ao criar colaborador");
        return await res.json();
    };

    // ============ Fim lógica de inserção de colaborador ============


    return (
        <div className="p-4 flex justify-between w-full">
            {/* Botões para ativação dos Sheets no Header da tabela */}
            <div className="flex gap-5 items-center">

                {/* Botão para Inserir */}
                <Sheet>
                    <SheetTrigger>
                        <Button variant="outline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span>Inserir</span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Inserir novo colaborador</SheetTitle>
                            <SheetDescription>
                                {/* Formulário de inserção pode ser colocado aqui */}
                                Formulário de inserção de colaborador.
                            </SheetDescription>

                            <form onSubmit={handleSubmit} className="pt-6">
                                <div className="space-y-5">
                                    <div className="flex flex-col justify-start gap-2">
                                        <label htmlFor="insert-nome-colaborador">
                                            Nome Completo:
                                        </label>
                                        <div className="grid flex-1 gap-2">
                                            <Input
                                                id="insert-nome-colaborador"
                                                placeholder="Nome completo do colaborador"
                                                className="max-w-sm"
                                                value={nomeColaborador}
                                                onChange={(e) => setNomeColaborador(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-start gap-2">
                                        <label htmlFor="insert-matricula-colaborador">
                                            Mátricula:
                                        </label>
                                        <div className="grid flex-1 gap-2">
                                            <Input
                                                id="insert-matricula-colaborador"
                                                type="text"
                                                placeholder="Ex: 21474"
                                                value={matriculaColaborador}
                                                onChange={(e) => setMatriculaColaborador(e.target.value)}
                                                className="max-w-sm no-spin"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-start gap-2">
                                        <label htmlFor="insert-cargo-colaborador">
                                            Cargo
                                        </label>
                                        <div className="grid flex-1 gap-2">
                                            <Input
                                                id="insert-cargo-colaborador"
                                                placeholder="Ex: Auxiliar de Operações"
                                                className="max-w-sm"
                                                value={cargoColaborador}
                                                onChange={(e) => setCargoColaborador(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-start gap-2">
                                        <label htmlFor="insert-funcoes-colaborador" className="text-sm font-medium text-gray-700">
                                            Funções
                                        </label>

                                        <div className="relative" ref={dropdownRef}>
                                            {/* Dropdown Button */}
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(!isOpen)}
                                                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <span className="text-gray-700">
                                                    {funcoesSelecionadas.length === 0
                                                        ? 'Selecione as funções...'
                                                        : funcoesSelecionadas.length === 1
                                                            ? '1 função selecionada'
                                                            : `${funcoesSelecionadas.length} funções selecionadas`
                                                    }
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isOpen && (
                                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                                    <div className="p-2">
                                                        {Object.entries(Funcao).map(([key, value]) => (
                                                            <button
                                                                key={key}
                                                                type="button"
                                                                onClick={() => toggleFuncao(value)}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-colors duration-150 group"
                                                            >
                                                                <div className={`w-5 h-5 flex items-center justify-center border-2 rounded ${funcoesSelecionadas.includes(value)
                                                                    ? 'bg-blue-500 border-blue-500'
                                                                    : 'border-gray-300 group-hover:border-blue-400'
                                                                    } transition-all duration-150`}>
                                                                    {funcoesSelecionadas.includes(value) && (
                                                                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                                                    )}
                                                                </div>
                                                                <span className={`text-sm flex-1 text-left ${funcoesSelecionadas.includes(value)
                                                                    ? 'font-medium text-blue-700'
                                                                    : 'text-gray-700 group-hover:text-blue-600'
                                                                    }`}>
                                                                    {value.replace(/_/g, ' ')}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Selected Tags */}
                                        {funcoesSelecionadas.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {funcoesSelecionadas.map((funcao) => (
                                                    <span
                                                        key={funcao}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium group hover:bg-blue-200 transition-colors duration-150"
                                                    >
                                                        {funcao.replace(/_/g, ' ')}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFuncao(funcao)}
                                                            className="hover:bg-blue-300 rounded-full p-0.5 transition-colors duration-150"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button type="submit" className="mt-4">Salvar</Button>
                            </form>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                {/* Separador de botões */}
                <div className="h-[30px] w-px border-r border-control"></div>

                {/* Botão para Filtros */}
                <Sheet>
                    <SheetTrigger>
                        {countFilters !== 0 ? (
                            <div className="relative p-1">
                                <Button variant="outline">
                                    <span className="text-white bg-red-800 size-4 rounded-full absolute right-0 top-0 flex justify-center items-center">{countFilters}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>
                                    <span>Filtrar</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="relative p-1">
                                <Button variant="outline">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>
                                    <span>Filtrar</span>
                                </Button>
                            </div>
                        )}
                    </SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Filtrar por:</SheetTitle>
                        <div className="space-y-5">
                            <div className="flex flex-col justify-start gap-2">
                                <label htmlFor="nome-colaborador">
                                    Nome do Colaborador:
                                </label>
                                <div className="grid flex-1 gap-2">
                                    <Input
                                        id="nome-colaborador"
                                        placeholder="Nome do Colaborador"
                                        value={nome}
                                        onChange={(e) => table.getColumn("nome")?.setFilterValue(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-start gap-2">
                                <label htmlFor="matricula-colaborador">
                                    Número:
                                </label>
                                <div className="grid flex-1 gap-2">
                                    <Input
                                        id="matricula-colaborador"
                                        placeholder="Ex: 21474"
                                        value={matricula}
                                        onChange={(e) => table.getColumn("matricula")?.setFilterValue(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col justify-start gap-2">
                                <label>
                                    Cargo
                                </label>
                                <div className="grid flex-1 gap-2">
                                    <Input
                                        placeholder="Ex: Auxiliar de Operações"
                                        value={cargo}
                                        onChange={(e) => table.getColumn("cargo")?.setFilterValue(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Separador de botões */}
                <div className="h-[30px] w-px border-r border-control"></div>

                {/* Botão para Excluir */}
                <Sheet>
                    <SheetTrigger>
                        <Button variant="outline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>

                            <span>Excluir</span>
                        </Button>
                    </SheetTrigger>
                </Sheet>
            </div>
        </div>
    );
}