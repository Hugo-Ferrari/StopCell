import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

interface DriverErrorCause {
  code?: string;
  originalCode?: string;
}

function extrairCodigoPrisma(exception: unknown): string | null {
  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    return exception.code;
  }

  // @prisma/adapter-pg não converte SQLSTATE 23001 (ON DELETE RESTRICT) para P2003
  if (exception instanceof Error && exception.name === 'DriverAdapterError') {
    const cause = (exception as { cause?: DriverErrorCause }).cause;
    const pgCode = cause?.originalCode ?? cause?.code;

    if (pgCode === '23001' || pgCode === '23503') return 'P2003';
    if (pgCode === '23505') return 'P2002';
  }

  return null;
}

/**
 * Converte erros conhecidos do Prisma (e restrições do adapter pg) em respostas HTTP adequadas.
 */
@Catch()
export class PrismaExceptionFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException) {
      super.catch(exception, host);
      return;
    }

    const code = extrairCodigoPrisma(exception);
    if (!code) {
      super.catch(exception, host);
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    switch (code) {
      case 'P2002':
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Já existe um registro cadastrado com esses dados.',
          error: 'Conflict',
        });
        return;

      case 'P2003': {
        const message =
          request?.method === 'DELETE'
            ? 'Não é possível excluir este registro pois existem outros dados vinculados a ele.'
            : 'Não foi possível concluir a operação: referência a um registro inexistente ou vínculo inválido.';
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message,
          error: 'Bad Request',
        });
        return;
      }

      case 'P2025':
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado.',
          error: 'Not Found',
        });
        return;

      default:
        super.catch(exception, host);
    }
  }
}
