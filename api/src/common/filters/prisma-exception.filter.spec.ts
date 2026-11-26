import { ArgumentsHost, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';
import { ClientesService } from '@/customer/customer.service';
import { ClientesRepository } from '@/customer/customer.repository';

function criarErroPrisma(code: string) {
  return new Prisma.PrismaClientKnownRequestError('erro prisma', {
    code,
    clientVersion: '7.8.0',
  });
}

function criarDriverAdapterError(pgCode: string) {
  const err = new Error('driver error');
  err.name = 'DriverAdapterError';
  (err as unknown as { cause: { originalCode: string; code: string } }).cause = {
    originalCode: pgCode,
    code: pgCode,
  };
  return err;
}

function criarHost(method: string) {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status };
  const request = { method };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
    getArgByIndex: (index: number) => (index === 1 ? response : request),
  } as unknown as ArgumentsHost;

  return { host, response, status, json };
}

describe('PrismaExceptionFilter', () => {
  let applicationRef: { isHeadersSent: jest.Mock; reply: jest.Mock; end: jest.Mock };
  let filter: PrismaExceptionFilter;

  beforeEach(() => {
    applicationRef = {
      isHeadersSent: jest.fn().mockReturnValue(false),
      reply: jest.fn(),
      end: jest.fn(),
    };
    filter = new PrismaExceptionFilter(applicationRef as never);
  });

  it('mapeia P2002 para 409 Conflict com mensagem clara', () => {
    const { host, status, json } = criarHost('POST');

    filter.catch(criarErroPrisma('P2002'), host);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'Já existe um registro cadastrado com esses dados.',
      error: 'Conflict',
    });
  });

  it('mapeia P2003 em DELETE para 400 Bad Request de registro vinculado', () => {
    const { host, status, json } = criarHost('DELETE');

    filter.catch(criarErroPrisma('P2003'), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Não é possível excluir este registro pois existem outros dados vinculados a ele.',
      error: 'Bad Request',
    });
  });

  it('mapeia P2003 em POST para 400 Bad Request de referência inválida', () => {
    const { host, status, json } = criarHost('POST');

    filter.catch(criarErroPrisma('P2003'), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message:
        'Não foi possível concluir a operação: referência a um registro inexistente ou vínculo inválido.',
      error: 'Bad Request',
    });
  });

  it('mapeia DriverAdapterError 23001 (ON DELETE RESTRICT) em DELETE para 400 Bad Request', () => {
    const { host, status, json } = criarHost('DELETE');

    filter.catch(criarDriverAdapterError('23001'), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Não é possível excluir este registro pois existem outros dados vinculados a ele.',
      error: 'Bad Request',
    });
  });

  it('mapeia DriverAdapterError 23505 em POST para 409 Conflict', () => {
    const { host, status, json } = criarHost('POST');

    filter.catch(criarDriverAdapterError('23505'), host);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'Já existe um registro cadastrado com esses dados.',
      error: 'Conflict',
    });
  });

  it('mapeia P2025 para 404 Not Found', () => {
    const { host, status, json } = criarHost('PATCH');

    filter.catch(criarErroPrisma('P2025'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Registro não encontrado.',
      error: 'Not Found',
    });
  });

  it('mantém HttpException delegando ao BaseExceptionFilter', () => {
    const { host, response } = criarHost('GET');

    filter.catch(new NotFoundException('Não achou'), host);

    expect(applicationRef.reply).toHaveBeenCalledWith(
      response,
      { statusCode: 404, message: 'Não achou', error: 'Not Found' },
      404,
    );
  });

  it('delega códigos Prisma não mapeados ao BaseExceptionFilter (500)', () => {
    const { host, response } = criarHost('POST');

    filter.catch(criarErroPrisma('P2000'), host);

    expect(applicationRef.reply).toHaveBeenCalledWith(
      response,
      { statusCode: 500, message: 'Internal server error' },
      500,
    );
  });
});

describe('Tratamento de P2002 nos services de cliente e empresa', () => {
  it('ClientesService.criarCliente lança ConflictException (409) em P2002', async () => {
    const repo = {
      create: jest.fn().mockRejectedValue({ code: 'P2002' }),
    } as unknown as ClientesRepository;
    const service = new ClientesService(repo);

    await expect(
      service.criarCliente(
        {
          cpf: '12345678909',
          nmCompleto: 'Teste',
          telefone: '11999999999',
          email: 't@t.com',
          endereco: 'Rua A',
        },
        '12345678000198',
      ),
    ).rejects.toThrow(ConflictException);
  });
});
