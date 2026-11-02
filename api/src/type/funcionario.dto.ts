import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// usado pelo dono para cadastrar funcionários da loja
export class FuncionarioDto {
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome' })
  @MaxLength(100)
  nome!: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe o usuário' })
  @MaxLength(50)
  login!: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  emailUsuario!: string;

  @IsString()
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha!: string;

  @IsInt({ message: 'Escolha um perfil de acesso' })
  idPerfil!: number;
}

export class AtualizarFuncionarioDto extends PartialType(FuncionarioDto) {
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}