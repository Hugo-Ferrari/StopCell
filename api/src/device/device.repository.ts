import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AparelhoDto } from '@/type/device.dto';

// o IMEI é único dentro da loja, então toda busca leva o cnpj junto
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
    return this.prisma.cliente.findFirst({ where: { cpf, cnpjEmpresa } });
  }

  findById(imei: string, cnpjEmpresa: string) {
    return this.prisma.aparelho.findUnique({
      where: { cnpjEmpresa_imei: { cnpjEmpresa, imei } },
    });
  }

  // a lista geral não leva a senha de desbloqueio: ela só aparece
  // no aparelho do cliente, na hora de abrir ou conferir a O.S.
  listar(cnpjEmpresa: string) {
    return this.prisma.aparelho.findMany({
      where: { cnpjEmpresa },
      select: {
        imei: true,
        idCategoria: true,
        idMarca: true,
        cpfCliente: true,
        modelo: true,
        cor: true,
        tipoSenha: true,
      },
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
