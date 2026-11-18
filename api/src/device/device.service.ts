import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AparelhoRepository } from './device.repository';
import { AparelhoDto } from '@/type/device.dto';

// código do Prisma pra chave duplicada
const CHAVE_DUPLICADA = 'P2002';

@Injectable()
export class AparelhoService {
  constructor(private readonly repository: AparelhoRepository) {}

  async cadastro(dto: AparelhoDto, cnpjEmpresa: string) {
    const cliente = await this.repository.findCliente(dto.cpfCliente, cnpjEmpresa);
    if (!cliente) {
      throw new BadRequestException('Cliente não pertence à empresa');
    }

    // a checagem é só dentro da loja. se o celular já passou por outra loja,
    // aqui ele é cadastrado de novo normalmente
    const existente = await this.repository.findById(dto.imei, cnpjEmpresa);
    if (existente) {
      throw new BadRequestException(
        existente.cpfCliente === dto.cpfCliente
          ? 'Esse aparelho já está cadastrado para este cliente. Selecione ele na lista.'
          : 'Esse IMEI já está cadastrado para outro cliente da loja.',
      );
    }

    try {
      return await this.repository.cadastro(dto, cnpjEmpresa);
    } catch (erro) {
      // dois cadastros do mesmo IMEI ao mesmo tempo: o segundo cai aqui
      if ((erro as { code?: string })?.code === CHAVE_DUPLICADA) {
        throw new BadRequestException('Esse IMEI já está cadastrado nesta loja.');
      }
      throw erro;
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