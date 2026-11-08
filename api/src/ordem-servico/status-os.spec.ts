import { estaEncerrada, podeMudarStatus } from './status-os';

describe('fluxo de status da O.S.', () => {
  it('segue o caminho normal até finalizar', () => {
    expect(podeMudarStatus('ABERTA', 'DIAGNOSTICO')).toBe(true);
    expect(podeMudarStatus('DIAGNOSTICO', 'EM_APROVACAO')).toBe(true);
    expect(podeMudarStatus('EM_APROVACAO', 'EM_REPARO')).toBe(true);
    expect(podeMudarStatus('EM_REPARO', 'FINALIZADO')).toBe(true);
  });

  it('não deixa pular etapa', () => {
    expect(podeMudarStatus('ABERTA', 'FINALIZADO')).toBe(false);
    expect(podeMudarStatus('ABERTA', 'EM_REPARO')).toBe(false);
    expect(podeMudarStatus('DIAGNOSTICO', 'EM_REPARO')).toBe(false);
  });

  it('vai e volta entre reparo e aguardando peça', () => {
    expect(podeMudarStatus('EM_REPARO', 'AGUARDANDO_PECA')).toBe(true);
    expect(podeMudarStatus('AGUARDANDO_PECA', 'EM_REPARO')).toBe(true);
    expect(podeMudarStatus('AGUARDANDO_PECA', 'FINALIZADO')).toBe(false);
  });

  it('não sai de finalizado nem de cancelado', () => {
    expect(podeMudarStatus('FINALIZADO', 'EM_REPARO')).toBe(false);
    expect(podeMudarStatus('CANCELADO', 'ABERTA')).toBe(false);
    expect(estaEncerrada('FINALIZADO')).toBe(true);
    expect(estaEncerrada('CANCELADO')).toBe(true);
    expect(estaEncerrada('EM_REPARO')).toBe(false);
  });

  it('cancela de qualquer status em aberto', () => {
    for (const status of ['ABERTA', 'DIAGNOSTICO', 'EM_APROVACAO', 'EM_REPARO', 'AGUARDANDO_PECA'] as const) {
      expect(podeMudarStatus(status, 'CANCELADO')).toBe(true);
    }
  });
});