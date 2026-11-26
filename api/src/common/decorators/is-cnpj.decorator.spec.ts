import { cnpjValido } from './is-cnpj.decorator';

describe('cnpjValido', () => {
  it('aceita CNPJ numérico com dígitos corretos', () => {
    expect(cnpjValido('11222333000181')).toBe(true);
  });

  it('aceita CNPJ alfanumérico com dígitos corretos', () => {
    expect(cnpjValido('12ABC34501DE35')).toBe(true);
  });

  it('rejeita dígito verificador errado', () => {
    expect(cnpjValido('11222333000182')).toBe(false);
    expect(cnpjValido('12ABC34501DE36')).toBe(false);
  });

  it('rejeita CNPJ com todos os caracteres iguais', () => {
    expect(cnpjValido('00000000000000')).toBe(false);
  });

  it('rejeita tamanho, formato ou tipo inválido', () => {
    expect(cnpjValido('1122233300018')).toBe(false);
    expect(cnpjValido('11.222.333/0001-81')).toBe(false);
    expect(cnpjValido('12abc34501de35')).toBe(false);
    expect(cnpjValido(11222333000181)).toBe(false);
  });
});
