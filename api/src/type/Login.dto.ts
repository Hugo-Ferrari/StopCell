import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginDto{

    @IsEmail()
    @IsNotEmpty()
    emailUsuario: string =''

    @IsString()
    @IsNotEmpty()
    senha: string=''
}
