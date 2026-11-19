import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class LoginDto{

    @IsEmail()
    @IsNotEmpty()
    emailUsuario: string =''

    @IsString()
    @IsNotEmpty()
    senha: string=''

    @IsOptional()
    @IsBoolean()
    lembrar?: boolean
}
