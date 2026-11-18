import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UsuarioCadastroDto {

  @IsString()
  @IsNotEmpty()
  nome: string = "";

  @IsString()
  @IsNotEmpty()
  login: string = "";

  @IsEmail()
  emailUsuario: string = "";

  @MinLength(6) // senha com no minimo 6 digitos
  @IsString()
  @IsNotEmpty()
  senha: string = "";
}