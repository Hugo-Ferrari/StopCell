import { BadRequestException } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';
import { FinanceiroRepository } from './financeiro.repository';

const pagamento = (valorPago: number, dtSaida: Date | null, dtPagamento: Date) => ({
  numOs: 1,
  valorPago,
  dtPagamento,
  formaPagamento: 'PIX' as const,
  ordemServico: { dtSaida },
});

const despesa = (valor: number, dataDespesa: Date) => ({
  idDespesa: 1,
  descricao: 'x',
  valor,
  dataDespesa,
  idUsuario: 1,
});

function criarService(repo: Partial<Record<keyof FinanceiroRepository, jest.Mock>>) {
  return new FinanceiroService(repo as unknown as FinanceiroRepository);
}

describe('FinanceiroService', () => {
  const periodo = { inicio: '2026-11-01', fim: '2026-11-30' };

  it('calcula o resumo com saldo = receitas - despesas', async () => {
    const service = criarService({
      listarPagamentosNoPeriodo: jest.fn().mockResolvedValue([
        pagamento(300, new Date(2026, 10, 5), new Date(2026, 10, 5)),
        pagamento(200.5, new Date(2026, 10, 6), new Date(2026, 10, 6)),
      ]),
      listarDespesasNoPeriodo: jest
        .fn()
        .mockResolvedValue([despesa(100.25, new Date(2026, 10, 7))]),
    });

    const resumo = await service.resumo('123', periodo);

    expect(resumo.totalReceitas).toBe(500.5);
    expect(resumo.totalDespesas).toBe(100.25);
    expect(resumo.saldo).toBe(400.25);
    expect(resumo.quantidadeDespesas).toBe(1);
  });

  it('agrupa a receita pela data de fechamento da OS, não do pagamento', async () => {
    const service = criarService({
      listarPagamentosNoPeriodo: jest.fn().mockResolvedValue([
        pagamento(100, new Date(2026, 10, 10), new Date(2026, 10, 2)),
        pagamento(50, new Date(2026, 10, 10), new Date(2026, 10, 3)),
        pagamento(70, null, new Date(2026, 10, 4)),
      ]),
    });

    const { itens } = await service.receitasPorPeriodo('123', periodo);

    expect(itens).toEqual([
      { periodo: '2026-11-04', total: 70 },
      { periodo: '2026-11-10', total: 150 },
    ]);
  });

  it('agrupa por mês quando solicitado', async () => {
    const service = criarService({
      listarDespesasNoPeriodo: jest
        .fn()
        .mockResolvedValue([
          despesa(10, new Date(2026, 9, 31)),
          despesa(20, new Date(2026, 10, 1)),
          despesa(5, new Date(2026, 10, 20)),
        ]),
    });

    const { itens } = await service.despesasPorPeriodo('123', {
      inicio: '2026-10-01',
      fim: '2026-11-30',
      agrupar: 'mes',
    });

    expect(itens).toEqual([
      { periodo: '2026-10', total: 10 },
      { periodo: '2026-11', total: 25 },
    ]);
  });

  it('retorna todas as formas de pagamento, com zero nas sem movimento', async () => {
    const service = criarService({
      somarPorFormaPagamento: jest
        .fn()
        .mockResolvedValue([{ formaPagamento: 'PIX', _sum: { valorPago: 90 } }]),
    });

    const { itens } = await service.receitasPorFormaPagamento('123', periodo);

    expect(itens).toEqual([
      { formaPagamento: 'PIX', total: 90 },
      { formaPagamento: 'CARTAO', total: 0 },
      { formaPagamento: 'DINHEIRO', total: 0 },
      { formaPagamento: 'BOLETO', total: 0 },
    ]);
  });

  it('rejeita período invertido, data inexistente e empresa ausente', async () => {
    const service = criarService({});

    await expect(
      service.resumo('123', { inicio: '2026-11-10', fim: '2026-11-01' }),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.resumo('123', { inicio: '2026-02-31', fim: '2026-03-01' }),
    ).rejects.toThrow(BadRequestException);
    await expect(service.resumo('', periodo)).rejects.toThrow(BadRequestException);
  });
});
