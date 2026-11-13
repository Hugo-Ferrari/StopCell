import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AparelhoDto } from '@/type/device.dto';

@Injectable()
export class AparelhoRepository {
  constructor(private readonly prisma: PrismaService) {}

  cadastro(dto: AparelhoDto) {
    return this.prisma.aparelho.create({ data: dto });
  }

  atualizar(imei: string, dto: AparelhoDto, cnpjEmpresa: string) {
    return this.prisma.aparelho.update({
      where: { imei, cliente: { cnpjEmpresa } },
      data: dto,
    });
  }

  findCliente(cpf: string, cnpjEmpresa: string) {
    return this.prisma.cliente.findFirst({ where: { cpf, cnpjEmpresa } });
  }

  findByImei(imei: string) {
    return this.prisma.aparelho.findUnique({ where: { imei } });
  }

  findById(imei: string, cnpjEmpresa: string) {
    return this.prisma.aparelho.findFirst({
      where: { imei, cliente: { cnpjEmpresa } },
    });
  }

  listar(cnpjEmpresa: string) {
    return this.prisma.aparelho.findMany({
      where: { cliente: { cnpjEmpresa } },
    });
  }

  // traz a última O.S. de cada aparelho pra mostrar "já passou pela loja"
  listarPorCliente(cpfCliente: string, cnpjEmpresa: string) {
    return this.prisma.aparelho.findMany({
      where: { cpfCliente, cliente: { cnpjEmpresa } },
      include: {
        marca: true,
        categoria: true,
        _count: { select: { ordensServico: true } },
        ordensServico: {
          select: { numOs: true, dtEntrada: true, status: true },
          orderBy: { numOs: 'desc' },
          take: 1,
        },
      },
      orderBy: { modelo: 'asc' },
    });
  }

  listarCategorias() {
    return this.prisma.categoria.findMany({ orderBy: { idCategoria: 'asc' } });
  }

  listarMarcas() {
    return this.prisma.marca.findMany({ orderBy: { idMarca: 'asc' } });
  }

  remover(imei: string, cnpjEmpresa: string) {
    return this.prisma.aparelho.delete({
      where: { imei, cliente: { cnpjEmpresa } },
    });
  }
}