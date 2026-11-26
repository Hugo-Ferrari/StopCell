import { IsString, IsNotEmpty, IsInt, Matches, MaxLength } from 'class-validator';

export class AparelhoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    imei: string=''

    @IsInt()
    @IsNotEmpty()
    idCategoria: number=0

    @IsInt()
    @IsNotEmpty()
    idMarca: number=0

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'O CPF deve ter 11 números.' })
    cpfCliente: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    modelo: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    cor: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    senhaAparelho: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    tipoSenha: string=''
}