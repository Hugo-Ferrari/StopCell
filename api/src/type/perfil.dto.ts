import { ArrayUnique, IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { TODAS_PERMISSOES } from '@/common/permissoes/catalogo';

export class PerfilDto {
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do perfil' })
  @MaxLength(50)
  nome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  descricao?: string;

  @IsArray()
  @ArrayUnique()
  @IsIn(TODAS_PERMISSOES, { each: true, message: 'Permissão inválida: $value' })
  permissoes!: string[];
}

export class AtualizarPerfilDto extends PartialType(PerfilDto) {}