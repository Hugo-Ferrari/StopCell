import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ItemOsRepository } from './item-os.repository';
import { ItemOsDto } from '@/type/itemOs.dto';
import { estaEncerrada } from '@/ordem-servico/status-os';
import { remocaoDeixaPagoMaiorQueTotal, subtotal } from './regras-item-os';

@Injectable()
export class ItemOsService {
  constructor(private readonly repository: ItemOsRepository) {}

  async registrar(dto: ItemOsDto, cnpjEmpresa: string) {
    const ordemServico = await this.repository.findOsByNumAndCompany(
      dto.numOs,
      cnpjEmpresa,
    );
    if (!ordemServico) {
      throw new NotFoundException(
        'Ordem de serviço não encontrada para esta empresa',
      );
    }

    if (estaEncerrada(ordemServico.status)) {
      throw new BadRequestException(
        'Essa ordem de serviço já foi encerrada e não pode receber itens',
      );
    }

    return await this.repository.registrar(dto);
  }

  async remover(idItemOs: number, cnpjEmpresa: string) {
    const item = await this.repository.findItemDaEmpresa(idItemOs, cnpjEmpresa);

    if (!item) {
      throw new NotFoundException('Item não encontrado para esta empresa');
    }

    const os = item.ordemServico;

    if (estaEncerrada(os.status)) {
      throw new BadRequestException(
        'Não dá para remover itens de uma ordem de serviço encerrada',
      );
    }

    const totalPago = os.pagamentos.reduce(
      (soma, pagamento) => soma.plus(pagamento.valorPago ?? 0),
      new Prisma.Decimal(0),
    );

    if (
      remocaoDeixaPagoMaiorQueTotal(
        os.vlTotal,
        subtotal(item.quantidade, item.valorUnitario),
        totalPago,
      )
    ) {
      throw new BadRequestException(
        'O cliente já pagou mais do que ficaria o total sem esse item. Faça o estorno antes de remover.',
      );
    }

    await this.repository.remover(idItemOs, item.numOs);
  }

  async findByNumOs(numOs: number, cnpjEmpresa: string) {
    return await this.repository.findByNumOs(numOs, cnpjEmpresa);
  }
}