import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ServicoDto {
    @IsString()
    @IsOptional()
    descricao?: string;

    @IsNumber()
    @IsNotEmpty()
    valor: number = 0
}