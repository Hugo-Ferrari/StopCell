import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PagamentoPixDto {
    @IsInt()
    @IsNotEmpty()
    numOs: number =0

    @IsNumber()
    @IsNotEmpty()
    valorPago: number =0

    @IsString()
    @IsOptional()
    chavePix?: string;
}