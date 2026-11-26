import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { StatusOs } from '@prisma/client';

// o atendente e o valor total não vêm mais daqui:
// o atendente sai do token e o total é calculado pelos itens lançados
export class OrdemServicoDto {
    @IsInt()
    @IsOptional()
    numOsAnterior?: number | null;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'O CPF deve ter 11 números.' })
    cpfCliente: string = ''

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    imeiAparelho: string = ''

    @IsString()
    @IsOptional()
    diagnostico?: string;
}

export class AtualizarStatusOsDto {
    @IsEnum(StatusOs, { message: 'Status inválido' })
    status!: StatusOs;
}