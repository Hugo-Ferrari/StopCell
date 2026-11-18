// clientes/clientes.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from '@/type/create-customer.dto';
import { ClientesRepository } from './customer.repository';

@Injectable()
export class ClientesService {
  constructor(private readonly repository: ClientesRepository) {}

  async listaCliente(cnpjEmpresa: string) {
    return await this.repository.findAll(cnpjEmpresa);
  }

  async criarCliente(dto: CreateClienteDto, cnpjEmpresa: string) {
    try {
      return await this.repository.create({ ...dto, cnpjEmpresa });
    } catch (erro) {
      // CPF repetido dentro da mesma loja. em outra loja pode, o cliente é por loja
      if ((erro as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Já existe um cliente com esse CPF nesta loja.');
      }
      throw erro;
    }
  }

  async buscarPorId(cpf: string, cnpjEmpresa: string) {
    const cliente = await this.repository.findByCpf(cpf, cnpjEmpresa);
    if (!cliente)
      throw new NotFoundException(`Cliente com CPF ${cpf} não encontrado`);
    return cliente;
  }

  async removerPorId(cpf: string, cnpjEmpresa: string) {
    await this.buscarPorId(cpf, cnpjEmpresa);
    await this.repository.delete(cpf, cnpjEmpresa);
    return null;
  }
}