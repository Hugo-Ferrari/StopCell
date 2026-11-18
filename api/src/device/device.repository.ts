import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AparelhoDto } from '@/type/device.dto';

// o aparelho é identificado por loja + IMEI. o mesmo celular pode estar
// cadastrado em lojas diferentes, cada uma com os seus dados
@Injectable()
export class AparelhoRepository {
  constructor(private readonly prisma: PrismaService) {}

  cadastro(dto: AparelhoDto, cnpjEmpresa: string) {
    return this.prisma.aparelho.create({ data: { ...dto, cnpjEmpresa } });
  }

  atualizar(imei: string, dto: AparelhoDto, cnpjEmpresa: string) {
    return this.prisma.aparelho.update({
      where: { cnpjEmpresa_imei: { cnpjEmpresa, imei } },
      data: dto,
    });
  }

  findCliente(cpf: string, cnpjEmpresa: string) {
    return this.prisma.cliente.findUnique({
      where: { cnpjEmpresa_cpf: { cnpjEmpresa, cpf } },
    });
  }

  // só procura dentro da loja: o que outra loja cadastrou não interfere aqui
  findById(imei: string, cnpjEmpresa: string) {
    return this.prisma.aparelho.findUnique({
      where: { cnpjEmpresa_imei: { cnpjEmpresa, imei } },
    });
  }

  // a lista geral não precisa da senha de desbloqueio
  listar(cnpjEmpresa: string) {
    return this.prisma.aparelho.findMany({
      where: { cnpjEmpresa },
      omit: { senhaAparelho: true },
    });
  }

  // traz a última O.S. de cada aparelho pra mostrar "já passou pela loja"
  listarPorCliente(cpfCliente: string, cnpjEmpresa: string) {
    return this.prisma.aparelho.findMany({
      where: { cpfCliente, cnpjEmpresa },
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
      where: { cnpjEmpresa_imei: { cnpjEmpresa, imei } },
    });
  }
}