import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdemServicoRepository {
    constructor(private readonly prisma: PrismaService) { }

    abrir(data: any) {
        return this.prisma.ordemServico.create({ data });
    }

    findByNumOs(numOs: number, cnpjEmpresa: string) {
        return this.prisma.ordemServico.findFirst({ where: { numOs, cnpjEmpresa } });
    }

    atualizarStatus(numOs: number, status: string, cnpjEmpresa: string) {
        return this.prisma.ordemServico.update({
            where: { numOs, cnpjEmpresa },
            data: { status },
        });
    }
    listar(cnpjEmpresa:string){
        return this.prisma.ordemServico.findMany({where:{cnpjEmpresa},
        include:{
            cliente:true,
            aparelho:true,
        },
    orderBy:{
        dtEntrada:"desc"
    }})
    }

    buscarPorNumOs(numOs: number, cnpjEmpresa: string) {
        return this.prisma.ordemServico.findFirst({
            where: { numOs, cnpjEmpresa },
            include: {
                cliente: true,
                aparelho: true,
                usuario: true,
                diagnosticos: true,
                itensOs: {
                    include: {
                        servico: true,
                        peca: true,
                    },
                },
            },
        });
    }

    buscarParaPdf(numOs: number, cnpjEmpresa: string) {
        return this.prisma.ordemServico.findFirst({
            where: { numOs, cnpjEmpresa },
            include: {
                cliente: true,
                aparelho: true,
                empresa: true,
                diagnosticos: true,
                itensOs: {
                    include: {
                        servico: true,
                        peca: true,
                    },
                },
            },
        });
    }
}