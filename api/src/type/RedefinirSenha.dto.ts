import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RedefinirSenhaDto {
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @Matches(/^\d{6}$/, { message: 'O código deve ter 6 dígitos' })
  codigo: string = '';

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  novaSenha: string = '';
}
