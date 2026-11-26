import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class UsuarioCadastroDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string = "";

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  login: string = "";

  @IsEmail()
  @MaxLength(100)
  emailUsuario: string = "";

  @MinLength(6) // senha com no minimo 6 digitos
  @IsString()
  @IsNotEmpty()
  senha: string = "";
}