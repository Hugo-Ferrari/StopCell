import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class AparelhoDto {
    @IsString()
    @IsNotEmpty()
    imei: string=''

    @IsInt()
    @IsNotEmpty()
    idCategoria: number=0

    @IsInt()
    @IsNotEmpty()
    idMarca: number=0

    @IsString()
    @IsNotEmpty()
    cpfCliente: string=''

    @IsString()
    @IsNotEmpty()
    modelo: string=''

    @IsString()
    @IsNotEmpty()
    cor: string=''

    @IsString()
    @IsNotEmpty()
    senhaAparelho: string=''

    @IsString()
    @IsNotEmpty()
    tipoSenha: string=''
}