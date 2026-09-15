import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ItenOsRepository } from './item-os.repository';
import { ItemOsDto } from '@/type/itemOs.dto';

@Injectable()
export class ItemOsService {
  constructor(private readonly repository: ItenOsRepository) {}

  async registrar(dto: ItemOsDto, cnpjEmpresa: string) {
    const possuiServico = dto.idServico != null;
    const possuiPeca = dto.idPeca != null;

    if (possuiServico === possuiPeca) {
      throw new BadRequestException(
        'Informe exatamente um idServico ou idPeca',
      );
    }

    if (dto.quantidade <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero');
    }

    const ordemServico = await this.repository.findOsByNumAndCompany(
      dto.numOs,
      cnpjEmpresa,
    );
    if (!ordemServico) {
      throw new NotFoundException(
        'Ordem de serviço não encontrada para esta empresa',
      );
    }

    if (possuiServico) {
      const servico = await this.repository.findServicoById(
        dto.idServico!,
        cnpjEmpresa,
      );
      if (!servico) {
        throw new NotFoundException('Serviço não encontrado para esta empresa');
      }
    }

    if (possuiPeca) {
      const peca = await this.repository.findPecaById(dto.idPeca!, cnpjEmpresa);
      if (!peca) {
        throw new NotFoundException('Peça não encontrada para esta empresa');
      }
      if ((peca.quantidade ?? 0) < dto.quantidade) {
        throw new BadRequestException('Estoque insuficiente para esta peça'); // a peça precisa subtrair no estoque quando for colocada no itens-os
      }
    }

    return await this.repository.registrar(dto);
  }

  async findByNumOs(numOs: number, cnpjEmpresa: string) {
    return await this.repository.findByNumOs(numOs, cnpjEmpresa);
  }
}
