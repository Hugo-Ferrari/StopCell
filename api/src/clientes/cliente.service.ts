// clientes/clientes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto/create-cliente.dto';
import { ClientesRepository } from './cliente.repository';

@Injectable()
export class ClientesService {
  constructor(private readonly repository: ClientesRepository) {}

  async listaCliente(cnpjEmpresa: string) {
    return await this.repository.findAll(cnpjEmpresa);
  }

  async criarCliente(dto: CreateClienteDto, cnpjEmpresa: string) {
    return await this.repository.create({ ...dto, cnpjEmpresa });
  }

  async buscarPorId(cpf: string, cnpjEmpresa: string) {
    const cliente = await this.repository.findByCpf(cpf, cnpjEmpresa);
    if (!cliente) throw new NotFoundException(`Cliente com CPF ${cpf} não encontrado`);
    console.log(JSON.stringify(cliente, null,2))
    return cliente;
  }

  async removerPorId(cpf: string, cnpjEmpresa: string) {
    await this.buscarPorId(cpf, cnpjEmpresa);
    await this.repository.delete(cpf, cnpjEmpresa);
    return null;
  }
}