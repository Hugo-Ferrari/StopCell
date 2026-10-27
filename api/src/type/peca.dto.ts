import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PecaDto {
    @IsNumber()
    @IsNotEmpty()
    valor: number =0

    @IsString()
    @IsOptional()
    descricao?: string;
}