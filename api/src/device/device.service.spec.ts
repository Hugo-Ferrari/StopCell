import { BadRequestException } from '@nestjs/common';
import { AparelhoService } from './device.service';

describe('AparelhoService - cadastro', () => {
  const dto = {
    imei: '356938035643809',
    idCategoria: 1,
    idMarca: 1,
    cpfCliente: '12345678909',
    modelo: 'iPhone 11',
    cor: 'Preto',
    senhaAparelho: '1234',
    tipoSenha: 'Numérica (PIN)',
  };

  let repository: { findCliente: jest.Mock; findById: jest.Mock; cadastro: jest.Mock };
  let service: AparelhoService;

  beforeEach(() => {
    repository = {
      findCliente: jest.fn().mockResolvedValue({ cpf: dto.cpfCliente }),
      findById: jest.fn().mockResolvedValue(null),
      cadastro: jest.fn().mockResolvedValue({ ...dto, cnpjEmpresa: '11111111000111' }),
    };
    service = new AparelhoService(repository as any);
  });

  it('cadastra o aparelho na loja de quem está logado', async () => {
    await service.cadastro(dto, '11111111000111');

    expect(repository.findById).toHaveBeenCalledWith(dto.imei, '11111111000111');
    expect(repository.cadastro).toHaveBeenCalledWith(dto, '11111111000111');
  });

  it('recusa IMEI que já existe na mesma loja', async () => {
    repository.findById.mockResolvedValue({ ...dto, cpfCliente: '99999999999' });

    await expect(service.cadastro(dto, '11111111000111')).rejects.toThrow(
      'Esse IMEI já está cadastrado para outro cliente da loja.',
    );
    expect(repository.cadastro).not.toHaveBeenCalled();
  });

  it('dois cadastros ao mesmo tempo: o segundo recebe mensagem, não erro 500', async () => {
    repository.cadastro.mockRejectedValue({ code: 'P2002' });

    await expect(service.cadastro(dto, '11111111000111')).rejects.toThrow(BadRequestException);
    await expect(service.cadastro(dto, '11111111000111')).rejects.toThrow(
      'Esse IMEI já está cadastrado nesta loja.',
    );
  });

  it('outros erros do banco continuam subindo', async () => {
    const erro = new Error('conexão caiu');
    repository.cadastro.mockRejectedValue(erro);

    await expect(service.cadastro(dto, '11111111000111')).rejects.toBe(erro);
  });

  it('recusa cliente de outra loja', async () => {
    repository.findCliente.mockResolvedValue(null);

    await expect(service.cadastro(dto, '11111111000111')).rejects.toThrow('Cliente não pertence à empresa');
  });
});
