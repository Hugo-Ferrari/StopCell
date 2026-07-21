import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class PagamentoDto {
    @IsInt()
    @IsNotEmpty()
    numOs: number =0

    @IsNumber()
    @IsNotEmpty()
    valorPago: number =0

    @IsString()
    @IsOptional()
    formaPagamento?: string;

    @IsDateString()
    @IsOptional()
    dtPagamento?: Date;
}