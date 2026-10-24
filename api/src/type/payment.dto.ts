
import {
  IsInt,
  IsNumber,
  IsEnum,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { FormaPagamento } from '@prisma/client';

export class PagamentoDto {
  @IsInt()
  @Min(1)
  numOs!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valorPago!: number;

  @IsNotEmpty()
  @IsEnum(FormaPagamento)
  formaPagamento!: FormaPagamento;
}
