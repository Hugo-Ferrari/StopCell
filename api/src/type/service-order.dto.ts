import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusOs } from '@prisma/client';

// o atendente e o valor total não vêm mais daqui:
// o atendente sai do token e o total é calculado pelos itens lançados
export class OrdemServicoDto {
    @IsInt()
    @IsOptional()
    numOsAnterior?: number | null;

    @IsString()
    @IsNotEmpty()
    cpfCliente: string = ''

    @IsString()
    @IsNotEmpty()
    imeiAparelho: string = ''

    @IsString()
    @IsOptional()
    diagnostico?: string;
}

export class AtualizarStatusOsDto {
    @IsEnum(StatusOs, { message: 'Status inválido' })
    status!: StatusOs;
}