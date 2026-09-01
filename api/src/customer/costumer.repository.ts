// clientes/clientes.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto/create-customer.dto';

@Injectable()
export class ClientesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(cnpjEmpresa: string) {
    return this.prisma.cliente.findMany({ where: { cnpjEmpresa } });
  }

  findByCpf(cpf: string, cnpjEmpresa: string) {
  return this.prisma.cliente.findFirst({
    where: { cpf, cnpjEmpresa },
    include: {
      aparelhos: {
        include: {
          marca: true,
          categoria: true,
        },
      },
    },
  });
}

  create(dto: CreateClienteDto & { cnpjEmpresa: string }) {
    return this.prisma.cliente.create({
      data: {
        ...dto,cnpjEmpresa: dto.cnpjEmpresa,
      },
    });
  }

  delete(cpf: string, cnpjEmpresa: string) {
    return this.prisma.cliente.delete({ where: { cpf, AND:{cnpjEmpresa} }});
  }
}