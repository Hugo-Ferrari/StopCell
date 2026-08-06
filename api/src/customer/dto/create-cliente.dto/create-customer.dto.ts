import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    cpf: string =''

    @IsEmail()
    @IsNotEmpty()
    email: string=''

    @IsString()
    @IsNotEmpty()
    nmCompleto: string=''

    @IsString()
    @IsNotEmpty()
    telefone: string=''

    @IsString()
    @IsNotEmpty()
    endereco: string=''
}