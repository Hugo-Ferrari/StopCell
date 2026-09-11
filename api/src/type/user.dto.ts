import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsuarioCadastroDto {

  @IsString()
  @IsNotEmpty()
  nome: string = "";

  @IsString()
  @IsNotEmpty()
  login: string = "";

  @IsEmail()
  emailUsuario: string = "";

  @IsString()
  @IsNotEmpty()
  senha: string = "";
}