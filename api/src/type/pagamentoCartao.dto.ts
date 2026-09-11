import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PagamentoCartaoDto {
    @IsInt()
    @IsNotEmpty()
    numOs: number =0

    @IsNumber()
    @IsNotEmpty()
    valorPago: number =0

    @IsInt()
    @IsNotEmpty()
    numParcelas: number =0

    @IsString()
    @IsOptional()
    bandeira?: string;

    @IsString()
    @IsOptional()
    tipoCartao?: string;

    @IsString()
    @IsOptional()
    ultimosDigitos?: string;
}