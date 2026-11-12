import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

export class PeriodoQueryDto {
  @IsOptional()
  @Matches(DATA_ISO, { message: 'inicio deve estar no formato YYYY-MM-DD' })
  inicio?: string;

  @IsOptional()
  @Matches(DATA_ISO, { message: 'fim deve estar no formato YYYY-MM-DD' })
  fim?: string;
}

export class SerieQueryDto extends PeriodoQueryDto {
  @IsOptional()
  @IsIn(['dia', 'mes'])
  agrupar?: 'dia' | 'mes';
}

export class UltimosPagamentosQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limite?: number;
}

export class CriarDespesaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  descricao!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor!: number;

  @IsOptional()
  @Matches(DATA_ISO, { message: 'dataDespesa deve estar no formato YYYY-MM-DD' })
  dataDespesa?: string;
}
