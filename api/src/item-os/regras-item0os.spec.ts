import { remocaoDeixaPagoMaiorQueTotal, subtotal } from './regras-item-os';

describe('regras dos itens da O.S.', () => {
  it('calcula o subtotal sem erro de arredondamento', () => {
    expect(subtotal(3, '0.10').toFixed(2)).toBe('0.30');
    expect(subtotal(2, 149.9).toFixed(2)).toBe('299.80');
    expect(subtotal(null, '50').toFixed(2)).toBe('50.00');
  });

  it('deixa remover quando ainda não teve pagamento', () => {
    expect(remocaoDeixaPagoMaiorQueTotal('200', '50', 0)).toBe(false);
  });

  it('deixa remover se o pago continua cabendo no total', () => {
    expect(remocaoDeixaPagoMaiorQueTotal('200', '50', '150')).toBe(false);
  });

  it('bloqueia quando o pago passaria do total', () => {
    expect(remocaoDeixaPagoMaiorQueTotal('200', '50', '200')).toBe(true);
    expect(remocaoDeixaPagoMaiorQueTotal('200', '50', '150.01')).toBe(true);
  });
});