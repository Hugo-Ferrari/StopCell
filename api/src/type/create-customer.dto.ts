import { IsString, IsNotEmpty, IsEmail, Matches, MaxLength } from 'class-validator';

export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'O CPF deve ter 11 números.' })
    cpf: string =''

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nmCompleto: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    telefone: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    endereco: string=''
}