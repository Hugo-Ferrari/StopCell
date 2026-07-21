import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt } from 'class-validator';

export class PecaDto {
    @IsNumber()
    @IsNotEmpty()
    valor: number =0

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsInt()
    @IsNotEmpty()
    quantidade: number =0
}