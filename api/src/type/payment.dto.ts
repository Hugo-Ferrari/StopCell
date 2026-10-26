import {
  IsInt,
  IsNumber,
  IsEnum,
  Min,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormaPagamento } from '@prisma/client';

export class ItemPagamentoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valorPago!: number;

  @IsNotEmpty()
  @IsEnum(FormaPagamento)
  formaPagamento!: FormaPagamento;
}

export class PagamentoDto {
  @IsInt()
  @Min(1)
  numOs!: number;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Informe pelo menos uma forma de pagamento',
  })
  @ValidateNested({ each: true })
  @Type(() => ItemPagamentoDto)
  pagamentos!: ItemPagamentoDto[];
}
