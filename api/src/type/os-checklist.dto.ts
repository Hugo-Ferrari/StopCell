import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export const STATUS_CHECKLIST = ['OK', 'NOK', 'NA'] as const;

export class osChecklistDto {
  @IsString()
  @IsNotEmpty()
  status: string = '';
}

export class ItemChecklistOsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  descricao!: string;

  @IsIn(STATUS_CHECKLIST)
  status!: (typeof STATUS_CHECKLIST)[number];

  @IsString()
  @IsOptional()
  @MaxLength(255)
  observacao?: string;
}

// a tela manda o checklist inteiro de uma vez; item que não vier é apagado da O.S.
export class SalvarChecklistOsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemChecklistOsDto)
  itens!: ItemChecklistOsDto[];
}