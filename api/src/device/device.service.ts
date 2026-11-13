import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AparelhoRepository } from './device.repository';
import { AparelhoDto } from '@/type/device.dto';

@Injectable()
export class AparelhoService {
  constructor(private readonly repository: AparelhoRepository) {}

  async cadastro(dto: AparelhoDto, cnpjEmpresa: string) {
    const cliente = await this.repository.findCliente(dto.cpfCliente, cnpjEmpresa);
    if (!cliente) {
      throw new BadRequestException('Cliente não pertence à empresa');
    }

    // o IMEI é a chave do aparelho. antes o erro do banco vazava como 500
    const existente = await this.repository.findByImei(dto.imei);
    if (existente) {
      throw new BadRequestException(
        existente.cpfCliente === dto.cpfCliente
          ? 'Esse aparelho já está cadastrado para este cliente. Selecione ele na lista.'
          : 'Esse IMEI já está cadastrado para outro cliente.',
      );
    }

    return this.repository.cadastro(dto);
  }

  listar(cnpjEmpresa: string) {
    return this.repository.listar(cnpjEmpresa);
  }

  listarPorCliente(cpf: string, cnpjEmpresa: string) {
    return this.repository.listarPorCliente(cpf, cnpjEmpresa);
  }

  async listarOpcoes() {
    const [categorias, marcas] = await Promise.all([
      this.repository.listarCategorias(),
      this.repository.listarMarcas(),
    ]);
    return { categorias, marcas };
  }

  async atualizar(imei: string, dto: AparelhoDto, cnpjEmpresa: string) {
    const aparelho = await this.repository.findById(imei, cnpjEmpresa);
    if (!aparelho) {
      throw new NotFoundException('Aparelho não encontrado');
    }

    // o IMEI e o dono não mudam por aqui, só os dados do aparelho
    return this.repository.atualizar(imei, { ...dto, imei, cpfCliente: aparelho.cpfCliente }, cnpjEmpresa);
  }

  remover(imei: string, cnpjEmpresa: string) {
    return this.repository.remover(imei, cnpjEmpresa);
  }
}