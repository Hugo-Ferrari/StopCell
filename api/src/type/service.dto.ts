import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class ServicoDto {
    @IsString()
    @IsOptional()
    @MaxLength(150)
    descricao?: string;

    @IsNumber()
    @IsNotEmpty()
    valor: number = 0
}