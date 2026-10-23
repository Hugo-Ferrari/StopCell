import { BadRequestException, Injectable } from '@nestjs/common';
import { PagamentoRepository } from './payment.repository';
import { PagamentoDto } from '@/type/payment.dto';

@Injectable()
export class PagamentoService {
  constructor(private readonly repository: PagamentoRepository) {}

  async registrar(dto: PagamentoDto, cnpjEmpresa: string) {
    if (!cnpjEmpresa) throw new BadRequestException('Empresa não identificada');

    const ordermServico = await this.repository.buscarOsParaPagamento(
      dto.numOs,
      cnpjEmpresa,
    );

    if (!ordermServico)
      throw new BadRequestException('Ordem de serviço não encontrada');

    const ValorPago = (ordermServico?.pagamentos ?? []).reduce(
      (acc, pagamentoAtual) => {
        return acc + Number(pagamentoAtual?.valorPago ?? 0);
      },
      0,
    );

    const saldo = Number(ordermServico.vlTotal ?? 0) - ValorPago;

    if (saldo <=  0) {
     throw new Error('O pagamento ultrapassa o saldo restante');
   } 
    if (saldo < dto.valorPago) {
      throw new Error('Valor maior que o proposto');
    } 
       
      return await this.repository.registrar(dto)
      
    }
  
}
