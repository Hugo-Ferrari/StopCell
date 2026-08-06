import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Smartphone, UserStar } from "lucide-react";
import { buscarOrdemServicoPorNumero } from "@/services/ordemServico.service";
import { criandoPeca, type PecaDto } from "@/services/peca.service";
import { criarServico, type ServicoDto } from "@/services/servico.service";

interface OrdemDetalheInterface {
    numOs: number;
    status: string;
    diagnostico?: string;
    dtEntrada?: string;
    dtSaida?: string;
    vlTotal?: string;
    cliente?: {
        nmCompleto?: string;
        telefone?: string;
        email?: string;
    };
    aparelho?: {
        modelo?: string;
        cor?: string;
        imei?: string;
    };
    usuario?: {
        nome?: string;
    };
    diagnosticos?: Array<{
        relatoTecnico?: string;
    }>;
    itensOs?: Array<{
        quantidade?: number;
        valorUnitario?: string;
        servico?: {
            descricao?: string;
        };
        peca?: {
            descricao?: string;
        };
    }>;
}


function DetalhesOrdemServico() {
    const { numOs } = useParams();
    const [ordem, setOrdem] = useState<OrdemDetalheInterface | null>(null);
    const [carregando, setCarregando] = useState(true);

// colocar quantidade para os valores dasa peças se multiplicarem e colocar o valor total, acho que a descrição da peça e da mão de obra vai ser irrelevante(caso nn for, adicionar)
    const [descricao, setDescricao] = useState("")
    const [valorPeca, setValorPeca] = useState(0)
    const [quantidade, setQuantidade] = useState(1)

    const [descricaoServico, setDescricaoServico] = useState("")
    const [valorServico, setValorServico] = useState(0)
    async function HandleSubmit(e: React.FormEvent) {
        try {
            const data: PecaDto = {
                descricao,
                valorPeca,
                quantidade
            }
            const dataServico: ServicoDto = {
                descricao,
                valorServico,
            }
            const responsePeca = await criandoPeca(data)
            const responseServico = await criarServico(dataServico)

            return {
                responsePeca, responseServico
            }



        }
        catch (err: any) {
            console.log(err)
        }


    }

    useEffect(() => {
        async function carregarOrdem() {
            if (!numOs) return;

            try {
                const dados = await buscarOrdemServicoPorNumero(Number(numOs));
                setOrdem(dados);
            } catch (error) {
                console.error(error);
            } finally {
                setCarregando(false);
            }
        }

        carregarOrdem();
    }, [numOs]);

    if (carregando) {
        return <p className="text-muted-foreground">Carregando ordem...</p>;
    }

    if (!ordem) {
        return <p className="text-muted-foreground">Ordem não encontrada.</p>;
    }

    return (
        <div className="flex flex-col">
            <Link to="/ordemServico" className="flex items-center  text-sm text-primary ">
                <ArrowLeft size={25} />
            </Link>

            <div className="   p-2 shadow-sm">
                <div className="flex items-center justify-between bg-card p-3 rounded-2xl">
                    <div className="border text-primary px-3 py-5 rounded-2xl">
                        <Smartphone size={30} />

                    </div>
                    <div className="flex flex-col gap-2">

                        <h1 className="text-2xl font-semibold">#{ordem.numOs}</h1>
                        <h2 className="text-sm">Cliente: {ordem.cliente?.nmCompleto}</h2>
                        <h2 className="text-sm">Modelo: {ordem.aparelho?.modelo}</h2>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 mr-2 py-1 text-sm font-medium text-primary mb-14">
                        {ordem.status}
                    </span>
                </div>


                <div className="mt-6 rounded-xl">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Diagnóstico Técnico
                    </h2>
                    <div className="">
                        <textarea
                            readOnly
                            value={ordem.diagnostico || ordem.diagnosticos?.[0]?.relatoTecnico || "Sem diagnóstico registrado."}
                            className="bg-card min-h-36 w-full resize-none rounded-lg border border-border  p-4 text-sm text-foreground outline-none"
                        ></textarea>

                    </div>

                </div>

                <div className="mt-6 rounded-xl ">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Orçamento</h2>
                    <div className="bg-card">
                        <div className="grid p-4 text-sm text-muted-foreground sm:grid-cols-3 bg-card gap-2">

                            <form onSubmit={HandleSubmit}>

                                <div className="p-2 flex">
                                    {/** preciso retornar as descrições de Servico e da peça caso necessario, se nn for necessario pode se excuir ela */}
                                    <label >
                                        Peça:
                                    </label>
                                    <input type="number" value={valorPeca ===0? "" : valorPeca} onChange={(e) => setValorPeca(Number(e.target.value))} />


                                </div>
                                <div className="p-2 flex">
                                    <label >
                                        Serviço:
                                    </label>
                                    <input type="number" value={valorServico === 0? "" : valorServico} onChange={(e) => setValorServico(Number(e.target.value))} />


                                </div>
                                <div>
                                

                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default DetalhesOrdemServico;
