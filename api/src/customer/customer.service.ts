// clientes/clientes.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from '@/type/create-customer.dto';
import { ClientesRepository } from './customer.repository';

@Injectable()
export class ClientesService {
  constructor(private readonly repository: ClientesRepository) {}

  async listaCliente(cnpjEmpresa: string) {
    return await this.repository.findAll(cnpjEmpresa);
  }

  // o CPF é único dentro da loja; outra loja pode ter o próprio cadastro do mesmo cliente
  async criarCliente(dto: CreateClienteDto, cnpjEmpresa: string) {
    try {
      return await this.repository.create({ ...dto, cnpjEmpresa });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Esse CPF já está cadastrado nesta loja.');
      }
      throw error;
    }
  }

  async buscarPorId(cpf: string, cnpjEmpresa: string) {
    const cliente = await this.repository.findByCpf(cpf, cnpjEmpresa);
    if (!cliente)
      throw new NotFoundException(`Cliente com CPF ${cpf} não encontrado`);
    console.log(JSON.stringify(cliente, null, 2));
    return cliente;
  }

  async removerPorId(cpf: string, cnpjEmpresa: string) {
    await this.buscarPorId(cpf, cnpjEmpresa);
    await this.repository.delete(cpf, cnpjEmpresa);
    return null;
  }
}
