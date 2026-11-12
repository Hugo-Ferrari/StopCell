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

    // o IMEI é único dentro da loja; em outra loja o mesmo aparelho tem cadastro próprio
    const existente = await this.repository.findById(dto.imei, cnpjEmpresa);
    if (existente) {
      throw new BadRequestException(
        existente.cpfCliente === dto.cpfCliente
          ? 'Esse aparelho já está cadastrado para este cliente. Selecione ele na lista.'
          : 'Esse IMEI já está cadastrado para outro cliente da loja.',
      );
    }

    // dois cadastros do mesmo IMEI ao mesmo tempo passam pela conferência acima;
    // o segundo esbarra na chave do banco, e aí recebe a mesma mensagem em vez de 500
    try {
      return await this.repository.cadastro(dto, cnpjEmpresa);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('Esse IMEI já está cadastrado nesta loja.');
      }
      throw error;
    }
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

  async remover(imei: string, cnpjEmpresa: string) {
    const aparelho = await this.repository.findById(imei, cnpjEmpresa);
    if (!aparelho) {
      throw new NotFoundException('Aparelho não encontrado');
    }

    return this.repository.remover(imei, cnpjEmpresa);
  }
}