import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class PecaDto {
    @IsNumber()
    @IsNotEmpty()
    valor: number =0

    @IsString()
    @IsOptional()
    @MaxLength(150)
    descricao?: string;
}