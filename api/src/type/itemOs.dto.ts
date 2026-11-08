import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { TipoItemOs } from '@prisma/client';

// sem estoque: o técnico digita o que foi usado/feito e quanto cobrou
export class ItemOsDto {
    @IsInt()
    numOs!: number;

    @IsEnum(TipoItemOs, { message: 'O tipo deve ser PECA ou SERVICO' })
    tipo!: TipoItemOs;

    @IsString()
    @IsNotEmpty({ message: 'Informe a descrição do item' })
    @MaxLength(150)
    descricao!: string;

    @IsInt()
    @Min(1, { message: 'A quantidade deve ser maior que zero' })
    quantidade!: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01, { message: 'O valor deve ser maior que zero' })
    valorUnitario!: number;
}