import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemOsDto } from '@/type/itemOs.dto';

@Injectable()
export class ItenOsRepository {
  constructor(private readonly prisma: PrismaService) {}

  registrar(dto: ItemOsDto) {
    return this.prisma.itensOs.create({
      data: {
        numOs: dto.numOs,
        idServico: dto.idServico,
        idPeca: dto.idPeca,
        quantidade: dto.quantidade,
        valorUnitario: dto.valorUnitario,
      },
    });
  }

  findOsByNumAndCompany(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
    });
  }

  findServicoById(idServico: number, cnpjEmpresa: string) {
    return this.prisma.servico.findFirst({
      where: { idServico, cnpjEmpresa },
    });
  }

  findPecaById(idPeca: number, cnpjEmpresa: string) {
    return this.prisma.peca.findFirst({
      where: { idPeca, cnpjEmpresa },
    });
  }

  findByNumOs(numOs: number, cnpjEmpresa: string) {
    return this.prisma.itensOs.findMany({
      where: {
        numOs,
        ordemServico: { cnpjEmpresa },
      },
    });
  }
}
