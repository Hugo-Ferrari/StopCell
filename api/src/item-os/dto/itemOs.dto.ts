import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ItemOsDto {
    @IsInt()
    @IsNotEmpty()
    numOs: number= 0

    @IsInt()
    @IsOptional()
    idServico?: number;

    @IsInt()
    @IsOptional()
    idPeca?: number;

    @IsInt()
    @IsNotEmpty()
    quantidade: number =0

    @IsNumber()
    @IsNotEmpty()
    valorUnitario: number =0
}